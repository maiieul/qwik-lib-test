import { defineConfig } from "vite";
import pkg from "./package.json";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tsconfigPaths from "vite-tsconfig-paths";

const { dependencies = {}, peerDependencies = {} } = pkg as any;
const makeRegex = (dep) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj) => Object.keys(obj).map(makeRegex);

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: "./src/index.ts",
        // Could also be a dictionary or array of multiple entry points.
        name: "qwik-ui-lib-test",
        fileName: (format, entryName) =>
          `${entryName}.qwik.${format === "es" ? "mjs" : "cjs"}`,
        // fileName: 'index',
        // Change this to the formats you want to support.
        // Don't forgot to update your package.json as well.
        formats: ["es", "cjs"],
      },
      // lib: {
      //   entry: "./src/index.ts",
      //   formats: ["es", "cjs"],
      //   fileName: (format) => `index.qwik.${format === "es" ? "mjs" : "cjs"}`,
      // },
      rollupOptions: {
        // externalize deps that shouldn't be bundled into the library
        external: [
          /^node:.*/,
          ...excludeAll(dependencies),
          ...excludeAll(peerDependencies),
          "@floating-ui/dom",
          "country-list-json",
          "libphonenumber-js",
        ],
        output: {
          preserveModules: true,
          preserveModulesRoot: "src",
        },
      },
    },
    plugins: [qwikVite(), tsconfigPaths()],
  };
});
