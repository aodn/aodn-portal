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

    describe('getDataMarkup', function() {

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
