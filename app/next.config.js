const withCSS = require('@zeit/next-css');

module.exports = withCSS({
    webpack(config) {
        config.module.rules.push({
            test: /\.mp3$/,
            loader: 'file-loader'
        });
        config.module.rules.push({
            test: /\.jpg$/,
            loader: 'file-loader'
        });

        return config;
    },
    cssModules: true
});
