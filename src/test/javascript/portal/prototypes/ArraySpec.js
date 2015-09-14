describe("Array", function() {

    var obj;

    it('hasDuplicates', function() {

        obj = {test: "astringval"};
        expect([1, 2, 3, 4, 5, 4, 3, 3, 2, 1, undefined].hasDuplicates()).toEqual(true);
        expect([1, 2, 3, 4, 5].hasDuplicates()).toEqual(false);
        expect([1, 2, 3, obj, 4, 5, obj].hasDuplicates()).toEqual(true);
        expect([1, "string", 3, obj, 4, 5, "string"].hasDuplicates()).toEqual(true);
        expect([1, 2, 3, obj].hasDuplicates()).toEqual(false);
    });

});
