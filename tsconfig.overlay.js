import"./JavaScript/GeForce-Infinity/index-v8mgrsvs.js";

// tsconfig.overlay.json
var compilerOptions = {
  outDir: "dist/overlay",
  rootDir: "src/overlay",
  module: "ESNext",
  target: "ESNext",
  jsx: "react-jsx",
  moduleResolution: "bundler",
  esModuleInterop: true,
  strict: true
};
var include = ["src/overlay/**/*"];
var tsconfig_overlay_default = {
  compilerOptions,
  include
};
export {
  include,
  tsconfig_overlay_default as default,
  compilerOptions
};
