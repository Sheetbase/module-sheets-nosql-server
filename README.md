# Sheetbase Module: @sheetbase/sheets-nosql-server

Using Google Sheets as NoSQL database.

<!-- <block:header> -->

[![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

- Using npm: `npm install --save @sheetbase/sheets-nosql-server`

- As a library: `1C88aLF7cK6DFfXGk6Xa8uFRHjHyGpAEfX1-x7XprjSpSazq7d3AI8sNb`

  Set the _Indentifier_ to **SheetsNosql** and select the lastest version, [view code](https://script.google.com/d/1C88aLF7cK6DFfXGk6Xa8uFRHjHyGpAEfX1-x7XprjSpSazq7d3AI8sNb/edit?usp=sharing).

## Scopes

`https://www.googleapis.com/auth/script.scriptapp`

`https://www.googleapis.com/auth/spreadsheets`

## Examples

```ts
function example1(): void {
  const object = SheetsNosql.object("/foo/foo-3");
  Logger.log(object);
}

function example2(): void {
  const list = SheetsNosql.list("/foo/foo-2/content");
  Logger.log(list);
}

function example3(): void {
  const update = SheetsNosql.update({
    "/foo/foo-6/content": new Date().getTime()
  });
  Logger.log(update);
}
```

## Documentation

See the docs: https://sheetbase.github.io/module-sheets-nosql-server

## API

An overview of the API, for detail please refer [the documentation](https://sheetbase.github.io/module-sheets-nosql-server).

### SheetsNosql

```ts
export interface IModule {
  init(options: IOptions): IModule;
  registerRoutes(options?: IAddonRoutesOptions): void;
  object(path: string);
  list(path: string): any[];
  doc(collectionId: string, docId: string);
  collection(collectionId: string): any[];
  update(updates: { [key: string]: any }): boolean;
}
```

## License

**@sheetbase/sheets-nosql-server** is released under the [MIT](https://github.com/sheetbase/module-sheets-nosql-server/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/module-sheets-nosql-server/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://ionicabizau.github.io/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://ionicabizau.github.io/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
