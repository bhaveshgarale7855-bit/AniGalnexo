
import React, { useEffect, useState } from 'react';
import {
    Settings,
    UserRound,
    Palette,
    Play,
    Bell,
    ShieldCheck,
    Monitor,
    RotateCcw,
    Check,
} from 'lucide-react';

type Preferences = {
    theme: 'dark' | 'darker';
    autoplay: boolean;
    nextEpisode: boolean;
    reduceMotion: boolean;
    notifications: boolean;
    accent: string;
};

const DEFAULT_SETTINGS: Preferences = {
    theme: 'dark',
    autoplay: true,
    nextEpisode: true,
    reduceMotion: false,
    notifications: true,
    accent: 'var(--accent)',
};

const STORAGE_KEY = 'anigalnexo_settings';

export const SettingsView: React.FC = () => {
    const [settings, setSettings] = useState<Preferences>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved
                ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
                : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    const [savedMessage, setSavedMessage] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch {
            // Settings remain usable for this session.
        }
    }, [settings]);

    useEffect(() => {
        document.documentElement.dataset.theme =
            settings.theme === 'darker' ? 'midnight' : 'dark';
    }, [settings.theme]);


    useEffect(() => {
        const root = document.documentElement;
        const accent = settings.accent;

        // Selected accent colour
        root.style.setProperty('--accent', accent);

        // Transparent accent backgrounds
        root.style.setProperty(
            '--accent-soft',
            `color-mix(in srgb, ${accent} 15%, transparent)`
        );

        root.style.setProperty(
            '--accent-border',
            `color-mix(in srgb, ${accent} 45%, transparent)`
        );

        // Matching glow
        root.style.setProperty(
            '--accent-glow',
            `color-mix(in srgb, ${accent} 40%, transparent)`
        );
    }, [settings.accent]);


    const update = <K extends keyof Preferences>(
        key: K,
        value: Preferences[K]
    ) => {
        setSettings((previous) => ({ ...previous, [key]: value }));
        setSavedMessage(false);
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        setSavedMessage(true);
    };

    const toggleClass =
        'relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#11131c]';

    const Toggle = ({
        value,
        onChange,
        label,
    }: {
        value: boolean;
        onChange: (value: boolean) => void;
        label: string;
    }) => (
        <button
            type="button"
            role="switch"
            aria-checked={value}
            aria-label={label}
            onClick={() => onChange(!value)}
            className={`${toggleClass} ${value ? 'bg-[var(--accent)]' : 'bg-white/15'}`}
        >
            <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    const Section = ({
        icon,
        title,
        description,
        children,
    }: {
        icon: React.ReactNode;
        title: string;
        description: string;
        children: React.ReactNode;
    }) => (
        <section className="rounded-2xl border border-white/[0.08] bg-[#191b24]/80 p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-[var(--accent)]/10 p-2.5 text-[var(--accent)]">
                    {icon}
                </div>
                <div>
                    <h2 className="font-semibold text-white">{title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-gray-400">
                        {description}
                    </p>
                </div>
            </div>
            {children}
        </section>
    );

    const SettingRow = ({
        title,
        description,
        children,
    }: {
        title: string;
        description: string;
        children: React.ReactNode;
    }) => (
        <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] py-4 first:border-t-0">
            <div>
                <p className="text-sm font-medium text-gray-100">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">
                    {description}
                </p>
            </div>
            {children}
        </div>
    );

    const accentColors = [
        { name: 'Default', value: 'var(--accent)' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Emerald', value: '#10b981' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Cyan', value: '#06b6d4' },
        { name: 'Gold', value: '#eab308' },
    ];

    return (
        <div className="mx-auto w-full max-w-5xl pb-12">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-[var(--accent)]">
                        <Settings size={16} />
                        Your preferences
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Settings
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Make AniGalnexo feel right for you.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={resetSettings}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-[var(--accent)]/50 hover:text-white"
                >
                    <RotateCcw size={15} />
                    Reset defaults
                </button>
            </div>

            <div className="grid gap-5">
                <Section
                    icon={<UserRound size={20} />}
                    title="Account"
                    description="Manage your AniGalnexo account."
                >
                    <SettingRow
                        title="Profile"
                        description="Update your name, avatar and personal details."
                    >
                        <span className="shrink-0 text-xs text-gray-500">
                            Use Profile
                        </span>
                    </SettingRow>
                    <SettingRow
                        title="Account security"
                        description="Authentication and password options."
                    >
                        <ShieldCheck size={19} className="shrink-0 text-gray-400" />
                    </SettingRow>
                </Section>

                <Section
                    icon={<Palette size={20} />}
                    title="Appearance"
                    description="Choose the look of your streaming experience."
                >
                    <SettingRow
                        title="Interface theme"
                        description="Choose your preferred dark interface."
                    >
                        <select
                            value={settings.theme}
                            onChange={(e) =>
                                update('theme', e.target.value as Preferences['theme'])
                            }
                            className="max-w-32 rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]"
                        >
                            <option value="dark">Dark</option>
                            <option value="darker">Midnight</option>
                        </select>

                    </SettingRow>

                    <div className="border-t border-white/[0.07] pt-4">
                        <p className="text-sm font-medium text-gray-100">Accent Color</p>
                        <p className="mt-1 text-xs text-gray-400">
                            Change accent colors across buttons, highlights, borders and active states. Artwork keeps its original colors.
                        </p>
                        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
                            {accentColors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => update('accent', color.value)}
                                    aria-label={`Use ${color.name} accent color`}
                                    aria-pressed={settings.accent === color.value}
                                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition hover:bg-white/5 ${settings.accent === color.value ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-white/10'}`}
                                >
                                    <span className="h-7 w-7 rounded-full" style={{ backgroundColor: color.value, boxShadow: `0 0 14px ${color.value}66` }} />
                                    <span className="text-[10px] text-gray-300">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <SettingRow
                        title="Reduce animations"
                        description="Preference for less motion in supported areas."
                    >
                        <Toggle
                            label="Reduce animations"
                            value={settings.reduceMotion}
                            onChange={(v) => update('reduceMotion', v)}
                        />
                    </SettingRow>
                </Section>

                <Section
                    icon={<Play size={20} />}
                    title="Playback"
                    description="Set your episode playback preferences."
                >
                    <SettingRow
                        title="Autoplay episodes"
                        description="Allow playback to start automatically when supported."
                    >
                        <Toggle
                            label="Autoplay episodes"
                            value={settings.autoplay}
                            onChange={(v) => update('autoplay', v)}
                        />
                    </SettingRow>
                    <SettingRow
                        title="Play next episode"
                        description="Continue to the next episode when supported."
                    >
                        <Toggle
                            label="Play next episode"
                            value={settings.nextEpisode}
                            onChange={(v) => update('nextEpisode', v)}
                        />
                    </SettingRow>
                </Section>

                <Section
                    icon={<Bell size={20} />}
                    title="Notifications"
                    description="Manage your notification preference."
                >
                    <SettingRow
                        title="Product notifications"
                        description="Preference for announcements and platform updates."
                    >
                        <Toggle
                            label="Product notifications"
                            value={settings.notifications}
                            onChange={(v) => update('notifications', v)}
                        />
                    </SettingRow>
                </Section>

                <Section
                    icon={<Monitor size={20} />}
                    title="Privacy"
                    description="Your preferences are stored in this browser."
                >
                    <SettingRow
                        title="Local preferences"
                        description="Settings are saved on this device, not to an online account."
                    >
                        <ShieldCheck size={19} className="shrink-0 text-emerald-400" />
                    </SettingRow>
                </Section>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#191b24]/60 p-4">
                <p className="text-xs text-gray-400">
                    Your preferences save automatically on this device.
                </p>
                <button
                    type="button"
                    onClick={() => setSavedMessage(true)}
                    className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff8d24]"
                >
                    <Check size={16} />
                    Done
                </button>
            </div>

            {savedMessage && (
                <p role="status" className="mt-3 text-right text-sm text-emerald-400">
                    Preferences updated.
                </p>
            )}
        </div>
    );
};
