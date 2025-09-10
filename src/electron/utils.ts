import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getIconPath = () => {
    if (process.platform === "win32") {
        return path.join(
            __dirname,
            "..",
            "assets",
            "resources",
            "infinitylogo.ico"
        );
    } else {
        // both mac and linux use PNG
        return path.join(
            __dirname,
            "..",
            "assets",
            "resources",
            "infinitylogo.png"
        );
    }
};
