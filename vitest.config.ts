import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        coverage: {
            provider: 'v8',
            reportsDirectory: './reports/coverage',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                '**/main.tsx',
                '**/App.tsx',
                '**/Config.tsx',
                '**/TaskRunner.tsx',
                '**/gui',
                '**/controller',
                'eslint.config.js',
                'eslint.style.cjs',
                'vite.config.ts',
                'vitest.config.ts',
                '**/vite-env.d.ts',
                'dist/**'
            ]
        },
        exclude: [
            ...configDefaults.exclude,
            'shared/*',
        ]
    },
});