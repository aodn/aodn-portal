/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.BaseInjector', function() {

    var injector;
    var geoNetworkRecord;

    beforeEach(function() {

        injector = new Portal.cart.BaseInjector();

        geoNetworkRecord = {
            uuid: 9,
            dataDownloadHandlers: [],
            pointOfTruthLink: 'Link!',
            linkedFiles: 'Downloadable link!'
        }
    });

    describe('getPointOfTruthLinks', function() {

        it('returns point of truth links as appropriate', function() {
            expect(injector._getPointOfTruthLink(geoNetworkRecord)).toEqual('Link!');
        });
    });

    describe('getMetadataLinks', function() {

        it('returns metadata links as appropriate', function() {
            expect(injector._getMetadataLinks(geoNetworkRecord)).toEqual('Downloadable link!');
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
            injector._shouldEstimateSize = function() { return true; }
        });

        it('returns the failed message if it can not calculate an estimate', function() {

            var markup = injector._getDataMarkup(geoNetworkRecord);

            expect(markup).toContain(OpenLayers.i18n('estimatedDlFailedMsg'));
        });

        it('returns the correct placeholder if an estimate is being calculated', function() {

            var sizeEstimateParams = {};

            geoNetworkRecord.dataDownloadHandlers.push({
                canEstimateDownloadSize: function() { return true },
                getDownloadEstimateParams: function() { return sizeEstimateParams }
            });

            var markup = injector._getDataMarkup(geoNetworkRecord);

            expect(markup).toContain(geoNetworkRecord.uuid);
            expect(markup).toContain(OpenLayers.i18n("estimatedDlLoadingMessage"));
            expect(markup).toContain(OpenLayers.i18n("estimatedDlLoadingSpinner"));
        });
    });
});
