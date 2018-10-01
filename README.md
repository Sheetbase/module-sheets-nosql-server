# Sheetbase Module: sheets-nosql-server

Using Google Sheets as NoSQL database.

# Install

- NPM: ``$ npm install --save @sheetbase/sheets-nosql-server``

- As library: ``1C88aLF7cK6DFfXGk6Xa8uFRHjHyGpAEfX1-x7XprjSpSazq7d3AI8sNb`` (set Indentifier to **SheetsNosql**, [view code](https://script.google.com/d/1C88aLF7cK6DFfXGk6Xa8uFRHjHyGpAEfX1-x7XprjSpSazq7d3AI8sNb/edit?usp=sharing))

## Usage

```ts
// to expose module routes, see endpoints
SheetsNosql.registerRoutes();

// get data as list of object
SheetsNosql.list('/foo');
SheetsNosql.collection('foo');

// get data as object
SheetsNosql.object('/foo/foo-1');
SheetsNosql.doc('foo', 'foo-1');

// set/update data
SheetsNosql.update({
	'/foo/foo-2/content': 'New content for foo-2.'
});
```

Module endpoints:

```http
# get data
GET <web_app_url>?e=/data&path=/path/to/data[&type=object|list]

Error | Success (Object | Array)

# update data
POST <web_app_url>?e=/data

{
	"updates": Object
}

Error | Success ({"updated": true})
```

## License

[MIT][license-url]

[license-url]: https://github.com/sheetbase/module-sheets-nosql-server/blob/master/LICENSE