describe('Portal.cart.DownloadPanelItemTemplate', function () {

    var html;
    var tpl;
    var  mockDataInjection;
    var dataCollectionStore;

    beforeEach(function() {
        dataCollectionStore = {};

        tpl = new Portal.cart.DownloadPanelItemTemplate({
            dataCollectionStore: dataCollectionStore
        });

        Portal.app.appConfig.grails = {serverURL: "munt"};

        mockDataInjection = {
            getUuid: returns(42),
            title: 'AODN Contributors idea of a concise title to best describe a dataset: This is the title that is simply too long to fit into the available space even when we allow contributors to use 2 lines to fit this super long title in',
            pointOfTruthLink: [
                {
                    href: 'point of truth url'
                }
            ],
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
            menuItems: {},
            intersect: true
        };

        spyOn(window, 'trackDataCollectionSelectionUsage');
    });

    describe('apply', function() {

        beforeEach(function() {

            spyOn(tpl, '_getHtmlTitle');
            spyOn(tpl, '_createDownloadButtonAfterPageLoad');
            spyOn(tpl, '_createRemoveButtonAfterPageLoad');
            spyOn(tpl, '_getDataFilterEntry');
            spyOn(tpl, '_getPointOfTruthLinkEntry');
            spyOn(tpl, '_getFileListEntries');
            spyOn(tpl, '_createShareButtonAfterPageLoad');
            spyOn(tpl, '_getUserMsg');
            tpl.apply(mockDataInjection);
        });

        it('creates a title for the record', function() {
            expect(tpl._getHtmlTitle).toHaveBeenCalled();
        });

        it('creates a download button', function() {
            expect(tpl._createDownloadButtonAfterPageLoad).toHaveBeenCalled();
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

        it('creates share button markup', function() {
            expect(tpl._createShareButtonAfterPageLoad).toHaveBeenCalled();
        });
    });

    describe('getRecordTitle', function() {

        it('returns the correct record title', function() {

            html = tpl._getHtmlTitle(mockDataInjection);
            expect(html).toBe('<h3 title=\"AODN Contributors idea of a concise title to best describe a dataset: This is the title that is simply too long to fit into the available space even when we allow contributors to use 2 lines to fit this super long title in\">AODN Contributors idea of a concise title to best describe a dataset: This is the title that is simply too long to fit into the available space even when we allow contributors...</h3>');
        });
    });

    describe('getDataFilterEntry', function() {

        it('returns the correct data filter entry', function() {

            html = tpl._getDataFilterEntry(mockDataInjection);
            expect(html).toContain('Filters');
        });
    });

    describe('_getPointOfTruthLinkEntry', function () {

        it('returns the entry markup', function () {

            spyOn(tpl, '_makeExternalLinkMarkup').andReturn('link markup');
            html = tpl._getPointOfTruthLinkEntry(mockDataInjection);
            expect(html).toBe('link markup');
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
            tpl._createDownloadButtonAfterPageLoad(mockDataInjection);
            expect(tpl._createDownloadButton.defer).toHaveBeenCalled();
            expect(tpl._createDownloadingLabel.defer).not.toHaveBeenCalled();
        };

        var expectDownloadingLabel = function(status) {
            mockDataInjection.downloadStatus = status;
            tpl._createDownloadButtonAfterPageLoad(mockDataInjection);
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
            var buttonId = tpl._getLinkId(mockDataInjection,"removeButtonId");
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
                linkedFiles: [
                    {href: href, title: text}
                ]
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
                pointOfTruthLink: [
                    {
                        href: "http://geonetwork"
                    }
                ]
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

    describe('_removeButtonOnClick', function() {
        var testRecord;

        beforeEach(function() {
            testRecord = {
                getTitle: returns('Argo Profiles')
            };

            spyOn(tpl, 'getIdFromButtonContainerId').andReturn('1234');
            dataCollectionStore.getByUuid = jasmine.createSpy('getByUuid').andReturn(testRecord);
            dataCollectionStore.remove = jasmine.createSpy('remove');

            tpl._removeLinkOnClick();
        });

        it('removes record from store with uuid', function() {
            expect(dataCollectionStore.getByUuid).toHaveBeenCalledWith('1234');
            expect(dataCollectionStore.remove).toHaveBeenCalledWith(testRecord);
        });

        it('tracks action to Google Analytics', function() {
            expect(window.trackDataCollectionSelectionUsage).toHaveBeenCalledWith('dataCollectionRemovalTrackingAction', 'Argo Profiles');
        });
    });
});
