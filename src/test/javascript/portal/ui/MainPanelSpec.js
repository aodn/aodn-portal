
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

    var buildMockMainPanel = function() {
        spyOn(Ext.data.Store.prototype, "load").andCallFake(function() {
            return true
        });

        spyOn(Portal.ui, "VisualisePanel").andReturn(mockVisualisePanel);
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
            expect(Portal.ui.VisualisePanel).toHaveBeenCalled();
            expect(mainPanel.visualisePanel).toEqual(mockVisualisePanel);
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
            spyOn(mainPanel, "_notifyPanelBeforeSelection");
            spyOn(mainPanel, "_notifyPanelAfterDeselection");
            spyOn(mainPanel, "_getIndexFor");
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

    describe('main panel notifying child panels of change', function() {

        beforeEach(function() {

            initMainPanel();
            mockLayout();

            spyOn(mainPanel, "_getIndexFor").andReturn(9);
            spyOn(mainPanel, "_notifyPanelBeforeSelection");
            spyOn(mainPanel, "_notifyPanelAfterDeselection");
            spyOn(mainPanel, "_highlightActiveTab");
        });

        it('calls functions with correct arguments', function() {

            mainPanel.setActiveTab(4);

            expect(mainPanel._getIndexFor).toHaveBeenCalledWith(mainPanel.layout.activeItem);
            expect(mainPanel._notifyPanelBeforeSelection).toHaveBeenCalledWith(4);
            expect(mainPanel.layout.setActiveItem).toHaveBeenCalledWith(4);
            expect(mainPanel._notifyPanelAfterDeselection).toHaveBeenCalledWith(9);
            expect(mainPanel._highlightActiveTab).toHaveBeenCalled();
        });

        var mockLayout = function() {
            mainPanel.layout = jasmine.createSpyObj('mainPanel.layout', [ 'setActiveItem' ]);
            mainPanel.layout.activeItem = {};
        };
    });

    describe('_notifyPanelBeforeSelection', function() {

        var testPanel;

        beforeEach(function() {

            initMainPanel();

            testPanel = {
                beforeDisplay: function() {}
            };

            spyOn(mainPanel, "_getTabPanelFor").andReturn(testPanel);
            spyOn(testPanel, "beforeDisplay");
        });

        it('calls beforeDisplay if present', function() {

            mainPanel._notifyPanelBeforeSelection(4);

            expect(mainPanel._getTabPanelFor).toHaveBeenCalledWith(4);

            expect(testPanel.beforeDisplay).toHaveBeenCalled();
        });
    });

    describe('_notifyPanelAfterDeselection', function() {

        var testPanel;

        beforeEach(function() {

            initMainPanel();

            testPanel = {
                afterHide: function() {}
            };

            spyOn(mainPanel, "_getTabPanelFor").andReturn(testPanel);
            spyOn(testPanel, "afterHide");
        });

        it('calls afterHide if present', function() {

            mainPanel._notifyPanelAfterDeselection(7);

            expect(mainPanel._getTabPanelFor).toHaveBeenCalledWith(7);

            expect(testPanel.afterHide).toHaveBeenCalled();
        });
    });

    describe('_getTabPanelFor', function() {

        var item1 = {};
        var item2 = {};

        beforeEach(function() {

            initMainPanel();

            spyOn(mainPanel, '_getTabPanelItems').andReturn([item1, item2]);
        });

        it('returns item at index', function() {

            expect(mainPanel._getTabPanelFor(0)).toBe(item1);
            expect(mainPanel._getTabPanelFor(1)).toBe(item2);
        });
    });

    describe('_getIndexFor', function() {

        var item1 = {};
        var item2 = {};

        beforeEach(function() {

            initMainPanel();

            spyOn(mainPanel, '_getTabPanelItems').andReturn([item1, item2]);
        });

        it('returns index for item', function() {

            expect(mainPanel._getIndexFor(item1)).toBe(0);
            expect(mainPanel._getIndexFor(item2)).toBe(1);
        });
    });
});
