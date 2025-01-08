const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    performance: {
        hints: false,
        maxEntrypointSize: 1024 * 1024, // 1 MiB
        maxAssetSize: 1024 * 1024, // 1 MiB
    },
    entry: './src/app.ts',
    mode: 'development', // или 'production'
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
            //     type: 'asset/resource',
            // },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/,
            //     type: 'asset/resource',
            // },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/styles", to: "styles" },
                { from: "./src/static/images", to: "images" },
                { from: "./src/static/fonts", to: "fonts" },
                { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "styles" },
                { from: "./node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css", to: "styles" },
                { from: "./node_modules/jquery/dist/jquery.min.js", to: "js" },
                { from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js" },
                { from: "./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js", to: "js" },
                { from: "./node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.ru.min.js", to: "js" },
                { from: "./node_modules/chart.js/dist/chart.js", to: "js" },
            ],
        }),
    ],
};