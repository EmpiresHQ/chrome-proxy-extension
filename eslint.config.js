// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import * as re from "eslint-plugin-react";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...re.configs.recommended.plugins,
  {
    files: ["** /*.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
    },
    globals: [{
      "chrome": "readonly"
    }],
    ignores: ["watch.js", "dist/**"],
  }
);
