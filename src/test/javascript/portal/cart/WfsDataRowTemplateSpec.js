/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.WfsDataRowTemplate', function() {

    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {
        tpl = new Portal.cart.WfsDataRowTemplate();
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                }
            }
        };
        geoNetworkRecord.getWfsLayerFeatureRequestUrl = function() {};
    });

    describe('getDataFilterEntry', function() {
        it('returns text if there is a cql filter applied', function() {
            var mockCql = 'CQL(intersects(0,0,0,0))';
            tpl._cql = function() {
                return mockCql;
            };

            var filterEntry = tpl.getDataFilterEntry({});
            expect(filterEntry).not.toEqual('<i>No filters applied.</i> <code></code>');
            expect(filterEntry.indexOf(OpenLayers.i18n('filterLabel'))).toBeGreaterThan(-1);
            expect(filterEntry.indexOf(mockCql)).toBeGreaterThan(-1);
        });

        it('returns an a no filter message if there is no cql filter applied', function() {
            tpl._cql = function() {
                return ''
            };
            expect(tpl.getDataFilterEntry({})).toEqual('<i>No filters applied.</i> <code></code>');
        });
    });

    describe('createMenuItems', function() {
        it('creates menu items', function() {
            var menuItems = tpl.createMenuItems({
                wmsLayer: {
                    getWfsLayerFeatureRequestUrl: noOp
                }
            });
            expect(menuItems.length).toEqual(3);
        });

        it('includes items for download url list and NetCDF download', function() {
            var menuItems = tpl.createMenuItems({
                wmsLayer: {
                    getWfsLayerFeatureRequestUrl: noOp,
                    urlDownloadFieldName: true
                }
            });
            expect(menuItems.length).toEqual(5);

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

            expect(urlListIncluded).toBe(true);
            expect(netCdfDownloadIncluded).toBe(true);
        });
    });

    describe('download handlers', function() {
        it('_downloadWfsHandler calls downloadWithConfirmation', function() {
            spyOn(tpl, 'downloadWithConfirmation');
            spyOn(tpl, '_downloadUrl');
            tpl._downloadWfsHandler({}, 'csv');
            expect(tpl.downloadWithConfirmation).toHaveBeenCalled();
        });

        it('_urlListDownloadHandler calls downloadWithConfirmation', function() {
            spyOn(tpl, 'downloadWithConfirmation');
            spyOn(tpl, '_downloadUrl').andReturn('download_url');

            var testLayer = {grailsLayerId: 6};
            var testCollection = {
                wmsLayer: testLayer,
                title: 'the_collection'
            };

            tpl._urlListDownloadHandler(testCollection);

            expect(tpl._downloadUrl).toHaveBeenCalledWith(testLayer, 'csv');
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
            spyOn(tpl, '_downloadUrl').andReturn('download_url');

            var testLayer = {grailsLayerId: 6};
            var testCollection = {
                wmsLayer: testLayer,
                title: 'the_collection'
            };

            tpl._netCdfDownloadHandler(testCollection);

            expect(tpl._downloadUrl).toHaveBeenCalledWith(testLayer, 'csv');
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

    describe('download size estimate', function() {
        var mockEstimate;
        it('getDataSpecificMarkup calls _getDownloadEstimate', function() {
            spyOn(tpl, '_getDownloadEstimate');
            tpl.getDataSpecificMarkup({});
            expect(tpl._getDownloadEstimate).toHaveBeenCalled();
        });

        it('_generateEstHtmlString formats correctly when size is greater than 1024', function() {
            mockEstimate = 1100;
            var mockHtml = tpl._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated download size is  1.1GB <img src="images/clock_red.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is greater than 512 and less than 1024', function() {
            mockEstimate = 600;
            var mockHtml = tpl._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated download size is  600MB <img src="images/clock_red.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is less than 512', function() {
            mockEstimate = 400;
            var mockHtml = tpl._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated download size is  400MB </div><div class="clear"></div>');
        });
    });
});
