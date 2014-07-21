
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.NoDataInjector', function() {

    var injector;
    var geoNetworkRecord;

    beforeEach(function() {

        injector = new Portal.cart.NoDataInjector();

        geoNetworkRecord = {
            uuid: 9,
            pointOfTruthLink: 'Link!',
            linkedFiles: 'Downloadable link!'
        }
    });

    describe('constructor', function() {

        it('assigns values from passed in config', function() {
            var callback = noOp;
            var _tpl = new Portal.cart.NoDataInjector({ downloadConfirmation: callback, downloadConfirmationScope: this });
            expect(_tpl.downloadConfirmation).toBe(callback);
            expect(_tpl.downloadConfirmationScope).toBe(this);
        });
    });

    describe('getDataFilterEntry', function() {

        it('it returns text that contains a no data available message', function() {
            expect(injector._getDataFilterEntry()).toContain(OpenLayers.i18n('noDataMessage'));
        });
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

    describe('getDataSpecificMarkup', function() {

        it('returns no specific markup', function() {
            expect(injector._getDataMarkup()).toEqual('');
        });
    });
});
