const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/entry.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'esbuild-loader',
            },
            {
                test: /\.jsx$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'jsx',
                    target: 'es2015'
                }
            },
        ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        port: 3001
    },
}