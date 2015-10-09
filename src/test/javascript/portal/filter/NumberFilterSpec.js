describe("Portal.filter.NumberFilter", function() {

    var filter;

    beforeEach(function() {

        filter = new Portal.filter.NumberFilter({
            name: 'column_name',
            label: 'Important number'
        });
        filter._generateOperatorHtml = returns('html');
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
                operator: {
                    cql: '>= {0}'
                }
            });
        });

        describe('getCql', function() {

            it('returns correct CQL', function() {

                expect(filter.getCql()).toBe('column_name >= 5');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns description', function() {

                expect(filter.getHumanReadableForm()).toBe('Important number:  html 5');
            });
        });
    });

    describe('first field is 0', function() {

        beforeEach(function() {

            filter.setValue({
                firstField: 0
            });
        });

        describe('hasValue', function() {

            it('returns true', function() {

                expect(filter.hasValue()).toBeTruthy();
            });
        });
    });

    describe('two values entered', function() {

        beforeEach(function() {

            filter.setValue({
                firstField: 5,
                operator: {
                    cql: 'between {0} AND {1}'
                },
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

                expect(filter.getHumanReadableForm()).toBe('Important number: 5 html 99');
            });
        });
    });

    describe('_generateOperatorHtml', function() {

        it('contains required information', function() {

            var operator = {
                text: 'less than',
                symbol: '<'
            };

            filter = new Portal.filter.NumberFilter({
                value: { operator: operator }
            });

            var html = filter._generateOperatorHtml(operator);

            expect(html).toContain(operator.text);
            expect(html).toContain(operator.symbol);
        });
    });
});
