/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.WmsInjector', function() {

    var injector;
    var collectionWithFilters = {
        wmsLayer: {
            getHumanReadableFilterDescriptions: function() {
                return ["Human", "readable", "filters"]
            }
        }
    };
    var collectionWithNoFilters = {
        wmsLayer: {
            getHumanReadableFilterDescriptions: function() {
                return "";
            }
        }
    };

    beforeEach(function() {

        injector = new Portal.cart.WmsInjector();
    });

    describe('_getDataFilterEntry', function() {

        it('returns filters text', function() {

            var entry = injector._getDataFilterEntry(collectionWithFilters);

            expect(entry).toBe("Human<br />readable<br />filters");
        });

        it('includes placeholder when no text returned', function() {

            var entry = injector._getDataFilterEntry(collectionWithNoFilters);

            expect(entry).toContain(OpenLayers.i18n('emptyDownloadPlaceholder'));
        });
    });
});
