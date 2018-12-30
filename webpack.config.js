/* eslint-env node */
var webpack = require("webpack");
var path = require("path");
var env = process.env.NODE_ENV;

var reactExternal = {
    root: "React",
    commonjs2: "react",
    commonjs: "react",
    amd: "React",
};

var reactDomExternal = {
    commonjs: "react-dom",
    commonjs2: "react-dom",
    amd: "ReactDOM",
    root: "ReactDOM",
};

var config = {
    externals: {
        react: reactExternal,
        "react-dom": reactDomExternal,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [path.join(__dirname, "./src/"), "node_modules"],
        extensions: [".js", ".jsx"],
    },
    output: {
        library: "GraphqlCSS",
        libraryTarget: "umd",
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
        }),
    ],
};

if (env === "production") {
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    );
}

module.exports = config;
