import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			boxShadow: {
				sm: '0px 0px 12px rgba(255, 255, 255, 0.1)',
				'custom-md': '0 4px 6px rgba(0, 0, 0, 0.15)',
				'custom-lg': '0 10px 15px rgba(0, 0, 0, 0.2)',
				'custom-xl': '0 20px 25px rgba(0, 0, 0, 0.25)',
				'custom-inset': 'inset 0 4px 6px rgba(0, 0, 0, 0.1)',
				custom: '0px 0px 3px 0px rgba(0,0,0,0.17)'
			},
			screens: {
				ssm: '450px',
				sm: '640px',
				md: '768px',
				md2: '896px',
				lg: '1024px',
				xl: '1280px',
				xxl: '1600px'
			},
			colors: {
				background: {
					DEFAULT: '#E6E6E6',
					foreground: '#eeeeee',
					background: '#515151',
					white: '#FFFFFF',
					whatsapp: {
						user: 'hsl(169, 100%, 18%)',
						from: 'hsl(0, 0%, 21%)'
					}
				},
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: '#eeeeee',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					'50': '#f9e8e9',
					'100': '#ebb7bb',
					'200': '#e2949b',
					'300': '#d4646d',
					'400': '#cc4551',
					'500': '#bf1725',
					'600': '#ae1522',
					'700': '#88101a',
					'800': '#690d14',
					'900': '#500a10',
					DEFAULT: '#BF1725'
				},
				success: {
					'50': '#E8F8ED',
					'100': '#C8ECD1',
					'200': '#A0DAAF',
					'300': '#77CB8D',
					'400': '#5AC076',
					'500': '#36B45E',
					'600': '#2EA555',
					'700': '#229148',
					'800': '#15803D',
					'900': '#06632C',
					DEFAULT: '#36B45E',
					a100: '#B4FBD4',
					a200: '#57F4BC',
					a400: '#00EC8B',
					a700: '#00CE65'
				},
				warning: {
					'50': '#FFF8E6',
					'100': '#FFE6C7',
					'200': '#FFD7A8',
					'300': '#FFCC80',
					'400': '#FFB860',
					'500': '#FBC248',
					'600': '#E5A535',
					'700': '#D18C22',
					'800': '#BF721F',
					'900': '#AB581B',
					DEFAULT: '#FBC248'
				},
				danger: {
					'50': '#FEF2F2',
					'100': '#FEE2E2',
					'200': '#FCD5D5',
					'300': '#FCA5A5',
					'400': '#F87171',
					'500': '#EF4444',
					'600': '#DC2626',
					'700': '#B91C1C',
					'800': '#991B1B',
					'900': '#7F1D1D',
					DEFAULT: '#B91C1C'
				},
				'black-white': {
					DEFAULT: '#FFFFFF',
					black: '#000000',
					white: '#FFFFFF',
					gray: '#CCCCCC'
				},
				neutrals: {
					'50': '#F8F8F8',
					'100': '#EFEFEF',
					'200': '#E0E0E0',
					'300': '#C8C8C8',
					'400': '#B0B0B0',
					'500': '#969696',
					'600': '#7C7C7C',
					'700': '#626262',
					'800': '#484848',
					'900': '#18303A',
					DEFAULT: '#18303A'
				},
				accent: {
					'50': '#E8F8ED',
					'100': '#C8ECD1',
					'200': '#A0DAAF',
					'300': '#77CB8D',
					'400': '#5AC076',
					'500': '#36B45E',
					'600': '#2EA555',
					'700': '#229148',
					'800': '#15803D',
					'900': '#06632C',
					DEFAULT: '#06632C',
					a100: '#B4FBD4',
					a200: '#57F4BC',
					a400: '#00EC8B',
					a700: '#00CE65'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				text: {
					DEFAULT: '#000000',
					foreground: '#1A1A1A'
				},
				border: 'hsl(var(--border))',
				input: {
					DEFAULT: '#979797',
					background: '#E6E6E6',
					border: '#979797'
				},
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				table: {
					border: '#E6E6E6',
				},
				sidebar: {
					DEFAULT: '#EEEEEE',
					foreground: '#1A1A1A',
					primary: '#BF1725',
					'primary-foreground': 'hsl(169, 100%, 33%)',
					accent: '#E6E6E6',
					'accent-foreground': '#BF1725',
					border: '#CCCCCC',
					ring: '#CCCCCC'
				}
			},
			fontFamily: {
				inter: [
					'Inter',
					'sans-serif'
				]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
};

export default config;
