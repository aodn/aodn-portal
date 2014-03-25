/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.WmsDataRowHtml', function() {

    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {
        tpl = new Portal.cart.WmsDataRowHtml();
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            getWfsLayerFeatureRequestUrl: function() {},
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                isNcwms: function() {return false},
                getWmsLayerFeatureRequestUrl: function() {},
                wfsLayer: true
            }
        }
    });

    describe('getDataFilterEntry returns wms specific filter information', function() {

        it('returns text if there is a cql filter applied', function() {
            var mockCql = 'CQL(intersects(0,0,0,0))';
            tpl._cql = function() {
                return mockCql;
            };

            var filterString = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(filterString).not.toEqual('<i>' + OpenLayers.i18n('noFilterLabel') + '</i> <code></code>');
            expect(filterString.indexOf(OpenLayers.i18n('filterLabel'))).toBeGreaterThan(-1);
            expect(filterString.indexOf(mockCql)).toBeGreaterThan(-1);
        });

        it('returns an a no filter message if there is no cql filter applied', function() {
            tpl._cql = function() {
                return ''
            };
            expect(tpl.getDataFilterEntry(geoNetworkRecord)).toEqual('<i>' + OpenLayers.i18n('noFilterLabel') + '</i> <code></code>');
        });
    });

    describe('createMenuItems', function() {

        it('creates menu items if WFS layer is linked', function() {
            var menuItems = tpl.createMenuItems({
                wmsLayer: {
                    getWfsLayerFeatureRequestUrl: noOp,
                    getWmsLayerFeatureRequestUrl: noOp,
                    wfsLayer: {},
                    isNcwms: function() {
                        return false;
                    }
                }
            });

            expect(menuItems.length).toEqual(1);
        });

        it('includes items for download url list and NetCDF download if urlDownloadFieldName exists', function() {
            var menuItems = tpl.createMenuItems({
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
                else if (menuItems[i].text == OpenLayers.i18n('downloadAsNetCdfLabel')) {
                    netCdfDownloadIncluded = true;
                }
            }

            expect(menuItems.length).toEqual(2); // URL List and NetCDF download
            expect(urlListIncluded).toBe(true);
            expect(netCdfDownloadIncluded).toBe(true);
        });

        it('includes all menu items when wfsLayer and urlDownloadFieldName exist', function() {
            var menuItems = tpl.createMenuItems({
                wmsLayer: {
                    getWfsLayerFeatureRequestUrl: noOp,
                    getWmsLayerFeatureRequestUrl: noOp,
                    urlDownloadFieldName: true,
                    wfsLayer: {},
                    isNcwms: function() {
                        return false;
                    }
                }
            });

            expect(menuItems.length).toEqual(3);
        });
    });

    describe('getDataSpecificMarkup', function() {
        var markup;

        beforeEach(function() {
            markup = tpl.getDataSpecificMarkup(geoNetworkRecord);
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
        it('_downloadWfsHandler calls downloadWithConfirmation', function() {
            spyOn(tpl, 'downloadWithConfirmation');
            spyOn(tpl, '_wfsDownloadUrl');
            tpl._downloadWfsHandler({}, 'csv');
            expect(tpl.downloadWithConfirmation).toHaveBeenCalled();
        });

        it('_urlListDownloadHandler calls downloadWithConfirmation', function() {
            spyOn(tpl, 'downloadWithConfirmation');
            spyOn(tpl, '_wmsDownloadUrl').andReturn('download_url');

            var testLayer = {
                grailsLayerId: 6,
                isNcwms: function() { return false }
            };
            var testCollection = {
                wmsLayer: testLayer,
                title: 'the_collection'
            };

            tpl._urlListDownloadHandler(testCollection);

            expect(tpl._wmsDownloadUrl).toHaveBeenCalledWith(testLayer, 'csv');
            expect(tpl.downloadWithConfirmation).toHaveBeenCalledWith(
                'download_url',
                'the_collection_URLs.txt',
                {
                    action: 'urlListForLayer',
                    layerId: 6
                }
            );
        });

        it('_netCdfDownloadHandler calls downloadWithConfirmation', function() {
            spyOn(tpl, 'downloadWithConfirmation');
            spyOn(tpl, '_wmsDownloadUrl').andReturn('download_url');

            var testLayer = {
                grailsLayerId: 6,
                isNcwms: function() { return false }
            };
            var testCollection = {
                wmsLayer: testLayer,
                title: 'the_collection'
            };

            tpl._netCdfDownloadHandler(testCollection);

            expect(tpl._wmsDownloadUrl).toHaveBeenCalledWith(testLayer, 'csv');
            expect(tpl.downloadWithConfirmation).toHaveBeenCalledWith(
                'download_url',
                'the_collection_source_files.zip',
                {
                    action: 'downloadNetCdfFilesForLayer',
                    layerId: 6
                }
            );
        });
    });

    describe('_wfsDownloadUrl', function() {

        it('calls correct function on layer', function() {

            var spy = jasmine.createSpy();
            var testLayer = {getWfsLayerFeatureRequestUrl: spy, params: "blagh"};

            tpl._wfsDownloadUrl(testLayer, 'csv');

            expect(testLayer.getWfsLayerFeatureRequestUrl).toHaveBeenCalledWith('csv');
        });
    });

    describe('_wmsDownloadUrl', function() {

        it('calls correct function on layer', function() {

            var spy = jasmine.createSpy();
            var testLayer = {getWmsLayerFeatureRequestUrl: spy, params: "blagh"};

            tpl._wmsDownloadUrl(testLayer, 'xml');

            expect(testLayer.getWmsLayerFeatureRequestUrl).toHaveBeenCalledWith('xml');
        });
    });
});
