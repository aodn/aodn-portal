
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.MainPanel", function() {

    appConfigStore.getById = function(id) {
        if (id == 'spatialsearch.url') {
            return { data: { value: "spatialsearch.aodn.org.au" }};
        }
        return "";
    };

    var mockConfig = {};
    var mockSearchPanel = {};
    var mockVisualisePanel = {};
    var mockMapPanel = {};

    var buildMockMainPanel = function() {
        spyOn(Ext.data.Store.prototype, "load").andCallFake(function() {
            return true
        });

        spyOn(Portal.ui, "MapPanel").andReturn(mockMapPanel);
        spyOn(Portal.ui, "VisualisePanel").andReturn(mockVisualisePanel);
        spyOn(Portal.ui.search, "SearchPanel").andReturn(mockSearchPanel);
        spyOn(Portal.ui.MainPanel.prototype, "mon");
        spyOn(Portal.ui.MainPanel.prototype, "on");

        return new Portal.ui.MainPanel({appConfig: mockConfig, appConfigStore: appConfigStore});
    };

    var mainPanel;

    var initMainPanel = function() {
        mainPanel = buildMockMainPanel();
        mainPanel.items = [];
    };

    beforeEach(function() {
        initMainPanel();
    });

    afterEach(function() {
        Ext.MsgBus.unsubscribe('activegeonetworkrecordadded', mainPanel._onActiveGeoNetworkRecordAdded, mainPanel);
    });

    describe('initialisation', function() {

        it('should init map panel', function() {
            expect(Portal.ui.MapPanel).toHaveBeenCalled();
            expect(mainPanel.mapPanel).toEqual(mockMapPanel);
        });

        it('should init portal panel', function() {
            expect(Portal.ui.VisualisePanel).toHaveBeenCalled();
            expect(mainPanel.visualisePanel).toEqual(mockVisualisePanel);
        });

        it('should init search panel', function() {
            expect(Portal.ui.search.SearchPanel).toHaveBeenCalled();
            expect(Portal.ui.search.SearchPanel.calls[0].args[0].mapPanel).toBe(mockMapPanel);
            expect(mainPanel.searchPanel).toEqual(mockSearchPanel);
        });
    });

    describe('card layout', function() {
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

        it('should set visualise to active item when geonetwork record is added', function() {
            mockLayout();
            Ext.MsgBus.publish('activegeonetworkrecordadded');
            expect(mainPanel.layout.setActiveItem).toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
        });
    });

    describe('main panel tab highlighting', function() {
        beforeEach(function() {
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
    });

    var mockLayout = function() {
        mainPanel.layout = jasmine.createSpyObj('mainPanel.layout', [ 'setActiveItem' ]);
        mainPanel.layout.setActiveItem.andCallFake(function() {});
    };
});
