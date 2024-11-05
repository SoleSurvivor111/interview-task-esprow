import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigAirbnb from "eslint-config-airbnb";
import eslintConfigReactApp from "eslint-config-react-app";
import eslintLoader from "eslint-loader";
import eslintPluginFlowtype from "eslint-plugin-flowtype";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJest from "eslint-plugin-jest";
import eslintPluginJsx from "eslint-plugin-jsx";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...eslintConfigAirbnb,
      ...eslintConfigReactApp,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "eslint-plugin-flowtype": eslintPluginFlowtype,
      "eslint-plugin-import": eslintPluginImport,
      "eslint-plugin-jest": eslintPluginJest,
      "eslint-plugin-jsx": eslintPluginJsx,
      "eslint-plugin-jsx-a11y": eslintPluginJsxA11y,
      "eslint-plugin-react": eslintPluginReact,
      "eslint-plugin-react-hooks": eslintPluginReactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
