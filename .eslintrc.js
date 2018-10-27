module.exports = {
    "extends": [
    	"standard",
    	"plugin:react/recommended",
    ],
    rules: {
    	"comma-dangle": ["error", "only-multiline"],
    	"indent": ["error", 4],
    	"generator-star-spacing": ["error", "after"],
    	"space-before-function-paren": ["error", "never"],
    	"yoda": ["error", "never", {"onlyEquality": true}],
    }
};