/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanel", function() {

    var detailsPanel;

    beforeEach(function() {
        detailsPanel = new Portal.details.DetailsPanel();
    });

    it('checkLayerAvailability', function() {

        spyOn(Ext.Ajax, 'request');

        detailsPanel._checkLayerAvailability({
            grailsLayerId: 123,
            params: {
                QUERYABLE: true
            },
            getFeatureInfoFormat: function() { "someformat" },
            isNcwms: function() { return false; }
        });

        expect(Ext.Ajax.request).toHaveBeenCalled();
        expect(Ext.Ajax.request.mostRecentCall.args[0].url).toBe('checkLayerAvailability/show/123');
    });
});
