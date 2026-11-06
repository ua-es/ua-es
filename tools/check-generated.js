// Fails when the build changes any generated file that is committed to the
// repository, which means the committed output is out of date with src/.
import { execFileSync } from "node:child_process";

const generatedPaths = [
  "index.html",
  "en",
  "es",
  "ru",
  "fr",
  "css",
  "js",
  "sitemap.xml",
  "assets/maps/paths.json",
  "assets/maps/cities.json",
];

execFileSync("node", ["build.js"], { stdio: "inherit" });

const changes = execFileSync("git", ["status", "--porcelain", "--", ...generatedPaths], {
  encoding: "utf8",
}).trim();

if (changes) {
  console.error("\nGenerated files are out of date. Run `npm run build` and commit the result:\n");
  console.error(changes);
  process.exit(1);
}

console.log("Generated files are up to date.");
