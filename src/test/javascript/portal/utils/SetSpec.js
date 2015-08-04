

describe("Portal.utils.Set", function() {
    var testSet;

    beforeEach(function() {
        testSet = new Portal.utils.Set();
    });

    it('size zero on initialization', function() {
        expect(testSet.size()).toEqual(0);
    });

    describe('add', function() {
        it('two items', function() {
            testSet.add("test1");
            testSet.add("test2");

            expect(testSet.size()).toEqual(2);
            expect(testSet.contains("test1")).toBe(true);
            expect(testSet.contains("test2")).toBe(true);
            expect(testSet.contains("test3")).toBe(false);
        });

        it('exising item', function() {
            testSet.add("test1");
            expect(testSet.size()).toEqual(1);
            expect(testSet.contains("test1")).toBe(true);

            testSet.add("test1");
            expect(testSet.size()).toEqual(1);
            expect(testSet.contains("test1")).toBe(true);
        });
    });

    describe('remove', function() {

        it('existing item', function() {
            testSet.add("test1");
            testSet.remove("test1");
            expect(testSet.size()).toEqual(0);
            expect(testSet.contains("test1")).toBe(false);
        });

        it('non existing item', function() {
            testSet.remove("test1");
            expect(testSet.size()).toEqual(0);

            testSet.add("test2");
            expect(testSet.size()).toEqual(1);

            testSet.remove("test1");
            expect(testSet.size()).toEqual(1);
            expect(testSet.contains("test1")).toBe(false);
        });
    });
});
