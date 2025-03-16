import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Main configuration for all JS files
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Using CommonJS modules
      ecmaVersion: 2021       // Support for modern ECMAScript features
    },
    globals: {
      ...globals.node         // Addition of Node.js globals (process, require, etc.)
    },
    rules: {
      "prettier/prettier": "warn", // Activates warnings for formatting issues (if Prettier is used)
    },
  },
  {
    // Specific configuration for front-end files if needed
    files: ["**/client/**/*.js"],
    languageOptions: {
      globals: globals.browser // Addition of browser globals (window, document, etc.)
    }
  },
  pluginJs.configs.recommended,  // ESLint recommended configuration for JS
  {
    plugins: {
      prettier: eslintPluginPrettier // Prettier plugin for ESLint
    }
  }
];
