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
                    background: '#515151', // Mantido - Fundo escuro?
                    white: '#FFFFFF',
                    whatsapp: {
                        user: 'hsl(169, 100%, 18%)', // Mantido
                        from: 'hsl(0, 0%, 21%)' // Mantido
                    }
                },
                foreground: 'hsl(var(--foreground))', // Mantido - Usa variáveis CSS
                card: {
                    DEFAULT: '#eeeeee', // Mantido - Cor de fundo do card
                    foreground: 'hsl(var(--card-foreground))' // Mantido - Usa variáveis CSS
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))', // Mantido - Usa variáveis CSS
                    foreground: 'hsl(var(--popover-foreground))' // Mantido - Usa variáveis CSS
                },
                primary: { // <-- NOVA PALETA AZUL PRINCIPAL
                    '50': '#e9eff7',
                    '100': '#cdddeb',
                    '200': '#adcbe1',
                    '300': '#82b3d3',
                    '400': '#5c96c1',
                    '500': '#23518C', // Sua cor primária
                    '600': '#1e487d',
                    '700': '#1a3e6c',
                    '800': '#18355a',
                    '900': '#182f4d',
                    '950': '#111d33',
                    DEFAULT: '#23518C' // Sua cor primária como padrão
                },
                secondary: { // <-- RENOMEADO DE 'success' E AJUSTADO PARA AZUL SECUNDÁRIO
                    '50': '#eaf0fa',
                    '100': '#dce7f7',
                    '200': '#c4d7f2',
                    '300': '#a1bfee',
                    '400': '#7c9fee',
                    '500': '#306EBF', // Sua cor secundária
                    '600': '#265cb7',
                    '700': '#204ca6',
                    '800': '#1e4088',
                    '900': '#1d396e',
                    '950': '#152445',
                    DEFAULT: '#306EBF' // Sua cor secundária como padrão
                },
                accent: { // <-- AJUSTADO PARA AZUL ACENTO (CLARO)
                    '50': '#f0f6fd',
                    '100': '#e1eefe',
                    '200': '#cce0fc',
                    '300': '#b0cffb',
                    '400': '#80B2F2', // Sua cor de acento
                    '500': '#6ab0f9',
                    '600': '#50a0f6',
                    '700': '#3b8cf3',
                    '800': '#3474cf',
                    '900': '#3061a9',
                    '950': '#1d3b6a',
                    DEFAULT: '#80B2F2' // Sua cor de acento como padrão
                },
                warning: { // Mantido - Amarelo para avisos
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
                danger: { // Mantido - Vermelho para perigo/erros
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
                    DEFAULT: '#B91C1C' // Cor padrão para danger
                },
                'black-white': { // Mantido
                    DEFAULT: '#FFFFFF',
                    black: '#000000',
                    white: '#FFFFFF',
                    gray: '#CCCCCC'
                },
                neutrals: { // Mantido - Tons de cinza
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
                muted: { // Mantido - Usa variáveis CSS
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                destructive: { // Mantido - Usa variáveis CSS (provavelmente vermelho)
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                text: { // Mantido - Cores de texto padrão
                    DEFAULT: '#000000',
                    foreground: '#1A1A1A'
                },
                border: 'hsl(var(--border))', // Mantido - Usa variável CSS
                input: { // Mantido - Cores para inputs
                    DEFAULT: '#979797',
                    background: '#E6E6E6',
                    border: '#979797'
                },
                ring: 'hsl(var(--ring))', // Mantido - Usa variável CSS (cor de foco)
                chart: { // Mantido - Cores para gráficos (usam variáveis CSS)
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                table: { // Mantido
                    border: '#E6E6E6',
                },
                sidebar: { // <-- ATUALIZADO COM AZUIS
                    DEFAULT: '#EEEEEE', // Fundo da sidebar
                    foreground: '#1A1A1A', // Cor do texto
                    primary: '#23518C', // Cor primária (era vermelho)
                    'primary-foreground': '#FFFFFF', // Cor do texto sobre a primária (branco contrasta bem)
                    accent: '#E6E6E6', // Cor de fundo do item ativo/hover (era cinza claro)
                    'accent-foreground': '#23518C', // Cor do texto/ícone do item ativo/hover (era vermelho)
                    border: '#CCCCCC', // Cor da borda
                    ring: '#CCCCCC' // Cor do anel de foco
                }
            },
            fontFamily: { // Mantido
                inter: [
                    'Inter',
                    'sans-serif'
                ]
            },
            borderRadius: { // Mantido - Usa variável CSS
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: { // Mantido
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: { // Mantido
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")], // Adicione este plugin se ainda não o tiver
};

export default config;
