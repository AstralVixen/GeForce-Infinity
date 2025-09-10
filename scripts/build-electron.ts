import { spawn } from "child_process";

const result = spawn("npx", ["tsc", "-p", "tsconfig.electron.json"], {
    stdio: "inherit"
});

result.on("close", (code) => {
    if (code !== 0) {
        console.error("❌ Electron build failed");
        process.exit(code);
    }
    console.log("✅ Electron build done");
});
