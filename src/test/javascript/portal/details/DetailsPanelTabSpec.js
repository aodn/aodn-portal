/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanelTab", function() {

    describe('_ensurePanelsRendered', function() {

        var detailsPanelTab;
        var orderCalled;
        var panel1 = {
            show: jasmine.createSpy('panel 1 show()').andCallFake(
                function() { orderCalled.push(this) }
            )
        };
        var panel2 = {
            show: jasmine.createSpy('panel 2 show()').andCallFake(
                function() { orderCalled.push(this) }
            )
        };

        beforeEach(function() {

            spyOn(Portal.filter, 'FilterPanel');
            spyOn(Portal.details, 'AodaacPanel');
            spyOn(Portal.details, 'InfoPanel');
            spyOn(Portal.details, 'StylePanel');

            detailsPanelTab = new Portal.details.DetailsPanelTab();
            detailsPanelTab.items = {
                items: [panel1, panel2]
            };
            orderCalled = [];

            detailsPanelTab._ensurePanelsRendered();
        });

        it('calls all the show() methods', function() {

            expect(panel1.show).toHaveBeenCalled();
            expect(panel2.show).toHaveBeenCalled();
        });

        it('calls the show methods in reverse order', function() {

            // Panel 1 shown after panel 2
            expect(orderCalled).toEqual([panel2, panel1]);
        });
    });
});
