
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.MainPanel", function() {

    var facetsEnabled = false;
    appConfigStore.isFacetedSearchEnabled = function() { return facetsEnabled; }
    appConfigStore.getById = function(id) {
        if (id == 'spatialsearch.url') {
            return { data: { value: "spatialsearch.aodn.org.au" }};
        }
        return "";
    }

    var mockConfig = {};
    var mockSearchPanel = {};
    var mockSearchTabPanel = {};
    var mockPortalPanel = {
        getMapPanel: function() {return { _closeFeatureInfoPopup: function() {}};}
    };
    var mockHomePanel = {};

    var buildMockMainPanel = function() {
        spyOn(Ext.data.Store.prototype, "load").andCallFake(function (options) {
            return true
        });

        spyOn(Portal.ui, "PortalPanel").andReturn(mockPortalPanel);
        spyOn(Portal.ui, "HomePanel").andReturn(mockHomePanel);
        spyOn(Portal.search, "SearchTabPanel").andReturn(mockSearchTabPanel);
        spyOn(Portal.ui.search, "SearchPanel").andReturn(mockSearchPanel);
        spyOn(Portal.ui.MainPanel.superclass.constructor, "call");
        spyOn(Portal.ui.MainPanel.prototype, "mon");
        spyOn(Portal.ui.MainPanel.prototype, "on");
        spyOn(Portal.ui.MainPanel.superclass.setActiveTab, 'call');
        spyOn(Ext.MsgBus, 'subscribe');

        return new Portal.ui.MainPanel({appConfig: mockConfig, appConfigStore: appConfigStore});
    };

    var mainPanel;

    var initMainPanel = function() {
        mainPanel = buildMockMainPanel();
        mainPanel.items = [];
    };

    describe('initialisation', function() {
        beforeEach(function() {
            initMainPanel();
        });

        it('should init portal panel', function() {
            expect(Portal.ui.PortalPanel).toHaveBeenCalled();
            expect(mainPanel.portalPanel).toEqual(mockPortalPanel);
        });

        it('should init home panel', function() {
            expect(Portal.ui.HomePanel).toHaveBeenCalled();
            expect(mainPanel.homePanel).toEqual(mockHomePanel);
        });

        it('should subscribe to tabchange event', function() {
            expect(Portal.ui.MainPanel.prototype.on).toHaveBeenCalledWith('tabchange', mainPanel._onTabChange, mainPanel);
        });

        it('should subscribe to selectedLayerChange event', function() {
            expect(Ext.MsgBus.subscribe).toHaveBeenCalledWith(
                'selectedLayerChanged', mainPanel.onSelectedLayerChange, mainPanel
            );
        });
    });

    describe("facets enabled", function() {
        beforeEach(function() {
            facetsEnabled = true;
            initMainPanel();
        });

        it("SearchTabPanel is faceted version", function() {
            expect(Portal.ui.search.SearchPanel).toHaveBeenCalled();
            expect(mainPanel.searchTabPanel).toEqual(mockSearchPanel);
        });
    });

    describe("facets disabled", function() {
        beforeEach(function() {
            facetsEnabled = false;
            initMainPanel();
        });

        it("SearchTabPanel is non-faceted version", function() {
            expect(Portal.search.SearchTabPanel).toHaveBeenCalled();
            expect(mainPanel.searchTabPanel).toEqual(mockSearchTabPanel);
        });
    });

    it('doLayout called during setActiveTab', function() {
        initMainPanel();
        spyOn(mainPanel, 'doLayout');
        mainPanel.setActiveTab(new Ext.Panel());
        expect(mainPanel.doLayout).toHaveBeenCalledWith(false, true);
    });
});
