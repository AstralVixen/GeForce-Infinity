import path from "path";

export const getIconPath = () => {
    if (process.platform === "win32") {
        return path.join(
            __dirname,
            "..",
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
            "..",
            "assets",
            "resources",
            "infinitylogo.png"
        );
    }
};
