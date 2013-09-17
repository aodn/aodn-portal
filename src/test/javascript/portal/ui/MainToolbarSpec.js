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
        mainPanel = new Portal.ui.MainPanel();
        mainToolbar = new Portal.ui.MainToolbar({
            mainPanel: mainPanel
        });

        mainPanel.render(document.body);
    });

    describe('on main panel tab change', function() {

        beforeEach(function() {
            spyOn(mainToolbar.prevButton, 'setDisabled');
            spyOn(mainToolbar.nextButton, 'setDisabled');
        });

        describe('to first tab', function() {
            beforeEach(function() {
                mainPanel.layout.hasPrevTab = function() { return false; }
                mainPanel.layout.hasNextTab = function() { return true; }
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
                mainPanel.layout.hasPrevTab = function() { return true; }
                mainPanel.layout.hasNextTab = function() { return true; }
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
                mainPanel.layout.hasPrevTab = function() { return true; }
                mainPanel.layout.hasNextTab = function() { return false; }
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
            spyOn(mainPanel.layout, 'navigateToNextTab');
            mainToolbar.nextButton.fireEvent('click');
            expect(mainPanel.layout.navigateToNextTab).toHaveBeenCalled();
        });

        it('calls prev tab on prev click', function() {
            spyOn(mainPanel.layout, 'navigateToPrevTab');
            mainToolbar.prevButton.fireEvent('click');
            expect(mainPanel.layout.navigateToPrevTab).toHaveBeenCalled();
        });
    });
});
