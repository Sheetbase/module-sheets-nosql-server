// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { sheetsNosql } from '../src/public_api';
import { databaseId } from '../src/example';

const SheetsNosql = sheetsNosql({ databaseId });

describe('Sheets Nosql module test', () => {

    it('SheetsNosql service should be created', () => {
        expect(SheetsNosql).to.be.not.null;
    });

});