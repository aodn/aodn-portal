
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
    var mockPortalPanel = {
        getMapPanel: function() {return { _closeFeatureInfoPopup: function() {}};}
    };

    var buildMockMainPanel = function() {
        spyOn(Ext.data.Store.prototype, "load").andCallFake(function (options) {
            return true
        });

        spyOn(Portal.ui, "PortalPanel").andReturn(mockPortalPanel);
        spyOn(Portal.ui.search, "SearchPanel").andReturn(mockSearchPanel);
        spyOn(Portal.ui.MainPanel.prototype, "mon");
        spyOn(Portal.ui.MainPanel.prototype, "on");
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
    });


    describe('card layout', function() {
        beforeEach(function() {
            initMainPanel();
        });

        it('creates an instance of Panel', function() {
            expect(mainPanel).toBeInstanceOf(Ext.Panel);
        });

        it('does not create an instance of TabPanel', function() {
            expect(mainPanel).not.toBeInstanceOf(Ext.TabPanel);
        });

        it('should set layout to cardlayout', function() {
            expect(mainPanel.layout).toBe('card');
        });

        it('should initially have search as the active item', function() {
            expect(mainPanel.activeItem).toBe(TAB_INDEX_SEARCH);
        });
    });

    describe('main panel tab highlighting', function() {

        beforeEach(function() {
            initMainPanel();
            spyOn(mainPanel, "_highlightActiveTab");
        });

        it('on initial load', function() {
            spyOn(Portal.ui.MainPanel.superclass, "afterRender");
            mainPanel.afterRender();
            expect(mainPanel._highlightActiveTab).toHaveBeenCalled();
        });

        it('when switching tabs', function() {
            mockLayout();
            mainPanel.setActiveTab(0);
            expect(mainPanel._highlightActiveTab).toHaveBeenCalled();
        });

        var mockLayout = function() {
            mainPanel.layout = jasmine.createSpyObj('mainPanel.layout', [ 'setActiveItem' ]);
            mainPanel.layout.setActiveItem.andCallFake(function() {});
        };

    });

});
