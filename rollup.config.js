import resolve from 'rollup-plugin-node-resolve';

export default {
    input: './dist/esm3/public_api.js',
    output: [
        {
            file: './dist/fesm3/sheetbase-sheets-nosql-server.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: './dist/bundles/sheetbase-sheets-nosql-server.umd.js',
            format: 'umd',
            sourcemap: true,
            name: 'SheetsNosql'
        }
    ],
    plugins: [
        resolve()
    ],
    external: [
        'ejs',
        'handlebars',
    ]
};
