describe('Custom matchers', function () {

    describe('toHaveParameterWithValue()', function () {

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

    describe('toBeNonEmptyString()', function() {

        it('returns false when undefined', function() {

            expect(undefined).not.toBeNonEmptyString();
        });

        it('returns false when null', function() {

            expect(null).not.toBeNonEmptyString();
        });

        it('returns false when an empty string', function() {

            expect('').not.toBeNonEmptyString();
        });

        it('returns true when a non-empty string', function() {

            expect('potato').toBeNonEmptyString();
        });

        it('returns false when given a non-string object', function() {

            expect({}).not.toBeNonEmptyString();
            expect(true).not.toBeNonEmptyString();
            expect(1).not.toBeNonEmptyString();
            expect([]).not.toBeNonEmptyString();
        });
    });

    describe('returns()', function() {

        it('returns the value it was created with', function() {

            var testObj = {};
            var returnNumber = returns(64);
            var returnBool = returns(false);
            var returnObject = returns(testObj);
            var returnsUndefined = returns(undefined);

            expect(returnNumber()).toBe(64);
            expect(returnBool()).toBe(false);
            expect(returnObject()).toBe(testObj);
            expect(returnsUndefined()).toBe(undefined);
        });
    });
});
