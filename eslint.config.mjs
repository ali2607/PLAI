import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Configuration principale pour tous les fichiers JS
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Utilisation des modules CommonJS
      ecmaVersion: 2021       // Support des fonctionnalités modernes d'ECMAScript
    },
    globals: {
      ...globals.node         // Ajout des globales Node.js (process, require, etc.)
    },
    rules: {
      "prettier/prettier": "warn", // Active les warnings pour les problèmes de formatage (si Prettier est utilisé)
    },
  },
  {
    // Configuration spécifique aux fichiers front-end si nécessaire
    files: ["**/client/**/*.js"],
    languageOptions: {
      globals: globals.browser // Ajout des globales du navigateur (window, document, etc.)
    }
  },
  pluginJs.configs.recommended,  // Configuration recommandée par ESLint pour JS
  {
    plugins: {
      prettier: eslintPluginPrettier // Plugin Prettier pour ESLint
    }
  }
];
