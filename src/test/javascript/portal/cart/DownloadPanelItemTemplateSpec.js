/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.cart.DownloadPanelItemTemplate', function () {

    var html;
    var tpl;
    var geoNetworkRecord;

    beforeEach(function () {

        tpl = new Portal.cart.DownloadPanelItemTemplate();
        geoNetworkRecord = {
            title: 'the title',
            pointOfTruthLink: {
                href: 'point of truth url'
            },
            downloadableLinks: [
                {
                    href: 'http://host/some.html',
                    name: 'imos:radar_stations',
                    title: 'the title one'
                },
                {
                    href: 'http://host/2.html',
                    name: 'imos:argo_floats',
                    title: 'the title too'
                }
            ],
            wmsLayer: {isNcwms: function() {return false}}
        };
    });

    describe('apply', function() {

        beforeEach(function() {
            spyOn(tpl, '_downloadButton');
            spyOn(tpl, '_getDataFilterEntry');
            spyOn(tpl, '_getPointOfTruthLinkEntry');
            spyOn(tpl, '_getFileListEntries');
            spyOn(tpl, '_dataSpecificMarkup');
            tpl.apply(geoNetworkRecord);
        });

        it('creates a download button', function() {
            expect(tpl._downloadButton).toHaveBeenCalled();
        });

        it('creates a data filter entry', function() {
            expect(tpl._getDataFilterEntry).toHaveBeenCalled();
        });

        it('creates a point of truth link entry', function() {
            expect(tpl._getPointOfTruthLinkEntry).toHaveBeenCalled();
        });

        it('creates a file list entry', function() {
            expect(tpl._getFileListEntries).toHaveBeenCalled();
        });

        it('creates data specific markup', function() {
            expect(tpl._dataSpecificMarkup).toHaveBeenCalled();
        });
    });

    describe('get data filter entry', function() {

        beforeEach(function() {
            setupDataRowTemplatePrototypeSpies('getDataFilterEntry');
        });

        it('delegates to the no data row implementation', function() {
            tpl._getDataFilterEntry(geoNetworkRecord);
            expect(Portal.cart.NoDataRowHtml.prototype.getDataFilterEntry).toHaveBeenCalled();
        });

        it('delegates to the wms data row implementation', function() {
            tpl._getDataFilterEntry(getWfsRecord());
            expect(Portal.cart.WmsDataRowHtml.prototype.getDataFilterEntry).toHaveBeenCalled();
        });

        it('delegates to the gogoduck data row implementation', function() {
            tpl._getDataFilterEntry(getNcwmsRecord());
            expect(Portal.cart.NcwmsDataRowHtml.prototype.getDataFilterEntry).toHaveBeenCalled();
        });
    });

    describe('_getPointOfTruthLinkEntry', function () {

        var html;

        beforeEach(function () {
            spyOn(tpl, '_makeExternalLinkMarkup').andReturn('link markup');
            html = tpl._getPointOfTruthLinkEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function () {
            expect(html).toBe('link markup');
        });

    });

    describe('data specific markup', function() {
        beforeEach(function() {
            setupDataRowTemplatePrototypeSpies('getDataSpecificMarkup');
        });

        it('delegates to the no data row implementation', function() {
            tpl._dataSpecificMarkup(geoNetworkRecord);
            expect(Portal.cart.NoDataRowHtml.prototype.getDataSpecificMarkup).toHaveBeenCalled();
        });

        it('delegates to the wms data row implementation', function() {
            tpl._dataSpecificMarkup(getWfsRecord());
            expect(Portal.cart.WmsDataRowHtml.prototype.getDataSpecificMarkup).toHaveBeenCalled();
        });

        it('delegates to the gogoduck data row implementation', function() {
            tpl._dataSpecificMarkup(getNcwmsRecord());
            expect(Portal.cart.NcwmsDataRowHtml.prototype.getDataSpecificMarkup).toHaveBeenCalled();
        });
    });

    describe('create download button', function() {
        beforeEach(function() {
            setupDataRowTemplatePrototypeSpies('createMenuItems');
            setupDataRowTemplatePrototypeSpies('attachMenuEvents');
        });

        it('does not create the button when no data is available', function() {
            tpl._createDownloadButton(null, geoNetworkRecord);
            expect(Portal.cart.NoDataRowHtml.prototype.createMenuItems).not.toHaveBeenCalled();
            expect(Portal.cart.NoDataRowHtml.prototype.attachMenuEvents).not.toHaveBeenCalled();
        });

        it('delegates to the wfs data row implementation', function() {
            tpl._createDownloadButton(null, getWfsRecord());
            expect(Portal.cart.WmsDataRowHtml.prototype.createMenuItems).toHaveBeenCalled();
            expect(Portal.cart.WmsDataRowHtml.prototype.attachMenuEvents).toHaveBeenCalled();
        });

        it('delegates to the gogoduck data row implementation', function() {
            tpl._createDownloadButton(null, getNcwmsRecord());
            expect(Portal.cart.NcwmsDataRowHtml.prototype.createMenuItems).toHaveBeenCalled();
            expect(Portal.cart.NcwmsDataRowHtml.prototype.attachMenuEvents).toHaveBeenCalled();
        });

        it('delegates to the wfs data row implementation for URL list download', function() {
            tpl._createDownloadButton(null, getUrlDownloadRecord());
            expect(Portal.cart.WmsDataRowHtml.prototype.createMenuItems).toHaveBeenCalled();
            expect(Portal.cart.WmsDataRowHtml.prototype.attachMenuEvents).toHaveBeenCalled();
        });
    });

    describe('file list entries', function() {
        var href = 'http://123.aodn.org.au';
        var text = 'portal';

        describe('make external link markup', function() {
            it('launches the link in a new window', function() {
                expect(tpl._makeExternalLinkMarkup(href, text).indexOf('_blank')).toBeGreaterThan(-1);
            });

            it('displays the text when provided', function() {
                expect(tpl._makeExternalLinkMarkup(href, text).indexOf(text)).toBeGreaterThan(-1);
            });

            it('displays the full link when text is not provided', function() {
                expect(tpl._makeExternalLinkMarkup(href).match(/http:\/\/123\.aodn\.org\.au/g).length).toBe(2);
            });
        });

        it('returns a no files message when there are no links', function() {
            expect(tpl._getFileListEntries({}).indexOf(OpenLayers.i18n('noFilesMessage'))).toBeGreaterThan(-1);
        });

        it('creates links', function() {
            var values = {
                downloadableLinks: [{ href: href, title: text }]
            };
            var html = tpl._getFileListEntries(values);

            expect(html.indexOf(href)).toBeGreaterThan(-1);
            expect(html.indexOf(text)).toBeGreaterThan(-1);
        });
    });

    describe('download confirmation', function() {
        it('delegates to the download panel for confirmation', function() {
            tpl.downloadPanel = {
                confirmDownload: noOp
            };
            spyOn(tpl.downloadPanel, 'confirmDownload');

            tpl.downloadWithConfirmation('', '', {});

            expect(tpl.downloadPanel.confirmDownload).toHaveBeenCalledWith('', '', {});
        });
    });

    describe('_getRowTemplate', function() {

        beforeEach(function() {
            spyOn(tpl, '_getWmsDataRowHtml');
            spyOn(tpl, '_getNcwmsDataRowHtml');
            spyOn(tpl, '_getNoDataRowHtml');
        });

        it('calls for Wms data row html', function() {
            tpl._getRowTemplate(getWfsRecord());

            expect(tpl._getWmsDataRowHtml).toHaveBeenCalled();

            expect(tpl._getNcwmsDataRowHtml).not.toHaveBeenCalled();
            expect(tpl._getNoDataRowHtml).not.toHaveBeenCalled();

            tpl._getRowTemplate(getUrlDownloadRecord());
            expect(tpl._getWmsDataRowHtml.callCount).toBe(2);
        });

        it('calls for gogoduck data row html', function() {
            tpl._getRowTemplate(getNcwmsRecord());

            expect(tpl._getWmsDataRowHtml).not.toHaveBeenCalled();
            expect(tpl._getNcwmsDataRowHtml).toHaveBeenCalled();
            expect(tpl._getNoDataRowHtml).not.toHaveBeenCalled();
        });

        it('calls for no data row html', function() {
            tpl._getRowTemplate({
                wmsLayer: {isNcwms: function() {return false}} // Just the WMS layer
            });

            expect(tpl._getWmsDataRowHtml).not.toHaveBeenCalled();
            expect(tpl._getNcwmsDataRowHtml).not.toHaveBeenCalled();
            expect(tpl._getNoDataRowHtml).toHaveBeenCalled();
        });
    });

    function setupDataRowTemplatePrototypeSpies(method) {
        spyOn(Portal.cart.WmsDataRowHtml.prototype, method);
        spyOn(Portal.cart.NcwmsDataRowHtml.prototype, method);
        spyOn(Portal.cart.NoDataRowHtml.prototype, method);

    }

    function getWfsRecord() {
        geoNetworkRecord.wmsLayer.wfsLayer = {};
        geoNetworkRecord.wmsLayer.isNcwms = function() {return false};

        return geoNetworkRecord;
    }

    function getNcwmsRecord() {
        geoNetworkRecord.wmsLayer.wfsLayer = {};
        geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

        return geoNetworkRecord;
    }

    function getUrlDownloadRecord() {
        geoNetworkRecord.wmsLayer.wfsLayer = {};
        geoNetworkRecord.wmsLayer.urlDownloadFieldName = 'url';
        geoNetworkRecord.wmsLayer.isNcwms = function() {return false};

        return geoNetworkRecord;
    }
});
