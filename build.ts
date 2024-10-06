import { build, $ } from "bun";

const packageInfo = await Bun.file("./package.json").json();

build({
  entrypoints: ["./src/main.ts"],
  outdir: "output",
  target: "bun",
  minify: true,
  define: {
    "Bun.env.PROGRAM_NAME": packageInfo.name,
    "Bun.env.PROGRAM_VERSION": `v${packageInfo.version}`,
    "Bun.env.PROGRAM_DESCRIPTION": packageInfo.description,
  },
}).then(async () => {
  await $`bun build output/main.js --compile --target=bun-darwin-arm64 --minify --outfile dist/notion-qq-robot-cli_v${packageInfo.version}_mac-arm64`;
  await $`bun build output/main.js --compile --target=bun-windows-x64-modern --minify --outfile dist/notion-qq-robot-cli_v${packageInfo.version}_windows-x64-modern.exe`;
  await $`bun build output/main.js --compile --target=bun-linux-x64 --minify --outfile dist/notion-qq-robot-cli_v${packageInfo.version}_linux-x64`;
});
