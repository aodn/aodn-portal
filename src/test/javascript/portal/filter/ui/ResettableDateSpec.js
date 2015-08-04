

describe("Portal.filter.ui.ResettableDate", function() {

    describe('change event', function() {
        var resettableDate;
        var changeSpy;

        beforeEach(function() {
            resettableDate = new Portal.filter.ui.ResettableDate({
                name: 'test'
            });

            changeSpy = jasmine.createSpy();
            resettableDate.on('change', changeSpy);
        });

        it('only triggered when date actually changed', function() {
            resettableDate.setValue('2015/03/23');
            resettableDate._onChange();
            resettableDate._onChange();

            expect(changeSpy.callCount).toEqual(1);
        });

        it('triggers each change in date', function() {
            resettableDate.setValue('2015/03/23');
            resettableDate._onChange();
            resettableDate.setValue('2015/03/21');
            resettableDate._onChange();

            expect(changeSpy.callCount).toEqual(2);
        });

    });

});
