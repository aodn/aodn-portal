/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Custom matchers', function () {

    describe('toHaveParameterWithValue', function () {

        it('returns false when key not found', function () {

            expect('').not.toHaveParameterWithValue('a', 'b');
            expect('a=b').not.toHaveParameterWithValue('c', 'd');
            expect('a=b&c=d').not.toHaveParameterWithValue('e', 'f');
        });

        it('returns false when key found nut has different value', function () {

            expect('a=b').not.toHaveParameterWithValue('a', 'c');
            expect('a=b&c=d').not.toHaveParameterWithValue('e', 'f');
        });

        it('returns true when key found with value', function () {

            expect('a=b').toHaveParameterWithValue('a', 'b');
            expect('?a=b').toHaveParameterWithValue('a', 'b');
            expect('some_url?a=b').toHaveParameterWithValue('a', 'b');
            expect('http://www.google.com/?a=b').toHaveParameterWithValue('a', 'b');
        });

        it('tests for URL encoded value', function () {

            expect('name=Steve%20Jobs').toHaveParameterWithValue('name','Steve Jobs');
            expect('name=Steve%20Jobs').not.toHaveParameterWithValue('name','Steve%20Jobs');
        });
    });
});
