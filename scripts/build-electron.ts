const result = Bun.spawnSync(
    ["bun", "x", "tsc", "-p", "tsconfig.electron.json"],
    {
        stdout: "inherit",
        stderr: "inherit",
    }
);

if (result.exitCode !== 0) {
    console.error("❌ Electron build failed");
    process.exit(result.exitCode);
}

console.log("✅ Electron build done");
