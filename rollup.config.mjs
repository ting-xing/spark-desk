import {defineConfig} from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';
import json from "@rollup/plugin-json";

export default defineConfig([
    {
        input: './src/index.ts',
        output: [
            {
                file: "./dist/index.mjs",
                format: 'es',
            },
            {
                file: "./dist/index.cjs",
                format: 'cjs',
            }
        ],
        external: ["crypto-js", "ws"],
        plugins: [typescript(), terser()]
    },
    {
        input: './src/cli.ts',
        output: {
            banner: "#!/usr/bin/env node",
            file: "./dist/cli.cjs",
            format: 'cjs'
        },
        external: ["commander", "crypto-js", "ws", "node:fs/promises", "node:path", "node:readline"],
        plugins: [json(), typescript(), terser()]
    }
]);