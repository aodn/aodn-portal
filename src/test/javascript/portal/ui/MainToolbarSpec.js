/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.MainToolbar", function() {

    var mainPanel;
    var mainToolbar;

    beforeEach(function() {

        Ext.namespace('Portal.app.config');
        Portal.app.config.metadataLayerProtocols = "OGC:WMS-1.1.1-http-get-map\nOGC:WMS-1.3.0-http-get-map";

        mainPanel = new Portal.ui.MainPanel();
        mainToolbar = new Portal.ui.MainToolbar({
            mainPanel: mainPanel
        });
    });

    describe('on main panel tab change', function() {

        beforeEach(function() {
            spyOn(mainToolbar.prevButton, 'setDisabled');
            spyOn(mainToolbar.nextButton, 'setDisabled');
        });

        describe('to first tab', function() {
            beforeEach(function() {
                mainPanel.hasPrevTab = function() { return false; }
                mainPanel.hasNextTab = function() { return true; }
                mainPanel.fireEvent('tabchange', mainPanel);
            });

            it('disables prev button', function() {
                expect(mainToolbar.prevButton.setDisabled).toHaveBeenCalledWith(true);
            });

            it('enables next button', function() {
                expect(mainToolbar.nextButton.setDisabled).toHaveBeenCalledWith(false);
            });
        });

        describe('to middle tab', function() {
            beforeEach(function() {
                mainPanel.hasPrevTab = function() { return true; }
                mainPanel.hasNextTab = function() { return true; }
                mainPanel.fireEvent('tabchange', mainPanel);
            });

            it('enables prev button', function() {
                expect(mainToolbar.prevButton.setDisabled).toHaveBeenCalledWith(false);
            });

            it('enables next button', function() {
                expect(mainToolbar.nextButton.setDisabled).toHaveBeenCalledWith(false);
            });
        });

        describe('to last tab', function() {
            beforeEach(function() {
                mainPanel.hasPrevTab = function() { return true; }
                mainPanel.hasNextTab = function() { return false; }
                mainPanel.fireEvent('tabchange', mainPanel);
            });

            it('enables prev button', function() {
                expect(mainToolbar.prevButton.setDisabled).toHaveBeenCalledWith(false);
            });

            it('enables next button', function() {
                expect(mainToolbar.nextButton.setDisabled).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('button handlers', function() {
        it('calls next tab on next click', function() {
            spyOn(mainPanel, 'navigateToNextTab');
            mainToolbar.nextButton.fireEvent('click');
            expect(mainPanel.navigateToNextTab).toHaveBeenCalled();
        });

        it('calls prev tab on prev click', function() {
            spyOn(mainPanel, 'navigateToPrevTab');
            mainToolbar.prevButton.fireEvent('click');
            expect(mainPanel.navigateToPrevTab).toHaveBeenCalled();
        });
    });
});
