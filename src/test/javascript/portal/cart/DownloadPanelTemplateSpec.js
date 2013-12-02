/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.cart.DownloadPanelTemplate', function () {

    var html;
    var tpl;
    var geoNetworkRecord;

    beforeEach(function () {

        tpl = new Portal.cart.DownloadPanelTemplate();
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
            ]
        };
    });

    describe('_getPointOfTruthLinkEntry', function () {

        var html;

        beforeEach(function () {

            spyOn(tpl, '_makeExternalLinkMarkup').andReturn('link markup');
            spyOn(tpl, '_makeEntryMarkup').andReturn('entry markup');

            html = tpl._getPointOfTruthLinkEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function () {
            expect(html).toBe('link markup');
        });

    });

    describe('_getFileListEntries', function () {

        beforeEach(function () {

            spyOn(tpl, '_getSingleFileEntry').andReturn('[single file markup]');
            spyOn(tpl, '_makeEntryMarkup').andReturn('entry markup');
            spyOn(tpl, '_makeSecondaryTextMarkup').andReturn('secondary text markup');
        });

        it('calls _getSingleFileEntry for each link', function () {

            tpl._getFileListEntries(geoNetworkRecord);

            expect(tpl._getSingleFileEntry.callCount).toBe(2);
            expect(tpl._getSingleFileEntry.argsForCall[0][0]).toBe(geoNetworkRecord.downloadableLinks[0]);
            expect(tpl._getSingleFileEntry.argsForCall[1][0]).toBe(geoNetworkRecord.downloadableLinks[1]);
        });

        it('returns markup for each link', function () {

            var html = tpl._getFileListEntries(geoNetworkRecord);

            expect(html).toBe('[single file markup][single file markup]');
        });

        it('does not call _singleFileEntry when no links', function () {

            geoNetworkRecord.downloadableLinks = [];

            tpl._getFileListEntries(geoNetworkRecord);

            expect(tpl._getSingleFileEntry).not.toHaveBeenCalled();
        });

        it('returns single entry markup when no links', function () {

            geoNetworkRecord.downloadableLinks = [];

            var html = tpl._getFileListEntries(geoNetworkRecord);

            expect(tpl._makeSecondaryTextMarkup).toHaveBeenCalledWith('No attached files.');
            expect(html).toBe('secondary text markup');
        });

        afterEach(function () {

            tpl._getSingleFileEntry.reset();
            tpl._makeEntryMarkup.reset();
        });
    });

    describe('_getSingleFileEntry', function () {

        var html;

        beforeEach(function () {

            spyOn(tpl, '_makeExternalLinkMarkup').andReturn('link markup');
            spyOn(tpl, '_makeEntryMarkup').andReturn('entry markup');

            var link = geoNetworkRecord.downloadableLinks[0];

            html = tpl._getSingleFileEntry(link);
        });

        it('returns the entry markup', function () {

            expect(html).toBe('link markup');
        });

        it('calls _makeExternalLinkMarkup', function () {

            expect(tpl._makeExternalLinkMarkup).toHaveBeenCalledWith('http://host/some.html', 'the title one');
        });
    });

    describe('_makeEntryMarkup', function () {

        it('wraps the text in a span', function () {

            var html = tpl._makeSecondaryTextMarkup('text');

            expect(html).toBe('<span class="secondary-text">text</span>');
        });
    });

    describe('_makeExternalLinkMarkup', function () {

        it('wraps the text in an anchor tag', function () {

            var html = tpl._makeExternalLinkMarkup('http://host.com/', 'text');

            expect(html).toBe('<a href="http://host.com/" target="_blank" class="external">text</a>');
        });

        it('uses href as text if text is undefined', function () {

            var html = tpl._makeExternalLinkMarkup('http://host.com/');

            expect(html).toBe('<a href="http://host.com/" target="_blank" class="external">http://host.com/</a>');
        });
    });

    describe('template output', function () {

        var rootElement;

        beforeEach(function () {

            tpl._getPointOfTruthLinkEntry = function () {
                return "point_of_truth"
            };
            tpl._dataRowTemplate = function () {
                return "<div>data_row_template</div>"
            };
            tpl._getFileListEntries = function () {
                return "file_list"
            };

            var html = tpl.apply(geoNetworkRecord);
            rootElement = $(html);
        });

        describe('root element', function () {

            it('has correct class', function () {

                expect(rootElement.attr('class')).toBe('downloadPanelResultsWrapper');
            });

            it('has correct number of children', function () {

                expect(rootElement.children().length).toBe(2);
            });
        });

        describe('title row', function () {

            var titleRow;

            beforeEach(function () {

                titleRow = $(rootElement.children()[0]);
            });

            it('has the correct class', function () {

                expect(titleRow.attr('class')).toBe('x-panel-header resultsHeaderBackground');
            });

            it('has the correct text value from function', function () {

                var trimmedText = $.trim(titleRow.text());

                expect(trimmedText).toBe('the title');
            });
        });

        describe('template output when no attached files', function () {

            var rootElement;
            var html;

            beforeEach(function () {

                tpl._getPointOfTruthLinkEntry = function () {
                    return "point_of_truth"
                };
                tpl._dataRowTemplate = function () {
                    return "<div>data_row_template</div>"
                };
                tpl._getFileListEntries = function () {
                    return "file_list"
                };

                geoNetworkRecord.downloadableLinks = [];

                html = tpl.apply(geoNetworkRecord);
                rootElement = $(html);
            });

            describe('root element', function () {

                it('has correct number of children', function () {

                    expect(rootElement.children().length).toBe(2);
                });
            });

            describe('files row', function () {

                it('should not be present when there are no links', function () {

                    expect(html.indexOf('file_list')).toBe(-1);
                });
            });
        });

        /* start new specs from aodaac and wfs template tests */

        describe('_getDataFilterEntry', function () {

            beforeEach(function () {
                spyOn(tpl, '_makeEntryMarkup').andReturn('entry markup');

            });

            it('returns the entry markup', function () {

                var html = tpl._getDataFilterEntry(geoNetworkRecord);

                expect(html).toBe('');
            });

            it('returns empty string when no aodaac parameters', function () {

                geoNetworkRecord.aodaac = null;

                var html = tpl._getDataFilterEntry(geoNetworkRecord);

                expect(html).toBe('');
                expect(tpl._makeEntryMarkup).not.toHaveBeenCalled();
            });

            afterEach(function () {

                tpl._makeEntryMarkup.reset();
            });
        });

        describe('_adoaacParameterMarkup', function () {

            var markup;
            var params;

            beforeEach(function () {

                spyOn(String, 'format');
                params = {
                    latitudeRangeStart: -90,
                    latitudeRangeEnd: 90,
                    longitudeRangeStart: -180,
                    longitudeRangeEnd: 180,
                    dateRangeStart: '1/1/1900',
                    dateRangeEnd: '31/12/2001'
                };

                markup = tpl._aodaacParametersMarkup(params);
            });

            it('returns parameter list markup', function () {

                expect(String.format).toHaveBeenCalledWith('{0}<b>S</b>,&nbsp;{1}<b>W</b>', 90, -180)
                expect(String.format).toHaveBeenCalledWith('<b>{0}:</b> &nbsp;<code>{1}</code> <code>{2}</code><br>', 'Date range', '1/1/1900', '31/12/2001')
            });

        });

        describe('_parameterString', function () {

            beforeEach(function () {

                spyOn(OpenLayers, 'i18n').andReturn('i18n value');
                spyOn(String, 'format');

                tpl._parameterString('the_key', 'val1', 'val2');
            });

            it('calls OpenLayers.i18n()', function () {

                expect(OpenLayers.i18n).toHaveBeenCalledWith('the_key');
            });

            it('calls String.format()', function () {

                expect(String.format).toHaveBeenCalledWith('<b>{0}:</b> &nbsp;<code>{1}</code> <code>{2}</code><br>', 'i18n value', 'val1', 'val2')
            });
        });

        describe('_createDownloadButton', function () {

            var mockMenu = {};
            var mockMenuItems = {};
            var mockButton = {};
            var mockCollection = {};
            var mockElement = {};
            var renderElement = '';

            beforeEach(function () {

                spyOn(tpl, '_createMenuItems').andReturn(mockMenuItems);
                spyOn(Ext.menu, 'Menu').andReturn(mockMenu);
                spyOn(Ext, 'Button').andReturn(mockButton);
                spyOn(tpl, '_emailTextFieldElement').andReturn(mockElement);
                mockButton.render = jasmine.createSpy('button render');
                mockElement.on = jasmine.createSpy();
                renderElement = "html";

                tpl._createDownloadButton(renderElement, mockCollection);
            });

            it('calls _createMenuItems', function () {

                expect(tpl._createMenuItems).toHaveBeenCalledWith(mockCollection);
            });

            it('create a new Menu', function () {

                expect(Ext.menu.Menu).toHaveBeenCalledWith({items: mockMenuItems})
            });

            it('calls _emailTextFieldElement', function () {
                expect(tpl._emailTextFieldElement).toHaveBeenCalled();
            });

            it('calls _emailTextFieldElement to attach events to', function () {
                expect(mockElement.on).toHaveBeenCalled();
            });
        });

        describe('_downloadAodaacHandler', function () {

            it('returns a function to be called', function () {

                var collection = { uuid: 5, aodaac: true };
                var returnValue = tpl._downloadAodaacHandler(collection);

                expect(typeof returnValue).toBe('function');
            });
        });
        describe('_downloadWfsHandler', function () {

            it('returns a function to be called', function () {
                var wmsLayer = {
                    getDownloadFilter: function () {
                        return "cql_filter"
                    }
                }
                wmsLayer.getWfsLayerFeatureRequestUrl = function () {}

                var collection = {
                    uuid: 5,
                    wmsLayer: wmsLayer
                };
                var returnValue = tpl._downloadWfsHandler(collection);

                expect(typeof returnValue).toBe('function');
            });
        });

        describe('_aodaacUrl', function () {

            it('builds URL with correct query string', function () {

                var params = {
                    productId: 89,
                    latitudeRangeStart: -90,
                    latitudeRangeEnd: 90,
                    longitudeRangeStart: -180,
                    longitudeRangeEnd: 180,
                    dateRangeStart: '1/1/1900',
                    dateRangeEnd: '31/12/2001'
                };

                var url = tpl._aodaacUrl(params, 'format', 'emailAddress');

                expect(url).toBe('aodaac/createJob?' +
                    'outputFormat=format' +
                    '&dateRangeStart=1/1/1900' +
                    '&dateRangeEnd=31/12/2001' +
                    '&timeOfDayRangeStart=0000' +
                    '&timeOfDayRangeEnd=2400' +
                    '&latitudeRangeStart=-90' +
                    '&latitudeRangeEnd=90' +
                    '&longitudeRangeStart=-180' +
                    '&longitudeRangeEnd=180' +
                    '&productId=89' +
                    '&notificationEmailAddress=emailAddress'
                );
            });
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

        describe('_createMenuItems', function () {

            it('returns no menu items', function () {

                var theCollection = {wmsLayer: geoNetworkRecord};
                var items = tpl._createMenuItems(theCollection);

                expect(items.length).toBe(0);

            });

            it('returns array of menu items with one more when a downloadUrlFieldName is specified on the layer', function () {
                spyOn(tpl, '_downloadWfsHandler');
                spyOn(tpl, '_urlListDownloadHandler');

                var theCollection = { wmsLayer: { urlDownloadFieldName: 'the field', wfsLayer: {}} };
                theCollection.wmsLayer.getWfsLayerFeatureRequestUrl = function () {}
                tpl._urlListDownloadHandler = function () {}
                var items = tpl._createMenuItems(theCollection);
                var numSpecialItems = 1; // List of URLs

                expect(items.length).not.toBe(0);

                Ext.each(items, function (item) {

                    expect(item.text).toBeDefined();
                    expect(typeof item.text === 'string').toBeTruthy();
                });

                expect(tpl._downloadWfsHandler.callCount).toBe(items.length - numSpecialItems);
            });
        });


        describe('_urlListDownloadHandler', function() {

            beforeEach(function() {
                spyOn(tpl, '_wfsUrlForGeoNetworkRecordWmsLayer');
                geoNetworkRecord.wmsLayer = { urlDownloadFieldName: 'the field', wfsLayer: {} };
                geoNetworkRecord.wmsLayer.getWfsLayerFeatureRequestUrl = function () {}
                geoNetworkRecord.wmsLayer.getWmsLayerFeatureRequestUrl = function () {}
            });

            it('calls _wfsUrlForGeoNetworkRecordWmsLayer', function() {

                tpl._urlListDownloadHandler(geoNetworkRecord);

                expect(tpl._wfsUrlForGeoNetworkRecordWmsLayer).toHaveBeenCalledWith(geoNetworkRecord, 'csv');
            });

            it('returns a function to be called', function() {

                var returnValue = tpl._urlListDownloadHandler(geoNetworkRecord);

                expect(typeof returnValue).toBe('function');
            });
        });

    });

    function getText(element) {

        // Based on http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery

        var text = $(element)
            .contents()
            .filter(function () {
                return this.nodeType === Node.TEXT_NODE;
            }).text();

        var elements = text.split(" ").filter(function (val) {
            return val.length
        });

        return (elements.length == 1) ? elements[0] : elements;
    }
});


