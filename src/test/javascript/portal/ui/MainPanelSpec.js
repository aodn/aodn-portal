
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

    var mainPanel;

    beforeEach(function() {
        Ext.namespace('Portal.app.config');
        Portal.app.config.metadataLayerProtocols = "OGC:WMS-1.1.1-http-get-map\nOGC:WMS-1.3.0-http-get-map";

        mainPanel = new Portal.ui.MainPanel();
    });

    afterEach(function() {
        Ext.MsgBus.unsubscribe('viewgeonetworkrecord', mainPanel._onViewGeoNetworkRecord, mainPanel);
    });

    describe('initialisation', function() {

        it('should init map panel', function() {
            expect(mainPanel.mapPanel).toBeInstanceOf(Portal.ui.MapPanel);
        });

        it('should init portal panel', function() {
            expect(mainPanel.visualisePanel).toBeInstanceOf(Portal.ui.VisualisePanel);
        });

        it('should init search panel', function() {
            expect(mainPanel.searchPanel).toBeInstanceOf(Portal.ui.search.SearchPanel);
            expect(mainPanel.searchPanel.mapPanel).toBe(mainPanel.mapPanel);
        });

        it('should init toolbar', function() {
            expect(mainPanel.getBottomToolbar()).toBeTruthy();
            expect(mainPanel.getBottomToolbar()).toBeInstanceOf(Portal.ui.MainToolbar);
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

        it('should set visualise to active item when geonetwork record is viewed', function() {
            mockLayout();
            Ext.MsgBus.publish('viewgeonetworkrecord');
            expect(mainPanel.layout.setActiveItem).toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
        });

        describe('navigation', function() {
            describe('hasNext, hasPrev', function() {
                it('when on search tab', function() {
                    mainPanel.layout = {
                        activeItem: mainPanel.searchPanel
                    };

                    expect(mainPanel.hasNextTab()).toBe(true);
                    expect(mainPanel.hasPrevTab()).toBe(false);
                });

                it('when on visualise tab', function() {
                    mainPanel.layout = {
                        activeItem: mainPanel.visualisePanel
                    };

                    expect(mainPanel.hasNextTab()).toBe(true);
                    expect(mainPanel.hasPrevTab()).toBe(true);
                });

                it('when on download tab', function() {
                    mainPanel.layout = {
                        activeItem: mainPanel.downloadPanel
                    };

                    expect(mainPanel.hasNextTab()).toBe(false);
                    expect(mainPanel.hasPrevTab()).toBe(true);
                });
            });

            describe('nagivateToNextTab', function() {
                it('should change from search to visualise', function() {
                    spyOn(mainPanel, 'setActiveTab');
                    _setActiveItem(TAB_INDEX_SEARCH);
                    mainPanel.navigateToNextTab();
                    expect(mainPanel.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
                });

                it('should change from visualise to download', function() {
                    spyOn(mainPanel, 'setActiveTab');
                    _setActiveItem(TAB_INDEX_VISUALISE);
                    mainPanel.navigateToNextTab();
                    expect(mainPanel.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_DOWNLOAD);
                });

                it('should not change from download', function() {
                    spyOn(mainPanel, 'setActiveTab');
                    _setActiveItem(TAB_INDEX_DOWNLOAD);
                    mainPanel.navigateToNextTab();
                    expect(mainPanel.setActiveTab).not.toHaveBeenCalled();
                });
            });

            describe('nagivateToPrevTab', function() {
                it('should change from download to visualise', function() {
                    spyOn(mainPanel, 'setActiveTab');
                    _setActiveItem(TAB_INDEX_DOWNLOAD);
                    mainPanel.navigateToPrevTab();
                    expect(mainPanel.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
                });

                it('should change from visualise to search', function() {
                    spyOn(mainPanel, 'setActiveTab');
                    _setActiveItem(TAB_INDEX_VISUALISE);
                    mainPanel.navigateToPrevTab();
                    expect(mainPanel.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_SEARCH);
                });

                it('should not change from search', function() {
                    spyOn(mainPanel, 'setActiveTab');
                    _setActiveItem(TAB_INDEX_SEARCH);
                    mainPanel.navigateToPrevTab();
                    expect(mainPanel.setActiveTab).not.toHaveBeenCalled();
                });
            });

            var _setActiveItem = function(itemIndex) {
                mainPanel.layout = {
                    activeItem: itemIndex
                };
            };
        });

        it('should fire tabchange event', function() {
            mainPanel.layout = {
                setActiveItem: function() {}
            };
            var tabChangeSpy = jasmine.createSpy('tabchange');
            mainPanel.on('tabchange', tabChangeSpy);
            mainPanel.setActiveTab(0);
            expect(tabChangeSpy).toHaveBeenCalledWith(mainPanel);
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
        spyOn(Portal.ui.MainPanel.prototype, "doLayout").andReturn(function() {});
        mainPanel.layout = jasmine.createSpyObj('mainPanel.layout', [ 'setActiveItem' ]);
        mainPanel.layout.setActiveItem.andCallFake(function() {});
    };
});
