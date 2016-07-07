describe('Portal.cart.BaseInjector', function() {

    var injector;
    var dataCollection;

    beforeEach(function() {
        Portal.app.appConfig.portal.metadataProtocols.metadataRecord = 'metadataRecord';
        Portal.app.appConfig.portal.metadataProtocols.dataFile = 'dataFile';

        injector = new Portal.cart.BaseInjector();

        dataCollection = {
            getUuid: returns(9),
            getLinksByProtocol: function(protocols) {
                if (protocols == 'dataFile') {
                    return 'Downloadable link!';
                }
                else if (protocols == 'metadataRecord') {
                    return 'Metadata record link!'
                }
            },
            getFilters: function() {
                return [];
            }
        };
    });

    describe('getPointOfTruthLinks', function() {

        it('returns point of truth links as appropriate', function() {
            expect(injector._getPointOfTruthLink(dataCollection)).toEqual('Metadata record link!');
        });
    });

    describe('getMetadataLinks', function() {

        it('returns metadata links as appropriate', function() {
            expect(injector._getMetadataLinks(dataCollection)).toEqual('Downloadable link!');
        });
    });

    describe('_shouldEstimateSize', function() {
        beforeEach(function() {
            viewport = {
                isOnTab: function(tabIndex) {
                    return viewport.currentTab == tabIndex;
                },
                currentTab: -1
            };
        });

        it('on download step', function() {
            viewport.currentTab = TAB_INDEX_DOWNLOAD;
            spyOn(viewport, 'isOnTab').andCallThrough();
            expect(injector._shouldEstimateSize()).toEqual(true);
            expect(viewport.isOnTab).toHaveBeenCalledWith(TAB_INDEX_DOWNLOAD);
        });

        it('any other step', function() {
            spyOn(viewport, 'isOnTab').andCallThrough();
            expect(injector._shouldEstimateSize()).toEqual(false);
            expect(viewport.isOnTab).toHaveBeenCalledWith(TAB_INDEX_DOWNLOAD);
        });
    });

    describe('getDataMarkup', function() {
        beforeEach(function() {
            injector._shouldEstimateSize = returns(true)
        });

        it('returns the failed message if it can not calculate an estimate', function() {
            spyOn(Portal.cart.DownloadHandler, 'handlersForDataCollection').andReturn([]);

            var markup = injector._getDataMarkup(dataCollection);

            expect(markup).toContain(OpenLayers.i18n('estimatedDlFailedMsg'));
        });

        it('returns the correct placeholder if an estimate is being calculated', function() {

            var sizeEstimateParams = {};

            spyOn(Portal.cart.DownloadHandler, 'handlersForDataCollection').andReturn([{
                canEstimateDownloadSize: returns(true),
                getDownloadEstimateParams: returns(sizeEstimateParams)
            }]);

            var markup = injector._getDataMarkup(dataCollection);

            expect(markup).toContain(dataCollection.getUuid());
            expect(markup).toContain(OpenLayers.i18n("estimatedDlLoadingMessage"));
            expect(markup).toContain(OpenLayers.i18n("faSpinner"));
        });
    });
});
