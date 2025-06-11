import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        coverage: {
            provider: 'v8',
            reportsDirectory: './reports/coverage',
            reporter: ['text', 'json', 'html'],
            exclude: [
                '**/main.tsx',
                '**/App.tsx',
                '**/gui',
                'eslint.config.js',
                'eslint.style.cjs',
                'vite.config.ts',
                'vitest.config.ts',
                '**/vite-env.d.ts',
                'src/model/graph/mmio.tsx'
            ]
        },
        exclude: [
            ...configDefaults.exclude,
            'shared/*',
        ]
    },
});