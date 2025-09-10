import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = "./src/overlay/index.css";
const output = "./dist/assets/tailwind.bundle.css";

const cssBuildProcess = spawn("npx", ["tailwindcss", "-i", input, "-o", output, "--minify"], {
    stdio: "inherit"
});

cssBuildProcess.on("close", (code) => {
    if (code !== 0) {
        console.error("❌ Tailwind build failed");
        process.exit(code);
    }
    console.log(`✅ Tailwind build done`);
});
