/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.NumberFilter", function() {

    var filter;

    beforeEach(function() {

        filter = new Portal.filter.NumberFilter({
            name: 'column_name',
            label: 'Important number'
        });
    });

    describe('empty value entered', function() {

        beforeEach(function() {

            filter.setValue({});
        });

        describe('hasValue', function() {

            it('returns false', function() {

                expect(filter.hasValue()).not.toBeTruthy();
            });
        });
    });

    describe('one value entered', function() {

        beforeEach(function() {

            filter.setValue({
                firstField: 5,
                operator: '>='
            });
        });

        describe('getCql', function() {

            it('returns correct CQL', function() {

                expect(filter.getCql()).toBe('column_name >= 5');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns description', function() {

                expect(filter.getHumanReadableForm()).toBe('Important number >= 5');
            });
        });
    });

    describe('two values entered', function() {

        beforeEach(function() {

            filter.setValue({
                firstField: 5,
                operator: 'between',
                secondField: 99
            });
        });

        describe('getCql', function() {

            it('returns correct CQL', function() {

                expect(filter.getCql()).toBe('column_name between 5 AND 99');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns description', function() {

                expect(filter.getHumanReadableForm()).toBe('Important number between 5 AND 99');
            });
        });
    });
});
