# Sheetbase Module: sheets-nosql-server

Using Google Sheets as NoSQL database.

# Install

- NPM: ``$ npm install --save @sheetbase/sheets-nosql-server``

- As library: ``1C88aLF7cK6DFfXGk6Xa8uFRHjHyGpAEfX1-x7XprjSpSazq7d3AI8sNb`` (set Indentifier to **Sheetbase**, [view code](https://script.google.com/d/1C88aLF7cK6DFfXGk6Xa8uFRHjHyGpAEfX1-x7XprjSpSazq7d3AI8sNb/edit?usp=sharing))

## Usage

```http
# get data
GET <web_app_url>?e=/data&path=/path/to/data[&type=object|list]

Error | Success (Object | Array)

# update data
POST: <web_app_url>?e=/data

{
	updates: {[keys: string]: any}
}

Error | Success ({updated: true})
```

## License

[MIT][license-url]

[license-url]: https://github.com/sheetbase/module-sheets-nosql-server/blob/master/LICENSE