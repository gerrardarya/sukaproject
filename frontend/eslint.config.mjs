import eslint from "@eslint/js";
import eslintPluginNext from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
    {
      name: "files",
      files: ["**/*.{js,mjs,ts,tsx}"],
    },
    {
      name: "ignores",
      ignores: [
        // build dir
        ".next/",
        // shadcn/ui
        "src/components/ui",
      ],
    },
    // eslint
    {
      name: "eslint recommended",
      rules: eslint.configs.recommended.rules,
    },
    // typescript-eslint
    ...tseslint.configs.recommended,
    // eslint-plugin-react
    {
      name: "eslint-plugin-react",
      files: ["**/*.tsx"],
      plugins: eslintPluginReact.configs.flat.recommended.plugins,
      languageOptions: eslintPluginReact.configs.flat.recommended.languageOptions,
      rules: {
        ...eslintPluginReact.configs.flat.recommended.rules,
        "react/no-unknown-property": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/jsx-no-target-blank": "off",
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    // eslint-plugin-react-hooks
    {
      files: ["**/*.{ts,tsx}"],
      name: "eslint-plugin-react-hooks",
      plugins: {
        "react-hooks": eslintPluginReactHooks,
      },
    },
    // eslint-plugin-next
    {
      name: "eslint-plugin-next",
      // https://github.com/vercel/next.js/issues/73655
      files: ["**/*.{js,mjs,ts,tsx}"],
      plugins: {
        "@next/next": eslintPluginNext,
      },
      rules: {
        ...eslintPluginNext.configs.recommended.rules,
        ...eslintPluginNext.configs["core-web-vitals"].rules,
        "@next/next/no-img-element": "off",
      },
    },
    // eslint-plugin-jsx-a11y
    {
      name: "eslint-plugin-jsx-a11y",
      files: ["**/*.{ts,tsx}"],
      plugins: eslintPluginJsxA11y.flatConfigs.recommended.plugins,
      rules: {
        ...eslintPluginJsxA11y.flatConfigs.recommended.rules,
        "jsx-a11y/alt-text": [
          "warn",
          {
            elements: ["img"],
            img: ["Image"],
          },
        ],
        "jsx-a11y/aria-props": "warn",
        "jsx-a11y/aria-proptypes": "warn",
        "jsx-a11y/aria-unsupported-elements": "warn",
        "jsx-a11y/role-has-required-aria-props": "warn",
        "jsx-a11y/role-supports-aria-props": "warn",
      },
    },
    // eslint-plugin-import
    {
      name: "eslint-plugin-import",
      files: ["**/*.{js,mjs,ts,tsx}"],
      plugins: eslintPluginImport.flatConfigs.recommended.plugins,
      rules: {
        ...eslintPluginImport.flatConfigs.recommended.rules,
        "import/no-anonymous-default-export": "warn",
        "import/order": [
          "error",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              ["parent", "sibling"],
              "object",
              "type",
              "index",
            ],
            "newlines-between": "always",
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
          },
        ],
      },
      settings: {
        "import/resolver": {
          typescript: true,
        },
      },
    },
    // eslint-plugin-unused-imports
    {
      name: "eslint-plugin-unused-imports",
      files: ["**/*.{js,mjs,ts,tsx}"],
      plugins: { "unused-imports": eslintPluginUnusedImports },
      rules: {
        "unused-imports/no-unused-imports": "error",
      },
    },
    {
      // disable error for old components
      // TODO: remove after all components are updated
      name: "custom rules",
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-unnecessary-type-constraint": "warn",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/no-empty-object-type": "warn",
      },
    },
    {
      name: "prettier",
      ...eslintConfigPrettier,
    },
);

export default eslintConfig;