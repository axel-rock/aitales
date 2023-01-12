/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#f2f0ff',
					100: '#e8e4ff',
					200: '#d4cdff',
					300: '#b6a6ff',
					400: '#9373ff',
					500: '#733bff',
					600: '#6514ff',
					700: '#5500ff',
					800: '#4801d6',
					900: '#3c03af'
				}
			}
		}
	},
	plugins: []
};
