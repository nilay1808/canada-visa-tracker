/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  tailwind: true,
  postcss: true,
  browserNodeBuiltinsPolyfill: {
    modules: {
      os: true,
      fs: true,
      net: true,
      tls: true,
      crypto: true,
      stream: true,
      perf_hooks: true,
    },
  },
  watchPaths: [
    "./tailwind.config.js",
    "./lib/**/*.{ts,tsx}",
    "../../packages/**/*.{ts,tsx}",
  ],
};
