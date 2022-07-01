// Based on:
//   1) https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js (linked to from
//      bottom of https://www.npmjs.com/package/eslint-config-airbnb-typescript
//   2) https://github.com/prettier/eslint-plugin-prettier. See especially item 2 in the
//      Recommended Configuration section.

module.exports = {
  root: true,
  plugins: [
    "@typescript-eslint",
    // "eslint-comments",
    // "jest",
    "import",
    "promise",
    // "unicorn",
  ],
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",

    // Below was wecommended in https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
    // but is not applicable here
    // "plugin:eslint-comments/recommended",

    // Below was wecommended in https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
    // but is not applicable here
    // "plugin:jest/recommended",

    "plugin:promise/recommended",

    // Below was wecommended in https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
    // but is not applicable here
    // "plugin:unicorn/recommended",

    // Below was recommended in https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
    // but was replaced with the next line per the Prettier plugin documentation.
    // "prettier",
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
    browser: false,
    jest: true,
  },
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  rules: {
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    "no-prototype-builtins": "off",
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    // // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    // "react/destructuring-assignment": "off",
    // // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
    // "react/jsx-filename-extension": "off",

    // // Use function hoisting to improve code readability
    // "no-use-before-define": [
    //   "error",
    //   { functions: false, classes: true, variables: true },
    // ],

    // Allow most functions to rely on type inference. If the function is exported, then `@typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true, typedefs: true },
    ],

    // Below was wecommended in https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
    // but is not applicable here
    // // Common abbreviations are known and readable

    // Below was wecommended in https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
    // but is not applicable here
    // "unicorn/prevent-abbreviations": "off",

    // Below was wecommended in https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
    // but is not applicable here
    // // Airbnb prefers forEach
    // "unicorn/no-array-for-each": "off",  // was wecommended in eslint-config-airbnb-typescript but not applicable here

    // It's not accurate in the monorepo style
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/quotes": ["warn", "double", "avoid-escape"],
    "@typescript-eslint/restrict-template-expressions": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/indent": "off", // handled by Prettier
    "max-classes-per-file": "off",
    yoda: "off",
    "object-curly-newline": "off",
    "prettier/prettier": "off",
    "prefer-template": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/lines-between-class-members": "off",

    "no-console": "off", // listed here so we can easily toggle off/warn/error when needed.
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        // Allow `require()`
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
