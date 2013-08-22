
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
    var mockVisualize = {
        getMapPanel: function() {return { _closeFeatureInfoPopup: function() {}};}
    };
    var mockDownloadPanel = {};

    var buildMockMainPanel = function() {
        spyOn(Ext.data.Store.prototype, "load").andCallFake(function (options) {
            return true
        });

        spyOn(Portal.ui.search, "SearchPanel").andReturn(mockSearchPanel);
        spyOn(Portal.ui, "VisualizePanel").andReturn(mockVisualize);
        spyOn(Portal.cart, "DownloadPanel").andReturn(mockDownloadPanel);
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
            expect(Portal.ui.VisualizePanel).toHaveBeenCalled();
            expect(mainPanel.visualizePanel).toEqual(mockVisualize);
        });

        it('should init download panel', function() {
            expect(Portal.cart.DownloadPanel).toHaveBeenCalled();
            expect(mainPanel.downloadCartPanel).toEqual(mockDownloadPanel);
        });

        it('should subscribe to selectedLayerChange event', function() {
            expect(Ext.MsgBus.subscribe).toHaveBeenCalledWith(
                'selectedLayerChanged', mainPanel.onSelectedLayerChange, mainPanel
            );
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
