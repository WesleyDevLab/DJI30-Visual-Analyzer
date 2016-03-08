var path = require('path');

module.exports = {
    entry: './views/components/main.jsx',
    output: {
        path: path.join(__dirname, 'public/javascripts/build/'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { test: /\.js|jsx$/, exclude: /node_modules/, loaders: ['babel'] }
        ]
    }
}