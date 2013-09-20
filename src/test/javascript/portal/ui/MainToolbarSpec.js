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

        mockLayoutForMainPanel(mainPanel);
    });

    describe('on main panel tab change', function() {

        beforeEach(function() {
            spyOn(mainToolbar.prevButton, 'setVisible');
            spyOn(mainToolbar.nextButton, 'setVisible');
        });

        describe('to first tab', function() {
            beforeEach(function() {
                mainPanel.layout.hasPrevTab = function() { return false; }
                mainPanel.layout.hasNextTab = function() { return true; }
                mainPanel.fireEvent('tabchange', mainPanel);
            });

            it('hides prev button', function() {
                expect(mainToolbar.prevButton.setVisible).toHaveBeenCalledWith(false);
            });

            it('show next button', function() {
                expect(mainToolbar.nextButton.setVisible).toHaveBeenCalledWith(true);
            });
        });

        describe('to middle tab', function() {
            beforeEach(function() {
                mainPanel.layout.hasPrevTab = function() { return true; }
                mainPanel.layout.hasNextTab = function() { return true; }
                mainPanel.fireEvent('tabchange', mainPanel);
            });

            it('shows prev button', function() {
                expect(mainToolbar.prevButton.setVisible).toHaveBeenCalledWith(true);
            });

            it('shows next button', function() {
                expect(mainToolbar.nextButton.setVisible).toHaveBeenCalledWith(true);
            });
        });

        describe('to last tab', function() {
            beforeEach(function() {
                mainPanel.layout.hasPrevTab = function() { return true; }
                mainPanel.layout.hasNextTab = function() { return false; }
                mainPanel.fireEvent('tabchange', mainPanel);
            });

            it('shows prev button', function() {
                expect(mainToolbar.prevButton.setVisible).toHaveBeenCalledWith(true);
            });

            it('hides next button', function() {
                expect(mainToolbar.nextButton.setVisible).toHaveBeenCalledWith(false);
            });
        });

        describe('updates button labels', function() {
            it('next button', function() {
                spyOn(mainPanel.layout, 'getNextNavigationLabel').andReturn('ppp');
                spyOn(mainToolbar.nextButton, 'setText');

                mainPanel.fireEvent('tabchange', mainPanel);
                expect(mainPanel.layout.getNextNavigationLabel).toHaveBeenCalled();
                expect(mainToolbar.nextButton.setText).toHaveBeenCalledWith('ppp');
            });

            it('prev button', function() {
                spyOn(mainPanel.layout, 'getPrevNavigationLabel').andReturn('ppp');
                spyOn(mainToolbar.prevButton, 'setText');

                mainPanel.fireEvent('tabchange', mainPanel);
                expect(mainPanel.layout.getPrevNavigationLabel).toHaveBeenCalled();
                expect(mainToolbar.prevButton.setText).toHaveBeenCalledWith('ppp');
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
