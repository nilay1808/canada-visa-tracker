import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts", "src/migrate.ts"],
  clean: true,
  dts: true,
  format: ["cjs"],
  ...options,
}));
