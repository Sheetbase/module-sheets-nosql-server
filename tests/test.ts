// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { sheetsNosql } from '../src/public_api';
import { DATABASE_ID } from '../src/example';

// NOTE: tests failed
// need to change lodash-es -> lodash in compiled file
// ./out-tsc/src/lib/sheets-nosql.js

const SheetsNosql = sheetsNosql({
    databaseId: DATABASE_ID,
});

describe('Sheets Nosql module test', () => {

    it('SheetsNosql service should be created', () => {
        expect(SheetsNosql).to.be.not.null;
    });

});