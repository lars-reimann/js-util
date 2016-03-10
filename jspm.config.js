SystemJS.config({
  transpiler: "plugin-babel",
  packages: {
    "@ignavia/util": {
      "main": "util.js",
      "format": "esm",
      "defaultExtension": "js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "babel-regenerator-runtime": "npm:babel-regenerator-runtime@6.5.0",
    "core-js": "npm:core-js@2.1.4",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "lodash": "npm:lodash@4.6.1",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.8",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha"
  },
  packages: {}
});
