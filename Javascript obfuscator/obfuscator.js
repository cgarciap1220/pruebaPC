var JavaScriptObfuscator = require('javascript-obfuscator');
var obfuscationResult = JavaScriptObfuscator.obfuscate(
    process.argv[2],
    {
        compact: false,
        controlFlowFlattening: true
    }
);

console.log(obfuscationResult.getObfuscatedCode());