/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.BodaacDataRowHtml', function() {

    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {
        tpl = new Portal.cart.BodaacDataRowHtml();
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                isNcwms: function() {return true},
                getWmsLayerFeatureRequestUrl: function() {},
                getWfsLayerFeatureRequestUrl: function() {},
                wfsLayer: false
            }
        }
    });

    describe('getDataFilterEntry', function() {

        it('returns correct BODAAC filter entry when filter parameters are present', function() {
            geoNetworkRecord.wmsLayer.bodaacFilterParams = {'dateRangeStart': undefined};
            var res = String.format('<b>{0}</b> {1}', OpenLayers.i18n('filterLabel'), OpenLayers.i18n('timeRangeCalculating'));
            expect(tpl.getDataFilterEntry(geoNetworkRecord)).toEqual(res);
        });
    });

    describe('createMenuItems', function() {

        it('create menu items for bodaac layers', function() {
            var menuItems = tpl.createMenuItems(geoNetworkRecord);
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
            expect(menuItems.length).toEqual(2);
            expect(urlListIncluded).toBe(true);
            expect(netCdfDownloadIncluded).toBe(true);
        });
    });

    describe('getDataSpecificMarkup', function() {

        it('generates correct markup for bodaac layers', function() {
            var markup = tpl.getDataSpecificMarkup(geoNetworkRecord);

            expect(markup).not.toEqual('');
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

        it('BODAAC _urlListDownloadHandler calls _wfsDownloadUrl', function() {
            spyOn(tpl, '_wfsDownloadUrl');
            tpl._urlListDownloadHandler(
                {
                    wmsLayer: {
                        grailsLayerId: 1,
                        isNcwms: function() { return true }
                    }
                }
            );
            expect(tpl._wfsDownloadUrl).toHaveBeenCalled();
        });

        it('BODAAC _netCdfDownloadHandler calls _wfsDownloadUrl', function() {
            spyOn(tpl, '_wfsDownloadUrl');
            tpl._netCdfDownloadHandler(
                {
                    wmsLayer: {
                        grailsLayerId: 1,
                        isNcwms: function() { return true }
                    }
                }
            );
            expect(tpl._wfsDownloadUrl).toHaveBeenCalled();
        });
    });

    describe('_wfsDownloadUrl', function() {

        it('calls correct function on layer', function() {

            var spy = jasmine.createSpy();
            var testLayer = {getWfsLayerFeatureRequestUrl: spy};

            tpl._wfsDownloadUrl(testLayer, 'csv');

            expect(testLayer.getWfsLayerFeatureRequestUrl).toHaveBeenCalledWith('csv');
        });
    });
});
