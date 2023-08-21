import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
    process.env.ENV = process.env.ENV || 'production';

    return {
        plugins: [preact(), ...(process.env.ANALYZE ? [visualizer({ gzipSize: true, open: true, sourcemap: true })] : [])],
        esbuild: {
            legalComments: 'none',
        },
        target: 'es2018',
        ssr: {
            // Dependencies containing React components must not be externalized
            // from the SSR bundle, in order to work with preact/compat. This
            // list must also include transitive dependencies.
            noExternal: ['@navikt/ds-react', '@navikt/ds-icons', '@navikt/aksel-icons', '@navikt/ds-css', 'react-router', 'react-router-dom'],
        },
        base: process.env.VITE_APP_BASEPATH,
        css: {
            modules: {
                // Create stable (but verbose!) classnames in dev mode, in order
                // to support HMR
                ...(process.env.ENV === 'development' && {
                    generateScopedName: '[path][name]__[local]',
                }),
            },
        },
    };
});