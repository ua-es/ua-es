import { readFile } from "node:fs/promises";
import { dirname, extname, join, basename } from "node:path";
import { execFileSync } from "node:child_process";

// Requires the WebP command-line tools (cwebp). Originals are always preserved.
const images = JSON.parse(await readFile("src/data/responsive-images.json", "utf8"));
for (const { source, widths } of images) {
  for (const width of widths) {
    const output = join(dirname(source), `${basename(source, extname(source))}-${width}.webp`);
    execFileSync(
      "cwebp",
      ["-quiet", "-resize", String(width), "0", "-q", "82", source, "-o", output],
      { stdio: "inherit" }
    );
    console.log(output);
  }
}
