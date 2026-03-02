import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("src");
const OUTPUT = path.resolve("src/index.ts"); // root barrel

function generate() {
    const dirs = fs.readdirSync(SRC_DIR, { withFileTypes: true });

    const exports = [];

    for (const dir of dirs) {
        if (!dir.isDirectory()) continue;

        const indexFile = path.join(SRC_DIR, dir.name, "index.ts");

        if (fs.existsSync(indexFile)) {
            exports.push(`export * from "./${dir.name}";`);
        }
    }

    const content =
        `// AUTO-GENERATED FILE — DO NOT EDIT\n\n` + exports.join("\n") + "\n";

    fs.writeFileSync(OUTPUT, content);
    console.log(`Generated ${OUTPUT}`);
}

generate();
