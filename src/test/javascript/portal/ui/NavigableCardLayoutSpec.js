/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.ui.NavigableCardLayout', function() {

    var layout;

    beforeEach(function() {
        var mainPanel = new Portal.ui.MainPanel();

        mockLayoutForMainPanel(mainPanel);
        layout = mainPanel.layout;
    });

    describe('hasNext, hasPrev', function() {
        it('when on search tab', function() {
            layout.setActiveItem(TAB_INDEX_SEARCH);
            expect(layout.hasNextTab()).toBe(true);
            expect(layout.hasPrevTab()).toBe(false);
        });

        it('when on visualise tab', function() {
            layout.setActiveItem(TAB_INDEX_VISUALISE);
            expect(layout.hasNextTab()).toBe(true);
            expect(layout.hasPrevTab()).toBe(true);
        });

        it('when on download tab', function() {
            layout.setActiveItem(TAB_INDEX_DOWNLOAD);
            expect(layout.hasNextTab()).toBe(false);
            expect(layout.hasPrevTab()).toBe(true);
        });
    });

    describe('nagivateToNextTab', function() {
        it('should change from search to visualise', function() {
            spyOn(layout, 'setActiveTab');
            layout.setActiveItem(TAB_INDEX_SEARCH);
            layout.navigateToNextTab();
            expect(layout.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
        });

        it('should change from visualise to download', function() {
            spyOn(layout, 'setActiveTab');
            layout.setActiveItem(TAB_INDEX_VISUALISE);
            layout.navigateToNextTab();
            expect(layout.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_DOWNLOAD);
        });

        it('should not change from download', function() {
            spyOn(layout, 'setActiveTab');
            layout.setActiveItem(TAB_INDEX_DOWNLOAD);
            layout.navigateToNextTab();
            expect(layout.setActiveTab).not.toHaveBeenCalled();
        });
    });

    describe('nagivateToPrevTab', function() {
        it('should change from download to visualise', function() {
            spyOn(layout, 'setActiveTab');
            layout.setActiveItem(TAB_INDEX_DOWNLOAD);
            layout.navigateToPrevTab();
            expect(layout.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
        });

        it('should change from visualise to search', function() {
            spyOn(layout, 'setActiveTab');
            layout.setActiveItem(TAB_INDEX_VISUALISE);
            layout.navigateToPrevTab();
            expect(layout.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_SEARCH);
        });

        it('should not change from search', function() {
            spyOn(layout, 'setActiveTab');
            layout.setActiveItem(TAB_INDEX_SEARCH);
            layout.navigateToPrevTab();
            expect(layout.setActiveTab).not.toHaveBeenCalled();
        });
    });
});
