/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.WmsInjector', function() {

    var injector;
    var geoNetworkRecord;

    beforeEach(function() {

        injector = new Portal.cart.WmsInjector();

        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            getWfsLayerFeatureRequestUrl: noOp,
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                isNcwms: function() {return false},
                getWmsLayerFeatureRequestUrl: noOp,
                wfsLayer: true
            },
            pointOfTruthLink: 'Link!',
            linkedFiles: 'Downloadable link!'
        }
    });

    describe('constructor', function() {

        it('assigns values from passed in config', function() {
            var callback = noOp;
            var _tpl = new Portal.cart.WmsInjector({ downloadConfirmation: callback, downloadConfirmationScope: this });
            expect(_tpl.downloadConfirmation).toBe(callback);
            expect(_tpl.downloadConfirmationScope).toBe(this);
        });
    });


    describe('createMenuItems', function() {

        it('includes items for download url list and NetCDF download if urlDownloadFieldName exists', function() {
            var menuItems = injector._createMenuItems({
                wmsLayer: {
                    getWfsLayerFeatureRequestUrl: noOp,
                    getWmsLayerFeatureRequestUrl: noOp,
                    urlDownloadFieldName: true,
                    wfsLayer: null,
                    isNcwms: function() {
                        return false;
                    }
                }
            });

            var urlListIncluded = false;
            var netCdfDownloadIncluded = false;
            for (var i = 0; i < menuItems.length; i++) {
                if (menuItems[i].text == OpenLayers.i18n('downloadAsUrlsLabel')) {
                    urlListIncluded = true;
                }
                else if (menuItems[i].text == OpenLayers.i18n('downloadAsAllSourceNetCdfLabel')) {
                    netCdfDownloadIncluded = true;
                }
            }

            expect(menuItems.length).toEqual(2); // URL List and NetCDF download
            expect(urlListIncluded).toBe(true);
            expect(netCdfDownloadIncluded).toBe(true);
        });
    });

    describe('getDataMarkup', function() {

        var markup;

        beforeEach(function() {
            markup = injector._getDataMarkup(geoNetworkRecord);
        });

        it('provides markup', function() {
            expect(markup).not.toEqual('');
        });

        it('contains the download estimator spinner and loading message', function() {
            expect(markup.indexOf(OpenLayers.i18n("estimatedDlLoadingMessage"))).toBeGreaterThan(-1);
            expect(markup.indexOf(OpenLayers.i18n("estimatedDlLoadingSpinner"))).toBeGreaterThan(-1);
        });
    });

    describe('download handlers', function() {

        var downloadParams;
        var collection;

        beforeEach(function() {
            downloadParams = {};
            spyOn(injector, 'downloadWithConfirmation');
            spyOn(injector, '_getUrlListDownloadParams').andReturn(downloadParams);
            spyOn(injector, '_getNetCdfDownloadParams').andReturn(downloadParams);

            collection = {
                wmsLayer: {
                    grailsLayerId: 1,
                    isNcwms: function() { return true }
                }
            };
        });

        it('_urlListDownloadHandler calls downloadWithConfirmation', function() {
            injector._urlListDownloadHandler(collection);

            expect(injector.downloadWithConfirmation).toHaveBeenCalledWith(
                collection,
                injector._downloadUrl,
                downloadParams
            );
        });

        it('_netCdfDownloadHandler calls downloadWithConfirmation', function() {
            injector._netCdfDownloadHandler(collection);

            expect(injector.downloadWithConfirmation).toHaveBeenCalledWith(
                collection,
                injector._downloadUrl,
                downloadParams
            );
        });
    });

    describe('_wmsDownloadUrl', function() {

        it('calls correct function on layer', function() {

            var spy = jasmine.createSpy();
            var testLayer = {getWmsLayerFeatureRequestUrl: spy, params: "blagh"};

            injector._wmsDownloadUrl({ wmsLayer: testLayer }, { format: 'xml' });

            expect(testLayer.getWmsLayerFeatureRequestUrl).toHaveBeenCalledWith('xml');
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
});
