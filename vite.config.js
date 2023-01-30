import { sveltekit } from '@sveltejs/kit/vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), viteCommonjs()],
	build:{
		commonjsOptions: {
			transformMixedEsModules: true,
		}
	},
	optimizeDeps: {
		include: ["html-minifier","uglify-js"]
	}
};

export default config;
