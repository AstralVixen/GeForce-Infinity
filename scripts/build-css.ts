const input = "./src/overlay/index.css";
const output = "./dist/assets/tailwind.bundle.css";

const cssBuildResult = Bun.spawnSync(
    ["bun", "x", "tailwindcss", "-i", input, "-o", output, "--minify"],
    {
        stderr: "inherit",
        stdout: "inherit",
    }
);

if (cssBuildResult.exitCode !== 0) {
    console.error("❌ Tailwind build failed");
    process.exit(cssBuildResult.exitCode);
}

console.log(`✅ Tailwind build done`);
