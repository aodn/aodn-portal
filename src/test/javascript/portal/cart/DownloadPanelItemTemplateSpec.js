/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.cart.DownloadPanelItemTemplate', function () {

    var html;
    var tpl;
    var mockDataInjection;

    beforeEach(function() {

        tpl = new Portal.cart.DownloadPanelItemTemplate();

        Portal.app.appConfig.grails = {serverURL: "munt"};

        mockDataInjection = {
            uuid: '42',
            title: 'the title',
            pointOfTruthLink: {
                href: 'point of truth url'
            },
            dataMarkup: 'markup!',
            dataFilters: 'Filters!',
            linkedFiles: [
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
            menuItems: {}
        };
    });

    describe('_createRemoveButtonAfterPageLoad', function() {
        it('returns empty string', function() {
            spyOn(tpl, '_createRemoveButton');
            expect(tpl._createRemoveButtonAfterPageLoad()).toEqual('');
        });
    });

    describe('apply', function() {

        beforeEach(function() {

            spyOn(tpl, '_getRecordTitle');
            spyOn(tpl, '_downloadButton');
            spyOn(tpl, '_createRemoveButtonAfterPageLoad');
            spyOn(tpl, '_getDataFilterEntry');
            spyOn(tpl, '_getPointOfTruthLinkEntry');
            spyOn(tpl, '_getFileListEntries');
            spyOn(tpl, '_dataSpecificMarkup');
            spyOn(tpl, '_shareButtonMarkup');
            tpl.apply(mockDataInjection);
        });

        it('creates a title for the record', function() {
            expect(tpl._getRecordTitle).toHaveBeenCalled();
        });

        it('creates a download button', function() {
            expect(tpl._downloadButton).toHaveBeenCalled();
        });

        it('creates a remove button', function() {
            expect(tpl._createRemoveButtonAfterPageLoad).toHaveBeenCalled();
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

        it('creates share button markup', function() {
            expect(tpl._shareButtonMarkup).toHaveBeenCalled();
        });
    });

    describe('getRecordTitle', function() {

        it('returns the correct record title', function() {

            html = tpl._getRecordTitle(mockDataInjection);
            expect(html).toBe('the title');
        });
    });

    describe('getDataFilterEntry', function() {

        it('returns the correct data filter entry', function() {

            html = tpl._getDataFilterEntry(mockDataInjection);
            expect(html).toBe('<i>Filters!</i>');
        });
    });

    describe('_getPointOfTruthLinkEntry', function () {

        it('returns the entry markup', function () {

            spyOn(tpl, '_makeExternalLinkMarkup').andReturn('link markup');
            html = tpl._getPointOfTruthLinkEntry(mockDataInjection);
            expect(html).toBe('link markup');
        });
    });

    describe('dataSpecificMarkup', function() {

        it('returns the correct data markup for the collection', function() {

            html = tpl._dataSpecificMarkup(mockDataInjection);
            expect(html).toBe('markup!');
        });
    });

    describe('create download button', function() {

        beforeEach(function() {
            spyOn(Ext, 'get').andReturn({});
            spyOn(Ext, 'fly').andReturn({update: noOp});
            spyOn(Ext.menu, 'Menu');
            spyOn(Ext, 'Button');
        });

        it('should not create a button if the array is empty', function() {

            tpl._createDownloadButton(mockDataInjection);
            expect(Ext.Button).not.toHaveBeenCalled();
        });

        it('should create a download button if necessary', function() {

            mockDataInjection.menuItems = ['menu item 1'];

            tpl._createDownloadButton(mockDataInjection);
            expect(Ext.Button).toHaveBeenCalled();
        });
    });

    describe('download button', function() {

        beforeEach(function() {
            spyOn(tpl._createDownloadButton, 'defer');
            spyOn(tpl._createDownloadingLabel, 'defer');
        });

        it('creates download pop menu button if no download requested', function() {
            expectDownloadButton(null);
        });

        it('creates download pop menu button if download started', function() {
            expectDownloadButton('started');
        });

        it('creates download pop menu button if download failed', function() {
            expectDownloadButton('failed');
        });

        it('creates downloading label if download requested', function() {
            expectDownloadingLabel('requested');
        });

        var expectDownloadButton = function(status) {
            mockDataInjection.downloadStatus = status;
            tpl._downloadButton(mockDataInjection);
            expect(tpl._createDownloadButton.defer).toHaveBeenCalled();
            expect(tpl._createDownloadingLabel.defer).not.toHaveBeenCalled();
        };

        var expectDownloadingLabel = function(status) {
            mockDataInjection.downloadStatus = status
            tpl._downloadButton(mockDataInjection);
            expect(tpl._createDownloadButton.defer).not.toHaveBeenCalled();
            expect(tpl._createDownloadingLabel.defer).toHaveBeenCalled();
        }
    });

    describe('_createDownloadingLabel', function() {
        it('creates disabled button with msg', function() {
            spyOn(Ext, 'Button');
            spyOn(Ext, 'fly').andReturn({update: noOp});

            tpl._createDownloadingLabel(mockDataInjection);
            expect(Ext.Button).toHaveBeenCalled();
        });
    });

    describe('get id', function() {
        it('from button Container Id', function() {
            var buttonId = tpl._getButtonId(mockDataInjection,"removeButtonId");
            expect(buttonId).not.toBeNull();
            expect(typeof buttonId).toEqual('string');
        });
    });

    describe('file list entries', function() {
        var href = 'http://123.aodn.org.au';
        var text = 'portal';

        describe('make external link markup', function() {
            it('launches the link in a new window', function() {
                expect(tpl._makeExternalLinkMarkup(href, text)).toContain('_blank');
            });

            it('displays the text when provided', function() {
                expect(tpl._makeExternalLinkMarkup(href, text)).toContain(text);
            });

            it('displays the full link when text is not provided', function() {
                expect(tpl._makeExternalLinkMarkup(href).match(/http:\/\/123\.aodn\.org\.au/g).length).toBe(2);
            });
        });

        it('returns nothing when there are no links', function() {
            expect(tpl._getFileListEntries({})).toBe("");
        });

        it('creates links', function() {
            var values = {
                linkedFiles: [{ href: href, title: text }]
            };
            var html = tpl._getFileListEntries(values);

            expect(html).toContain(href);
            expect(html).toContain(text);
        });
    });

    describe('_getPointOfTruthLinkEntry', function() {
        var values;

        beforeEach(function() {
            values = {
                title: "Rottnest ...QC'd (is bad for embedding in a function)",
                pointOfTruthLink: {
                    href: "http://geonetwork"
                }
            };
        });

        it('creates valid link from problematic title', function() {
            var res = tpl._getPointOfTruthLinkEntry(values);
            expect(res).toContain('http://geonetwork');
            expect(res).toContain("trackUsage('Metadata','Download','Rottnest ...QCd is bad for embedding in a function');return true;");
        });

        it('creates valid link for non-problematic title', function() {
            values.title = "Argo Profiles";

            var res = tpl._getPointOfTruthLinkEntry(values);
            expect(res).toContain('http://geonetwork');
            expect(res).toContain("trackUsage('Metadata','Download','Argo Profiles');return true;");
        });
    });
});
