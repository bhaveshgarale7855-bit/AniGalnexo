
const API_BASE_URL = (
  import.meta.env.VITE_LOCAL_API_URL || 'http://127.0.0.1:4000'
).replace(/\/+$/, '');

export default API_BASE_URL;
