SystemJS.config({
          "packageConfigPaths": [
                    "npm:@*/*.json",
                    "npm:*.json",
                    "github:*/*.json"
          ],
          "globalEvaluationScope": false,
          "transpiler": "plugin-babel",
          "map": {
                    buffer: "github:jspm/nodelibs-buffer@0.2.0-alpha",
                    chai: "npm:chai@3.5.0",
                    "chai-string": "npm:chai-string@1.1.6",
                    mocha: "npm:mocha@2.4.5",
                    "plugin-babel": "npm:systemjs-plugin-babel@0.0.2",
                    process: "github:jspm/nodelibs-process@0.2.0-alpha"
          },
          "packages": {
                    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
                              "map": {
                                        "buffer-browserify": "npm:buffer@4.4.0"
                              }
                    },
                    "npm:buffer@4.4.0": {
                              "map": {
                                        "base64-js": "npm:base64-js@1.0.2",
                                        "ieee754": "npm:ieee754@1.1.6",
                                        "isarray": "npm:isarray@1.0.0"
                              }
                    },
                    "npm:chai@3.5.0": {
                              "map": {
                                        "assertion-error": "npm:assertion-error@1.0.1",
                                        "deep-eql": "npm:deep-eql@0.1.3",
                                        "type-detect": "npm:type-detect@1.0.0"
                              }
                    },
                    "npm:deep-eql@0.1.3": {
                              "map": {
                                        "type-detect": "npm:type-detect@0.1.1"
                              }
                    },
                    "npm:mocha@2.4.5": {
                              "map": {
                                        "css": "github:systemjs/plugin-css@0.1.20"
                              }
                    },
                    util: {
                              "main": "src/util.js",
                              "format": "esm"
                    }
          }
});
