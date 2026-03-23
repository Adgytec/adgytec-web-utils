import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            tsconfigPath: "tsconfig.json",
            insertTypesEntry: true,
            entryRoot: "src",
        }),
        Sonda(),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        sourcemap: true,
        outDir: "dist",
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es"],
            fileName: "index",
        },
        cssCodeSplit: true,
        rollupOptions: {
            input: Object.fromEntries(
                // 1️⃣ Auto-discovered entries (root index)
                globSync(["src/*/index.ts", "src/index.ts"]).map((file) => [
                    // entry name: remove `src/` and extension
                    path.relative(
                        "src",
                        file.slice(0, file.length - path.extname(file).length)
                    ),
                    // absolute file path
                    fileURLToPath(new URL(file, import.meta.url)),
                ])
            ),
            output: {
                chunkFileNames: "chunks/[name]",
                entryFileNames: "[name].js",
                assetFileNames: "assets/[name].[ext]",
            },
            external: [
                "@datastructures-js/queue",
                "uuid",
                "zod",
                "is-network-error",
            ],
        },
    },
});
