/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanelTab", function() {

    describe('_ensurePanelsRendered', function() {

        var detailsPanelTab;
        var panel1 = { show: jasmine.createSpy('panel 1 show()') };
        var panel2 = { show: jasmine.createSpy('panel 2 show()') };

        beforeEach(function() {

            spyOn(Portal.filter, 'FilterPanel');
            spyOn(Portal.details, 'AodaacPanel');
            spyOn(Portal.details, 'InfoPanel');
            spyOn(Portal.details, 'StylePanel');

            detailsPanelTab = new Portal.details.DetailsPanelTab();
            detailsPanelTab.items = {
                items: [panel1, panel2]
            };

            detailsPanelTab._ensurePanelsRendered();
        });

        it('calls all the show() methods', function() {

            expect(panel1.show).toHaveBeenCalled();
            expect(panel2.show).toHaveBeenCalled();
        });
    });
});
