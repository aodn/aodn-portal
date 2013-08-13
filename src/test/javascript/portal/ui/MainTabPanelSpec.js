
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.MainTabPanel", function() {

    Portal.app.config.metadataLayerProtocols = "";

    appConfigStore.getById = function(id) {
        if (id == 'spatialsearch.url') {
            return { data: { value: "spatialsearch.aodn.org.au" }};
        }
        return "";
    };

    var mockConfig = {};
    var mockSearchPanel = {};
    var mockPortalPanel = {
        getMapPanel: function() {return { _closeFeatureInfoPopup: function() {}};}
    };
    var mockHomePanel = {};

    var buildMockMainTabPanel = function() {
        spyOn(Ext.data.Store.prototype, "load").andCallFake(function (options) {
            return true
        });

        spyOn(Portal.ui, "PortalPanel").andReturn(mockPortalPanel);
        spyOn(Portal.ui, "HomePanel").andReturn(mockHomePanel);
        spyOn(Portal.ui.search, "SearchPanel").andReturn(mockSearchPanel);
        spyOn(Portal.ui.MainTabPanel.superclass.constructor, "call");
        spyOn(Portal.ui.MainTabPanel.prototype, "mon");
        spyOn(Portal.ui.MainTabPanel.prototype, "on");
        spyOn(Portal.ui.MainTabPanel.superclass.setActiveTab, 'call');

        return new Portal.ui.MainTabPanel({appConfig: mockConfig, appConfigStore: appConfigStore});
    };

    var mainTabPanel;

    var initMainTabPanel = function() {
        mainTabPanel = buildMockMainTabPanel();
        mainTabPanel.items = [];
    };

    describe("initMainTabPanel", function() {
        beforeEach(function() {
            initMainTabPanel();
        });

        it("creates map, search and portal panels and monitors search panel layeradd events on instantiation", function() {
            expect(Portal.ui.PortalPanel).toHaveBeenCalled();
            expect(Portal.ui.HomePanel).toHaveBeenCalled();
            expect(Portal.ui.search.SearchPanel).toHaveBeenCalled();
            expect(Portal.ui.MainTabPanel.superclass.constructor.call).toHaveBeenCalled();
            expect(mainTabPanel.portalPanel).toEqual(mockPortalPanel);
            expect(mainTabPanel.homePanel).toEqual(mockHomePanel);
            expect(mainTabPanel.searchTabPanel).toEqual(mockSearchPanel);
            expect(Portal.ui.MainTabPanel.prototype.on).toHaveBeenCalled();
        });

        it('doLayout called during setActiveTab', function() {
            spyOn(mainTabPanel, 'doLayout');
            mainTabPanel.setActiveTab(new Ext.Panel());
            expect(mainTabPanel.doLayout).toHaveBeenCalledWith(false, true);
        });
    });
});
