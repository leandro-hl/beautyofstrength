module.exports = {
    plugins: [{ plugin:
            require('@semantic-ui-react/craco-less')
    }],
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // webpackConfig.mode = 'production';
            // webpackConfig.devtool = false;

            return webpackConfig;
        },
        globals: {
            'MercadoPago': 'readonly'
        }
    },
    eslint: {
        enable: true,
        mode: "extends",
        configure: {
            globals: {
                MercadoPago: true
            }
        },
        loaderOptions: {
            emitWarning: true
        }
    },
}