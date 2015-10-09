
Ext.namespace('Portal.details');

describe("Portal.details.DataCollectionDetailsAccordion", function() {

    var dataCollectionDetailsAccordion;

    beforeEach(function() {
        dataCollectionDetailsAccordion = new Portal.details.DataCollectionDetailsAccordion();
    });

    afterEach(function() {
        dataCollectionDetailsAccordion.destroy();
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

            spyOn(dataCollectionDetailsAccordion, 'add');
            spyOn(dataCollectionDetailsAccordion, 'remove');
            spyOn(dataCollectionDetailsAccordion, 'doLayout');
            spyOn(dataCollectionDetailsAccordion, 'setActiveItem');
            spyOn(dataCollectionDetailsAccordion, '_newDataCollectionDetailsPanel').andCallFake(function(dataCollection) {
                return subsetItemsWrapperPanel;
            });
        });

        it('adds item when collection added', function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, dataCollection);
            expect(dataCollectionDetailsAccordion.add).toHaveBeenCalledWith(subsetItemsWrapperPanel);
            expect(dataCollectionDetailsAccordion.doLayout).toHaveBeenCalled();
            expect(dataCollectionDetailsAccordion.setActiveItem).toHaveBeenCalledWith(dataCollection.getUuid());
        });

        it('removes item when collection removed', function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
            expect(dataCollectionDetailsAccordion.remove).toHaveBeenCalledWith(dataCollection.getUuid());
        });
    });
});
