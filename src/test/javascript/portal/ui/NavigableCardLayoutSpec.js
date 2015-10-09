describe('Portal.ui.NavigableCardLayout', function() {

    var layout;

    beforeEach(function() {
        var mainPanel = new Portal.ui.MainPanel({
            panels: [{}, {}, {}]
        });

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

    describe('navigation labels', function() {
        describe('get next label', function() {
            it("returns 'next' as default", function() {
                expect(layout.getNextNavigationLabel()).toBe(OpenLayers.i18n('navigationButtonNext', {label: "Next"}));
            });

            it("returns 'next' if there is no next tab", function() {
                layout.setActiveItem(TAB_INDEX_DOWNLOAD);
                expect(layout.getNextNavigationLabel()).toBe(OpenLayers.i18n('navigationButtonNext', {label: "Next"}));
            });

            it('returns custom label if next panel has one', function() {
                var someText = 'something else';
                layout.setActiveItem(TAB_INDEX_SEARCH);
                layout.container.items.get(1).navigationText = someText;
                expect(layout.getNextNavigationLabel()).toBe(someText);
            });
        });

        describe('get prev label', function() {
            it("returns 'prev' as default", function() {
                expect(layout.getPrevNavigationLabel()).toBe(OpenLayers.i18n('navigationButtonPrevious', {label: "Previous"}));
            });

            it("returns 'prev' if there is no prev tab", function() {
                layout.setActiveItem(TAB_INDEX_SEARCH);
                expect(layout.getPrevNavigationLabel()).toBe(OpenLayers.i18n('navigationButtonPrevious', {label: "Previous"}));
            });

            it('returns custom label if prev panel has one', function() {
                var someText = 'something else';
                layout.setActiveItem(TAB_INDEX_DOWNLOAD);
                layout.container.items.get(1).navigationText = someText;
                expect(layout.getPrevNavigationLabel()).toBe(someText);
            });
        });
    });

    describe('set active tab links', function() {
        beforeEach(function() {
            layout.setActiveItem(TAB_INDEX_SEARCH);
        });
        it("dont change tab", function() {
            spyOn(layout, 'setActiveItem');
            layout.setActiveTab(TAB_INDEX_SEARCH);
            expect(layout.setActiveItem).not.toHaveBeenCalled();
        });
    });
});
