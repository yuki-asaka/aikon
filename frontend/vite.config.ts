import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react(),
            tailwindcss()
        ],
        define: {
            ...Object.keys(env).reduce((prev, key) => {
                const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "_");
                prev[`process.env.${sanitizedKey}`] = JSON.stringify(env[key]);
                return prev;
            }, {}),
        },
        server: {
            host: '0.0.0.0',
            port: 3000
        },
        base: './'
    }
});
