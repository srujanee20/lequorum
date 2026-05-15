import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const myConfig = defineConfig({
    globalCss: {
        body: {
            bg: '#F5F4F1',
            color: '#1C1917',
            fontFamily: "'DM Sans', sans-serif"
        }
    },
    theme: {
        tokens: {
            fonts: {
                heading: { value: "'DM Serif Display', serif" },
                body: { value: "'DM Sans', sans-serif" }
            },
            colors: {
                brand: {
                    50: { value: '#EEF3F2' },
                    100: { value: '#D2E2DF' },
                    200: { value: '#A5C4BF' },
                    300: { value: '#7AA89E' },
                    400: { value: '#576F6A' },
                    500: { value: '#456059' },
                    600: { value: '#345149' },
                    700: { value: '#243B36' },
                    800: { value: '#152622' },
                    900: { value: '#08120F' }
                },
                cta: {
                    50: { value: '#FBF0EB' },
                    100: { value: '#F3D5C4' },
                    200: { value: '#E4AB8D' },
                    300: { value: '#D49063' },
                    400: { value: '#C17C56' },
                    500: { value: '#A96843' },
                    600: { value: '#905433' },
                    700: { value: '#6E3E24' },
                    800: { value: '#4C2A17' },
                    900: { value: '#2A160B' }
                }
            }
        },
        semanticTokens: {
            colors: {
                brand: {
                    solid: { value: '{colors.brand.400}' },
                    muted: { value: '{colors.brand.100}' },
                    subtle: { value: '{colors.brand.50}' },
                    emphasized: { value: '{colors.brand.200}' },
                    focusRing: { value: '{colors.brand.400}' },
                    contrast: { value: 'white' },
                    fg: { value: '{colors.brand.600}' }
                },
                cta: {
                    solid: { value: '{colors.cta.400}' },
                    muted: { value: '{colors.cta.100}' },
                    subtle: { value: '{colors.cta.50}' },
                    emphasized: { value: '{colors.cta.200}' },
                    focusRing: { value: '{colors.cta.400}' },
                    contrast: { value: 'white' },
                    fg: { value: '{colors.cta.600}' }
                }
            }
        }
    }
});

export const system = createSystem(defaultConfig, myConfig);
