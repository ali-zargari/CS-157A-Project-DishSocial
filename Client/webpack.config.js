const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',

    entry: {
        index: './src/index.js',
        mainpage: './src/mainpage.js',
        settings: './src/settings.js',
        user: './src/user.js',
    },
    devServer: {
        static: './dist',
        port: 8080,
    },
    plugins: [

        new HtmlWebpackPlugin({
            template: './index.html', // Source template file
            filename: 'index.html', // Output file
            chunks: ['index'] // Include only the index bundle
        }),

        new HtmlWebpackPlugin({
            template: './src/mainpage.html', // Source template file
            filename: 'mainpage.html', // Output file
            chunks: ['mainpage'] // Include only the index bundle
        }),

        new HtmlWebpackPlugin({
            template: './src/settings.html', // Source template file
            filename: 'settings.html', // Output file
            chunks: ['settings'] // Include only the index bundle
        }),
        new HtmlWebpackPlugin({
            template: './src/user.html', // Source template file
            filename: 'user.html', // Output file
            chunks: ['user'] // Include only the index bundle
        }),

    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(css)$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },

        ],

    }
};