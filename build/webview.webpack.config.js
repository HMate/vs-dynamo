//@ts-check

"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**@type {import('webpack').Configuration}*/
const config = {
    target: "node",
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

    entry: "./src/webview/webview.ts",
    output: {
        // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, "..", "media"),
        filename: "webview.js",
        libraryTarget: "window",
    },
    devtool: "nosources-source-map",
    externals: {
        vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },
    resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: [".ts", ".js", ".html"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
            {
                test: /\.html$/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "./index.html",
            template: "./src/webview/index.html",
            inject: false,
        }),
    ],
};
module.exports = config;
