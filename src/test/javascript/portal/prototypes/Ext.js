
describe("Ext.Component", function() {
    describe('createSafeCallback', function() {
        var testComponent;
        var callbackSpy;

        beforeEach(function() {
            testComponent = new Ext.Component();
            callbackSpy = jasmine.createSpy('callbackSpy');
        });

        it("calls callback on component if component hasn't been destroyed", function() {
            var testCallback = testComponent.createSafeCallback(callbackSpy);
            testCallback("test");
            expect(callbackSpy).toHaveBeenCalledWith("test");
        });

        it("doesn't call callback if component destroyed", function() {
            var testCallback = testComponent.createSafeCallback(callbackSpy);
            testComponent.destroy();
            testCallback("test");
            expect(callbackSpy).not.toHaveBeenCalled();
        });
    });
});
