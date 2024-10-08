import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		fs: {
			allow: [
				"./obconfig.json"
			]
		}
	}
});
