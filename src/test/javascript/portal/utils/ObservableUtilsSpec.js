
describe("Portal.utils.ObservableUtils", function() {

    describe('makeObservable()', function() {
        var eventTester;
        var testObject;
        var testEventName = 'someEvent';

        beforeEach(function() {
            eventTester = jasmine.createSpy('event tester');

            testObject = {};
            Portal.utils.ObservableUtils.makeObservable(testObject);

            testObject.on(testEventName, eventTester);
        });

        it('responds to registered event', function() {
            testObject.fireEvent(testEventName);
            expect(eventTester).toHaveBeenCalled();
        });

        it('does not respond to other event', function() {
            testObject.fireEvent('someOtherEvent');
            expect(eventTester).not.toHaveBeenCalled();
        });

        it('unregisters event', function() {
            testObject.un(testEventName, eventTester);
            testObject.fireEvent(testEventName);

            expect(eventTester).not.toHaveBeenCalled();
        });
    });
});
