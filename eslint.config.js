import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      "import/resolver": {
        // eslint-import-resolver-alias 可以解决绝对路径的问题
        alias: {
          map: [
            ["", "./public"], // <-- this line
            ["@", "./src"], // <-- this line
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".svg"],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // 分号
      semi: ["error", "always"],
      "import/default": "off",
      "import/order": [
        "error",
        {
          // 对导入模块进行分组，分组排序规则如下
          groups: [
            "builtin", // 内置模块
            "external", // 外部模块
            "parent", // 父节点依赖
            "sibling", // 兄弟依赖
            "internal", // 内部引用
            "index", // index文件
            "type", //类型文件
            "unknown", // 未知依赖
          ],
          //通过路径自定义分组
          pathGroups: [
            {
              pattern: "@/**", // 把@开头的应用放在external分组后面
              group: "external",
              position: "after", // 定义组的位置，after、before
            },
            {
              pattern: "react*", // 在规定的组中选其一，index、sibling、parent、internal、external、builtin、object、type、unknown
              group: "builtin",
              position: "before",
            },
          ],
          // 是否开启独特组，用于区分自定义规则分组和其他规则分组
          distinctGroup: true,
          // 每个分组之间换行
          "newlines-between": "always",
          // 相同分组排列规则 按字母升序排序
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  eslintPluginPrettierRecommended
);
