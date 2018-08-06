
describe("Portal.details.SubsetItemsTabPanel", function() {

    var dataCollection;
    var subsetItemsTabPanel;

    beforeEach(function() {
        spyOn(Portal.details, 'NcWmsPanel');
        spyOn(Portal.filter.ui, 'FilterGroupPanel');
        spyOn(Portal.details, 'InfoPanel');
        spyOn(Portal.details, 'LayerDetailsPanel');

        dataCollection = {
            isNcwms: returns(false),
            isAla: returns(false)
        };
        subsetItemsTabPanel = new Portal.details.SubsetItemsTabPanel({
            dataCollection: dataCollection
        });
    });

    describe('initialisation', function() {
        it('sets title', function() {
            expect(subsetItemsTabPanel.filterGroupPanel.title).toEqual(OpenLayers.i18n('subsetPanelTitle'));
        });

        describe('filter group panel type', function() {
            var isNcwms;

            beforeEach(function() {
                dataCollection = {
                    isNcwms: function() {
                        return isNcwms;
                    },
                    isAla: function() {
                        return false;
                    }
                }
            });

            it('initialises ncwmsPanel for NcWMS layer', function() {
                isNcwms = true;
                subsetItemsTabPanel = new Portal.details.SubsetItemsTabPanel({
                    dataCollection: dataCollection
                });

                expect(Portal.details.NcWmsPanel).toHaveBeenCalled();
            });

            it('initialises FilterGroupPanel for non-NcWMS layer', function() {
                isNcwms = false;
                subsetItemsTabPanel = new Portal.details.SubsetItemsTabPanel({
                    dataCollection: dataCollection
                });

                expect(Portal.filter.ui.FilterGroupPanel).toHaveBeenCalled();
            });
        });
    });
});

