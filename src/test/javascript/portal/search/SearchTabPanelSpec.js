/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.SearchTabPabel", function() {

    var searchTabPanel;

    beforeEach(function() {
        spyOn(Ext.Ajax, 'request');
        Portal.app.config.initialBbox = '1, 2, 3, 4';  // So that mini-map doesn't get upset.
        spyOn(appConfigStore, 'getById').andReturn({ data: { value: "something" }});
        searchTabPanel = new Portal.search.SearchTabPanel();
    });

    it('width of east panel', function() {
        var eastItems = searchTabPanel.items.items[0];
        expect(eastItems.region).toBe('east');
        expect(eastItems.width).toBe(390);
    });
});
