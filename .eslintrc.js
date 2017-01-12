module.exports = {
    "extends": "google",
    "installedESLint": true,
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "arrow-parens": "off",
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "comma-dangle": "off",
        "guard-for-in": "off",
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "max-len": "off",
        "max-statements-per-line": ["error", { "max": 2 }],
        "no-console": "off",
        "no-warning-comments": "off",
        "object-curly-spacing": ["error", "always"],
        "space-before-blocks": 0,
        "padded-blocks": "off",
        "require-jsdoc": "off"
    },
    "globals": {
        "window": true,
        "document": true,
        "navigator": true,
        "Howl": true
    }


};
