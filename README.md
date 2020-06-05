# shebang2-loader

This is an alternative Webpack loader for Unix-style shebangs (usually `#!/usr/bin/env node`). It is meant to replace the
[shebang-loader](https://npmjs.com/package/shebang-loader), which appears to be unmaintained and does not have proper
support for source maps.

## Usage

1. Make this package available to Webpack:

   ```
   npm i shebang2-loader
   ```
   or
   ```
   yarn add shebang2-loader
   ```

2. Configure the loader in your `webpack.config.js`.

   ```js
   module: {
     rules: [
       // ...
       { test: /example\/index.js$/, loader: "shebang2-loader" },
     ]
   }
   ```
   
   **Make sure to place `shebang2-loader` as the last rule in the list of rules, so that Webpack will process it first.**
   
   Here's a full example using Webpack's [BannerPlugin](https://webpack.js.org/plugins/banner-plugin/) to re-generate the
   shebang for a CLI application.

   ```js
   const webpack = require("webpack");
   const path = require("path");

   module.exports = {
     target: 'node',
     mode: 'development',
     entry: './main.js',
     output: {
       filename: 'dist.js',
       path: path.resolve(__dirname),
     },
     plugins: [
       new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
     ],
     devtool: 'source-map',
     module: {
       rules: [
         { test: /\.m?js$/, exclude: /node_modules/, loader: 'babel-loader' },
         { test: /example\/index.js$/, loader: "shebang2-loader" },
       ]
     }
   };
   ```
   
3. Run Webpack as you'd usually do.

   ```
   webpack --watch --config webpack.config.js
   ```
   
## License

This software is licensed under the MIT license.
