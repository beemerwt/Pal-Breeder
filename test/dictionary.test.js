import { PalNames } from '../src/dictionary.js';
import palstats from '../src/palstats.js';
import assert from 'assert';
import { equal } from 'assert';
import { deepEqual } from 'assert';

describe('PalNames', () => {
    it('should have values that match the keys in palstats', () => {
        const palNames = Object.values(PalNames);
        for (let name in palstats) {
            assert(palNames.includes(name));
        }
    });
});
