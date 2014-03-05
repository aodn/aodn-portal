/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.DataRowTemplate', function() {

    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {
        tpl = new Portal.cart.DataRowTemplate();
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            getWfsLayerFeatureRequestUrl: function() {},
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                getWmsLayerFeatureRequestUrl: function() {},
                wfsLayer: true
            }
        }
    });

    describe('getDataFilterEntry', function() {

        it('creates gogoduck specific filter entry if layer is gogoduckable', function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            spyOn(tpl, 'createGogoduckFilterEntry');
            var filterEntry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(tpl.createGogoduckFilterEntry).toHaveBeenCalled();
        });

        it('creates bodaac specific filter entry if layer is bodaacable', function() {
            geoNetworkRecord.wmsLayer.wfsLayer = false;
            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            spyOn(tpl, 'createBodaacFilterEntry');
            var filterEntry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(tpl.createBodaacFilterEntry).toHaveBeenCalled();
        });

        it('creates wms specific filter entry if wms layer', function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return false};

            spyOn(tpl, 'createWmsFilterEntry');
            var filterEntry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(tpl.createWmsFilterEntry).toHaveBeenCalled();
        });
    });

    describe('createBodaacFilterEntry', function() {

        it('returns correct BODAAC filter entry when filter parameters are present', function() {
            geoNetworkRecord.wmsLayer.bodaacFilterParams = {'dateRangeStart': undefined};
            var res = String.format('<b>{0}</b> {1}', OpenLayers.i18n('filterLabel'), OpenLayers.i18n('timeRangeCalculating'));
            expect(tpl.createBodaacFilterEntry(geoNetworkRecord)).toEqual(res);
        });
    });

    describe('createWmsFilterEntry', function() {

        it('returns text if there is a cql filter applied', function() {
            var mockCql = 'CQL(intersects(0,0,0,0))';
            tpl._cql = function() {
                return mockCql;
            };

            var filterString = tpl.createWmsFilterEntry(geoNetworkRecord);
            expect(filterString).not.toEqual('<i>' + OpenLayers.i18n('noFilterLabel') + '</i> <code></code>');
            expect(filterString.indexOf(OpenLayers.i18n('filterLabel'))).toBeGreaterThan(-1);
            expect(filterString.indexOf(mockCql)).toBeGreaterThan(-1);
        });

        it('returns an a no filter message if there is no cql filter applied', function() {
            tpl._cql = function() {
                return ''
            };
            expect(tpl.createWmsFilterEntry(geoNetworkRecord)).toEqual('<i>' + OpenLayers.i18n('noFilterLabel') + '</i> <code></code>');
        });
    });

    describe('createMenuItems', function() {

        it('creates menu items for gogoduck if gogoduckable layer', function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            spyOn(tpl, '_generateGogoduckMenuItems');
            var menu = tpl.createMenuItems(geoNetworkRecord);
            expect(tpl._generateGogoduckMenuItems).toHaveBeenCalled();
        });

        it('creates menu items for bodaac if bodaacable layer', function() {
            geoNetworkRecord.wmsLayer.wfsLayer = false;
            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            spyOn(tpl, '_generateBodaacMenuItems');
            var menu = tpl.createMenuItems(geoNetworkRecord);
            expect(tpl._generateBodaacMenuItems).toHaveBeenCalled();
        });

        it('creates menu items for wms if a wms layer', function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return false};

            spyOn(tpl, '_generateWmsMenuItems');
            var menu = tpl.createMenuItems(geoNetworkRecord);
            expect(tpl._generateWmsMenuItems).toHaveBeenCalled();
        });
    });

    describe('create menu items for gogoduck layers', function() {
        var items;

        beforeEach(function() {
            items = tpl._generateGogoduckMenuItems(geoNetworkRecord);
        });

        it('creates menu items', function() {
            expect(items.length).toBeGreaterThan(0);
        });

        it('allows nc download', function() {
            expect(itemsContains('downloadAsNetCdfLabel')).toBe(true);
        });

        it('allows hdf download', function() {
            expect(itemsContains('downloadAsHdfLabel')).toBe(true);
        });

        it('allows ascii download', function() {
            expect(itemsContains('downloadAsAsciiLabel')).toBe(true);
        });

        it('allows urls download', function() {
            expect(itemsContains('downloadAsOpenDapUrlsLabel')).toBe(true);
        });

        function itemsContains(type) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].text == OpenLayers.i18n(type)) {
                    return true;
                }
            }
            return false;
        }
    });

    describe('create menu items for bodaac layers', function() {
        var menuItems;

        beforeEach(function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return false};
            menuItems = tpl._generateBodaacMenuItems(geoNetworkRecord);
        });

        it('creates appropriate menu items', function() {
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

    describe('create menu items for wms layers', function() {
        it('creates menu items if WFS layer is linked', function() {
            var menuItems = tpl._generateWmsMenuItems({
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
            var menuItems = tpl._generateWmsMenuItems({
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
            var menuItems = tpl._generateWmsMenuItems({
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
        it('generates correct gogoduck markup for gogoduckable layers', function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            spyOn(tpl, 'generateGogoduckSpecificMarkup');
            var menu = tpl.getDataSpecificMarkup(geoNetworkRecord);
            expect(tpl.generateGogoduckSpecificMarkup).toHaveBeenCalled();
        });

        it('generates correct markup for bodaac layers', function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};
            geoNetworkRecord.wmsLayer.wfsLayer = false;

            spyOn(tpl, 'generateWmsSpecificMarkup');
            var menu = tpl.getDataSpecificMarkup(geoNetworkRecord);
            expect(tpl.generateWmsSpecificMarkup).toHaveBeenCalled();
        });

        it('generates correct markup for wms layers', function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return false};

            spyOn(tpl, 'generateWmsSpecificMarkup');
            var menu = tpl.getDataSpecificMarkup(geoNetworkRecord);
            expect(tpl.generateWmsSpecificMarkup).toHaveBeenCalled();
        });
    });

    describe('generateGogoduckSpecificMarkup', function() {
        var markup;

        beforeEach(function() {
            markup = tpl.generateGogoduckSpecificMarkup(geoNetworkRecord);
        });

        it('provides markup', function() {
            expect(markup).not.toEqual('');
        });

        it('contains the blurb', function() {
            expect(markup.indexOf(OpenLayers.i18n('notificationBlurbMessage'))).toBeGreaterThan(-1);
        });

        it('contains an input for an email address', function() {
            expect(markup.indexOf(tpl.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE)).toBeGreaterThan(-1);
        });

        it('contains the email address place holder when there is no email address', function() {
            expect(markup.indexOf(OpenLayers.i18n('emailAddressPlaceholder'))).toBeGreaterThan(-1);
        });

        it('contains the user specified email address', function() {
            spyOn(tpl, '_getEmailAddress').andReturn('gogo@duck.com');
            var _markup = tpl.generateGogoduckSpecificMarkup(geoNetworkRecord);

            expect(tpl._getEmailAddress).toHaveBeenCalled();
            expect(_markup.indexOf('gogo@duck.com')).toBeGreaterThan(-1);
        });
    });

    describe('generateWmsSpecificMarkup', function() {
        var markup;

        beforeEach(function() {
            geoNetworkRecord.wmsLayer.isNcwms = function() {return false};
            markup = tpl.generateWmsSpecificMarkup(geoNetworkRecord);
        });

        it('provides markup', function() {
            expect(markup).not.toEqual('');
        });

        it('contains the download estimator spinner and loading message', function() {
            expect(markup.indexOf(OpenLayers.i18n("estimatedDlLoadingMessage"))).toBeGreaterThan(-1);
            expect(markup.indexOf(OpenLayers.i18n("estimatedDlLoadingSpinner"))).toBeGreaterThan(-1);
        });
    });

    describe('_downloadGogoduckHandler', function() {
        it('provides a function', function() {
            expect(typeof(tpl._downloadGogoduckHandler(geoNetworkRecord, 'nc'))).toEqual('function');
        });
    });

    describe('_gogoduckUrl', function() {

        var url;
        var startDate = new Date(0);
        var endDate = new Date();

        var params = {
            dateRangeStart: startDate,
            dateRangeEnd: endDate,
            latitudeRangeStart: -42,
            latitudeRangeEnd: -20,
            longitudeRangeStart: 160,
            longitudeRangeEnd: 170,
            layerName: "gogoDingo"
        };

        beforeEach(function() {
            url = tpl._gogoduckUrl(params, 'gogo@duck.com');
        });

        it('includes the gogoduck endpoint', function() {
            expect(url.indexOf('gogoduck/createJob?')).toBeGreaterThan(-1);
        });

        it('includes the date range start', function() {
            expect(url.indexOf('gogoDingo')).not.toEqual(-1);
        });

        it('includes the longitude range start', function() {
            expect(url.indexOf('160')).not.toEqual(-1);
        });

        it('includes the longitude range end', function() {
            expect(url.indexOf('170')).not.toEqual(-1);
        });

        it('includes the latitude range start', function() {
            expect(url.indexOf('-42')).not.toEqual(-1);
        });

        it('includes the latitude range end', function() {
            expect(url.indexOf('-20')).not.toEqual(-1);
        });
    });

    describe('email address', function() {

        it('saves an email address', function() {
            var emailInput = new Ext.form.TextField();
            spyOn(tpl, '_emailTextFieldElement').andReturn(emailInput);
            spyOn(tpl, '_saveEmailAddress').andReturn(emailInput);

            tpl.attachMenuEvents(geoNetworkRecord);
            emailInput.fireEvent('change');
            expect(tpl._saveEmailAddress).toHaveBeenCalledWith(geoNetworkRecord.uuid);
        });

        describe('_validateEmailAddress', function () {

            it('returns false for an empty address', function () {
                var returnVal = tpl._validateEmailAddress('');
                expect(returnVal).toBe(false);
            });

            it('returns false for an invalid address', function () {
                var returnVal = tpl._validateEmailAddress('notAnEmailAddress');
                expect(returnVal).toBe(false);
            });

            it('returns true for a valid address', function () {
                var returnVal = tpl._validateEmailAddress('user@domain.com');
                expect(returnVal).toBe(true);
            });
        });
    });

    describe('_parameterString', function () {

        beforeEach(function () {
            spyOn(OpenLayers, 'i18n').andReturn('i18n value');
            spyOn(String, 'format');
            tpl._parameterString('the_key', 'val1', 'val2', "delimiter");
        });

        it('calls OpenLayers.i18n()', function () {
            expect(OpenLayers.i18n).toHaveBeenCalledWith('the_key');
        });

        it('calls String.format()', function () {
            expect(String.format).toHaveBeenCalledWith('<b>{0}:</b> &nbsp;<code>{1}</code> {3} <code>{2}</code><br>', 'i18n value', 'val1', 'val2', "delimiter")
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

    describe('_wmsDownloadUrl', function() {

        it('calls correct function on layer', function() {

            var spy = jasmine.createSpy();
            var testLayer = {getWmsLayerFeatureRequestUrl: spy};

            tpl._wmsDownloadUrl(testLayer, 'xml');

            expect(testLayer.getWmsLayerFeatureRequestUrl).toHaveBeenCalledWith('xml');
        });
    });
});
