const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/controller.js',
    },
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/registration.html', // Source template file
            filename: 'registration.html', // Output file
            chunks: ['index'] // Include only the index bundle
        }),
        new HtmlWebpackPlugin({
            template: './src/settings.html', // Source template file
            filename: 'settings.html', // Output file
            chunks: ['index'] // Include only the index bundle
        }),
        new HtmlWebpackPlugin({
            template: './src/mainpage.html', // Source template file
            filename: 'mainpage.html', // Output file
            chunks: ['index'] // Include only the index bundle
        }),
        new HtmlWebpackPlugin({
            title: 'Output Management',
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
                test: /\.(css|sass|scss)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
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