const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

module.exports = () => {
    const output = {
        path: path.resolve(__dirname, 'build'),
        filename: '[name]/main.js',
        chunkFilename: "[name]/main.js"
    };

    const plugins = [];

    const entry = {};

    function makeEntry(chapter) {
        const root = path.resolve(__dirname, chapter);
        const pa = fs.readdirSync(root);
        pa.forEach((el) => {
            const info = fs.statSync(path.resolve(root, el));
            if (info.isDirectory()) {
                const entryPath = path.resolve(root, el, 'main.ts');
                const isEntry = fs.existsSync(entryPath);
                if (isEntry) {
                    entry[`${chapter.replace("src/", "")}/${el}`] = entryPath;
                }
            }
        });
    }

    for (let i = 1; i < 2; i++) {
        makeEntry(`src/chapter${`0${i}`.slice(-2)}`);
    }

    for (let key in entry) {
        plugins.push(
            new HtmlWebpackPlugin({
                template: entry[key].replace(/main\.ts$/, 'index.html'),
                title: key.split('/')[1],
                filename: `${key}/index.html`,
                chunks: [key], // 这里应该就可以找到 modA/modA.js 
                inject: true,
            })
        );
    };

    if (process.env.NODE_ENV === 'development') {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.SourceMapDevToolPlugin({}),
        );
    }

    return {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        entry,
        output,
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
            plugins: [
                new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
            ]
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'awesome-typescript-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(frag|vert|glsl)$/,
                    use: {
                        loader: 'glsl-shader-loader',
                        options: {},
                    },
                },
            ],
        },

        devServer: {
            contentBase: path.join(__dirname, 'src'),
            compress: true,
            port: 3000,
            hot: true,
            open: true
        },

        plugins,
        // list of additional plugins

        /* Advanced configuration (click to show) */
    };
}