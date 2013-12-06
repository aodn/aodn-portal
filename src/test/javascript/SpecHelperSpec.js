/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Custom matchers', function () {

    describe('toHaveParam', function () {

        it('returns false when key not found', function () {

            expect('').not.toHaveParam('a', 'b');
            expect('a=b').not.toHaveParam('c', 'd');
            expect('a=b&c=d').not.toHaveParam('e', 'f');
        });

        it('returns false when key found nut has different value', function () {

            expect('a=b').not.toHaveParam('a', 'c');
            expect('a=b&c=d').not.toHaveParam('e', 'f');
        });

        it('returns true when key found with value', function () {

            expect('a=b').toHaveParam('a', 'b');
            expect('?a=b').toHaveParam('a', 'b');
            expect('some_url?a=b').toHaveParam('a', 'b');
            expect('http://www.google.com/?a=b').toHaveParam('a', 'b');
        });
    });
});
