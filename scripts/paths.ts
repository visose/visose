import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("..", import.meta.url));
export const webBuildPath = "artifacts/build/Visose.Web";
export const webReleasePath = "artifacts/release/Visose.Web";
