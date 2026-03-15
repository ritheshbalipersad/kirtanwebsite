// Skip Next.js lockfile patch to avoid "Cannot read properties of undefined (reading 'os')"
process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = "1";
const path = require("path");
const cwd = path.join(__dirname, "..");
const isWin = process.platform === "win32";
const nextBin = path.join(cwd, "node_modules", ".bin", "next" + (isWin ? ".cmd" : ""));
const cmd = isWin ? `"${nextBin}" build` : `${nextBin} build`;
const { status } = require("child_process").spawnSync(cmd, {
  stdio: "inherit",
  shell: true,
  cwd,
  env: { ...process.env, NEXT_IGNORE_INCORRECT_LOCKFILE: "1" },
});
process.exit(status ?? 0);
