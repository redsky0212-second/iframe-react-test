import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
	base: '/iframe/',
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	server: {
		port: 5179, // 원하는 포트로 설정
	},
});
