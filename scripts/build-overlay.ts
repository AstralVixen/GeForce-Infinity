import { build } from "esbuild";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
const version = pkg.version;

await build({
    entryPoints: ["src/overlay/index.tsx"],
    outdir: "dist/overlay",
    bundle: true,
    format: "esm",
    target: "esnext",
    splitting: true,
    minify: true,
    jsx: "automatic",
    jsxImportSource: "react",
    external: ["electron", "fs", "path", "os"],
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    entryNames: "[name]",
});

console.log(`✅ Overlay build done`);
