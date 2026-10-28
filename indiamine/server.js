
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const app = express();
const PORT = 4000;
const STORAGE = 'D:\\AniGalnexo';
const VIDEOS = path.join(STORAGE, 'videos');
const TEMP = path.join(STORAGE, 'temp');
const DB = path.join(STORAGE, 'videos.json');
const CHUNK_SIZE = 8 * 1024 * 1024;

await fs.mkdir(VIDEOS, { recursive: true });
await fs.mkdir(TEMP, { recursive: true });


app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));

async function readDB() {
    try {
        return JSON.parse(await fs.readFile(DB, 'utf8'));
    } catch {
        return [];
    }
}

async function writeDB(data) {
    await fs.writeFile(DB, JSON.stringify(data, null, 2));
}

const uploads = new Map();

const THUMBNAILS = path.join(STORAGE, 'thumbnails');
await fs.mkdir(THUMBNAILS, { recursive: true });

const allowedThumbnailTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

app.post('/api/thumbnails', async (req, res) => {
    const contentType = String(req.headers['content-type'] || '')
        .split(';')[0]
        .trim()
        .toLowerCase();

    const ext = allowedThumbnailTypes[contentType];

    if (!ext) {
        return res.status(400).json({
            error: 'Use a JPG, PNG, or WebP thumbnail.',
        });
    }

    const filename = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(THUMBNAILS, filename);
    let size = 0;
    const maxSize = 10 * 1024 * 1024;

    try {
        const handle = await fs.open(filePath, 'wx');

        try {
            for await (const chunk of req) {
                size += chunk.length;

                if (size > maxSize) {
                    throw new Error('Thumbnail must be 10 MB or smaller.');
                }

                await handle.write(chunk);
            }
        } finally {
            await handle.close();
        }

        if (size === 0) {
            throw new Error('Thumbnail file is empty.');
        }

        res.json({ thumbnailFile: filename });
    } catch (error) {
        await fs.rm(filePath, { force: true });

        res.status(400).json({
            error: error instanceof Error ? error.message : 'Thumbnail upload failed.',
        });
    }
});

app.get('/api/thumbnails/:filename', async (req, res) => {
    const filename = path.basename(req.params.filename);

    if (filename !== req.params.filename) {
        return res.status(400).end();
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
    };

    if (!mimeTypes[ext]) return res.status(400).end();

    try {
        const filePath = path.join(THUMBNAILS, filename);
        await fs.access(filePath);
        res.setHeader('Content-Type', mimeTypes[ext]);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.sendFile(filePath);
    } catch {
        res.status(404).json({ error: 'Thumbnail not found.' });
    }
});


app.get('/api/health', (_req, res) => {
    res.json({ ok: true, storage: VIDEOS });
});

app.post('/api/uploads/init', async (req, res) => {
    const { name, size, title, genre, episodesCount, synopsis } = req.body;

    if (!name || !Number.isSafeInteger(size) || size <= 0 || !title?.trim()) {
        return res.status(400).json({ error: 'Invalid upload details.' });
    }

    if (!/\.(mp4|webm|mov|mkv)$/i.test(name)) {
        return res.status(400).json({ error: 'Unsupported video format.' });
    }

    const id = crypto.randomUUID();
    uploads.set(id, {
        id,
        name: path.basename(name),
        size,
        received: 0,
        title: title.trim(),
        genre: String(genre || ''),
        episodesCount: Number(episodesCount) || 1,
        synopsis: String(synopsis || ''),
    });

    await fs.writeFile(path.join(TEMP, `${id}.part`), '');
    res.json({ uploadId: id, chunkSize: CHUNK_SIZE });
});

