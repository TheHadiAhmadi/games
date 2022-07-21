import { sveltekit } from '@sveltejs/kit/vite';
import windicss from 'vite-plugin-windicss';

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [windicss({config: {shortcuts: {
						'score-btn': 'flex flex-col items-center justify-center py-1 px-4 rounded bg-gray-500/60 text-white'
    }}}), sveltekit()]
};

export default config;
