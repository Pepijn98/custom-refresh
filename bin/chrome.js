import fs from "node:fs";
import archiver from "archiver";
import pkg from "../package.json" assert { type: "json" };

const output = fs.createWriteStream(new URL(`../dist/chrome/chrome-${pkg.version}.zip`, import.meta.url));
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
    console.log(`Finished with ${archive.pointer()} total bytes`);
});
output.on("end", () => {
    console.log("Data has been drained");
});

archive.on("warning", console.warn);
archive.on("error", console.error);

archive.pipe(output);

archive.file("./manifest.chrome.json", { name: "manifest.json" });
archive.file("./package.json", { name: "package.json" });
archive.file("./background.js", { name: "background.js" });
archive.file("./CHANGELOG.md", { name: "CHANGELOG.md" });
archive.directory("./icons", "icons");

archive.finalize();
