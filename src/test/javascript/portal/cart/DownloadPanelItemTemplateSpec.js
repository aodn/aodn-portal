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
            wmsLayer: {}
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
            expect(Portal.cart.NoDataRowTemplate.prototype.getDataFilterEntry).toHaveBeenCalled();
        });

        it('delegates to the aodaac data row implementation', function() {
            tpl._getDataFilterEntry(getAodaacRecord());
            expect(Portal.cart.AodaacDataRowTemplate.prototype.getDataFilterEntry).toHaveBeenCalled();
        });

        it('delegates to the wfs data row implementation', function() {
            tpl._getDataFilterEntry(getWfsRecord());
            expect(Portal.cart.WfsDataRowTemplate.prototype.getDataFilterEntry).toHaveBeenCalled();
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
            expect(Portal.cart.NoDataRowTemplate.prototype.getDataSpecificMarkup).toHaveBeenCalled();
        });

        it('delegates to the aodaac data row implementation', function() {
            tpl._dataSpecificMarkup(getAodaacRecord());
            expect(Portal.cart.AodaacDataRowTemplate.prototype.getDataSpecificMarkup).toHaveBeenCalled();
        });

        it('delegates to the wfs data row implementation', function() {
            tpl._dataSpecificMarkup(getWfsRecord());
            expect(Portal.cart.WfsDataRowTemplate.prototype.getDataSpecificMarkup).toHaveBeenCalled();
        });
    });

    describe('create download button', function() {
        beforeEach(function() {
            setupDataRowTemplatePrototypeSpies('createMenuItems');
            setupDataRowTemplatePrototypeSpies('attachMenuEvents');
        });

        it('does not create the button when no data is available', function() {
            tpl._createDownloadButton(null, geoNetworkRecord);
            expect(Portal.cart.NoDataRowTemplate.prototype.createMenuItems).not.toHaveBeenCalled();
            expect(Portal.cart.NoDataRowTemplate.prototype.attachMenuEvents).not.toHaveBeenCalled();
        });

        it('delegates to the aodaac data row implementation', function() {
            tpl._createDownloadButton(null, getAodaacRecord());
            expect(Portal.cart.AodaacDataRowTemplate.prototype.createMenuItems).toHaveBeenCalled();
            expect(Portal.cart.AodaacDataRowTemplate.prototype.attachMenuEvents).toHaveBeenCalled();
        });

        it('delegates to the wfs data row implementation', function() {
            tpl._createDownloadButton(null, getWfsRecord());
            expect(Portal.cart.WfsDataRowTemplate.prototype.createMenuItems).toHaveBeenCalled();
            expect(Portal.cart.WfsDataRowTemplate.prototype.attachMenuEvents).toHaveBeenCalled();
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

    function setupDataRowTemplatePrototypeSpies(method) {
        spyOn(Portal.cart.AodaacDataRowTemplate.prototype, method);
        spyOn(Portal.cart.WfsDataRowTemplate.prototype, method);
        spyOn(Portal.cart.NoDataRowTemplate.prototype, method);
    }

    function getAodaacRecord() {
        var aodaacRecord = geoNetworkRecord;
        aodaacRecord.aodaac = {};

        return aodaacRecord;
    }

    function getWfsRecord() {
        var wfsRecord = geoNetworkRecord;
        wfsRecord.wmsLayer.wfsLayer = {};

        return wfsRecord;
    }
});
