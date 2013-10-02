
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.ui.VisualisePanel', function() {

    Portal.app = {
        config: {
            initialBbox: '130,-60,160,-20',
            autoZoom: false,
            hideLayerOptions: false
        }
    };

    var visualisePanel;

    beforeEach(function() {
        visualisePanel = new Portal.ui.VisualisePanel({
            mapPanel: new Portal.ui.MapPanel()
        });
    });

    describe('before hide', function() {
        it('listens for beforehide event', function() {

            spyOn(visualisePanel, 'onBeforeHide');

            visualisePanel.fireEvent('beforehide');

            expect(visualisePanel.onBeforeHide).toHaveBeenCalled();
        });

        it('tells the mappanel before it hides', function() {

            spyOn(visualisePanel.mapPanel, 'beforeParentHide');

            visualisePanel.onBeforeHide();

            expect(visualisePanel.mapPanel.beforeParentHide).toHaveBeenCalled();
        });
    });

    describe('initialisation', function() {

        it('intialises details panel', function() {
            expect(visualisePanel.detailsPanel.width).toBe(360);
            expect(visualisePanel.detailsPanel.minWidth).toBe(320);
            expect(visualisePanel.detailsPanel.maxWidth).toBe(500);
            expect(visualisePanel.detailsPanel.split).toBeTruthy();
        });

        describe('layout', function() {
            it('positions mapPanel in center region', function() {
                expect(visualisePanel.mapPanel.region).toBe('center');
            });

            it('positions details panel in west region', function() {
                expect(visualisePanel.detailsPanel.region).toBe('west');
            });
        });
    });

    describe('record added', function() {
        it('expands details panel', function() {
            spyOn(visualisePanel.detailsPanel, 'expand');
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);
            expect(visualisePanel.detailsPanel.expand).toHaveBeenCalled();
        });
    });
});
