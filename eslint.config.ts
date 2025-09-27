import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // https://github.com/eslint/eslint/discussions/18304#discussioncomment-9069706
  {
    // Why do I have to specify `files` if ESLint is going to scan .js anyways??
    ignores: ["**/*.js"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    // https://stackoverflow.com/a/77380178
    settings: { react: { version: "detect" } },
  },
  {
    rules: {
      // 'React' must be in scope when using JSX
      "react/react-in-jsx-scope": "off",
      // '...' is defined but never used
      "@typescript-eslint/no-unused-vars": "off",
      // `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`
      "react/no-unescaped-entities": "off",
      // Using target="_blank" without rel="noreferrer" (which implies rel="noopener") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations
      "react/jsx-no-target-blank": "off",
    },
  },
]);
