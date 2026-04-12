import { defineConfig } from "oxfmt";

export default defineConfig({
  bracketSpacing: true,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  arrowParens: "always",
  printWidth: 120,
  sortPackageJson: false,
  ignorePatterns: ["pnpm-lock.yaml"],
});
