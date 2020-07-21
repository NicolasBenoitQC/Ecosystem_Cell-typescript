let reactVersion = "detect";

try {
    reactVersion = require("@kortex/aos-ui/package.json").dependencies.react;
} catch (err) {
    console.err(err);
}

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "jsdoc",
        "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
        "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
        "plugin:import/typescript",
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    plugins: ["import"],
    // Stop ESLint from looking for a configuration file in parent folders
    root: true,
    rules: {
        quotes: [2, "double"], // by convention
        "@typescript-eslint/no-use-before-define": [0],
        "@typescript-eslint/explicit-function-return-type": [1], // TODO: support current tslint to eslint transition
        "@typescript-eslint/explicit-member-accessibility": [1], // TODO: support current tslint to eslint transition
        "@typescript-eslint/interface-name-prefix": [2, "always"], // by convention
        "@typescript-eslint/ban-ts-ignore": 1,
        "react/prop-types": [0], // not required for typescript
    },
    settings: {
        jsdoc: {
            mode: "typescript",
        },
        react: {
            version: reactVersion, // Tells eslint-plugin-react which version of React to use
        },
    },
};