app.post('/api/uploads/:id/chunk', async (req, res) => {
    const upload = uploads.get(req.params.id);

    if (!upload) return res.status(404).json({ error: 'Upload session not found.' });

    const start = Number(req.headers['x-chunk-start']);
    const chunkSize = Number(req.headers['content-length']);

    if (
        !Number.isSafeInteger(start) ||
        start !== upload.received ||
        !Number.isSafeInteger(chunkSize) ||
        chunkSize <= 0 ||
        chunkSize > CHUNK_SIZE ||
        start + chunkSize > upload.size
    ) {
        return res.status(400).json({ error: 'Invalid chunk position or size.' });
    }

    try {
        const tempPath = path.join(TEMP, `${upload.id}.part`);
        const handle = await fs.open(tempPath, 'a');

        try {
            let received = 0;

            for await (const piece of req) {
                received += piece.length;

                if (received > chunkSize) {
                    throw new Error('Chunk exceeds declared size.');
                }

                await handle.write(piece);
            }

            if (received !== chunkSize) {
                throw new Error('Chunk size mismatch.');
            }
        } finally {
            await handle.close();
        }

        upload.received += chunkSize;
        res.json({ received: upload.received, total: upload.size });
    } catch (error) {
        res.status(400).json({ error: 'Chunk failed. Retry from the last confirmed position.' });
    }
});

app.post('/api/uploads/:id/complete', async (req, res) => {
    const upload = uploads.get(req.params.id);

    if (!upload) return res.status(404).json({ error: 'Upload session not found.' });

    if (upload.received !== upload.size) {
        return res.status(400).json({ error: 'Upload is incomplete.' });
    }

    const ext = path.extname(upload.name).toLowerCase();
    const videoFile = `${upload.id}${ext}`;
    const finalPath = path.join(VIDEOS, videoFile);
    const tempPath = path.join(TEMP, `${upload.id}.part`);

    await fs.rename(tempPath, finalPath);

    const record = {
        id: upload.id,
        title: upload.title,
        genre: upload.genre,
        episodesCount: upload.episodesCount,
        synopsis: upload.synopsis,
        originalName: upload.name,
        videoFile,
        size: upload.size,
        status: 'Pending',
        uploadedDate: new Date().toISOString(),
    };

    const records = await readDB();
    records.unshift(record);
    await writeDB(records);
    uploads.delete(upload.id);

    res.json({ success: true, video: record });
});

app.get('/api/videos', async (_req, res) => {
    res.json(await readDB());
});

app.get('/api/videos/:id/stream', async (req, res) => {
    const records = await readDB();
    const record = records.find((video) => video.id === req.params.id);

    if (!record) return res.status(404).json({ error: 'Video not found.' });

    const filePath = path.join(VIDEOS, path.basename(record.videoFile));

    try {
        const stat = await fs.stat(filePath);
        const range = req.headers.range;

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');

        if (!range) {
            res.setHeader('Content-Length', stat.size);
            return fs.createReadStream(filePath).pipe(res);
        }

        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!match) return res.status(416).end();

        const start = Number(match[1]);
        const end = Math.min(match[2] ? Number(match[2]) : stat.size - 1, stat.size - 1);

        if (start >= stat.size || end < start) {
            return res.status(416).end();
        }

        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
        res.setHeader('Content-Length', end - start + 1);

        fs.createReadStream(filePath, { start, end }).pipe(res);
    } catch {
        res.status(404).json({ error: 'Video file missing from disk.' });
    }
});

app.patch('/api/videos/:id/status', async (req, res) => {
    const allowedStatuses = ['Pending', 'Live', 'Rejected'];
    const status = req.body?.status;

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            error: 'Status must be Pending, Live, or Rejected.',
        });
    }

    try {
        const records = await readDB();
        const index = records.findIndex(
            (video) => video.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({ error: 'Video not found.' });
        }

        records[index] = {
            ...records[index],
            status,
            reviewedAt: new Date().toISOString(),
        };

        await writeDB(records);

        return res.json({
            success: true,
            video: records[index],
        });
    } catch {
        return res.status(500).json({
            error: 'Could not update video status.',
        });
    }
});

app.delete('/api/videos/:id', async (req, res) => {
    const records = await readDB();
    const record = records.find((video) => video.id === req.params.id);

    if (!record) return res.status(404).json({ error: 'Video not found.' });

    await fs.rm(path.join(VIDEOS, path.basename(record.videoFile)), { force: true });
    await writeDB(records.filter((video) => video.id !== record.id));

    res.json({ success: true });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`AniGalnexo local video server: http://127.0.0.1:${PORT}`);
    console.log(`Video storage: ${VIDEOS}`);
});
