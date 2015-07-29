/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

describe("Portal.details.SubsetPanelAccordion", function() {

    var subsetPanelAccordion;

    beforeEach(function() {
        subsetPanelAccordion = new Portal.details.SubsetPanelAccordion();
    });

    afterEach(function() {
        subsetPanelAccordion.destroy();
    });

    describe('data collection changes', function() {

        var dataCollection;
        var subsetItemsWrapperPanel;

        beforeEach(function() {
            dataCollection = {
                getUuid: returns('12345')
            };
            subsetItemsWrapperPanel = {
                dataCollection: dataCollection
            };

            spyOn(subsetPanelAccordion, 'add');
            spyOn(subsetPanelAccordion, 'remove');
            spyOn(subsetPanelAccordion, '_newSubsetItemsWrapperPanel').andCallFake(function(dataCollection) {
                return subsetItemsWrapperPanel;
            });
        });

        // PORTAL_EVENTS.DATA_COLLECTION_SELECTED?

        it('adds item when collection added', function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, dataCollection);
            expect(subsetPanelAccordion.add).toHaveBeenCalledWith(subsetItemsWrapperPanel);
        });

        it('removes item when collection removed', function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
            expect(subsetPanelAccordion.remove).toHaveBeenCalledWith(dataCollection.getUuid());
        });
    });
});
