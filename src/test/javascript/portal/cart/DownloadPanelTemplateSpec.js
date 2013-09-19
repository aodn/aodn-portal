/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.cart.DownloadPanelTemplate', function() {

    var html;
    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {

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

    describe('_getPointOfTruthLinkEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(tpl, '_makeExternalLinkMarkup').andReturn('link markup');
            spyOn(tpl, '_makeEntryMarkup').andReturn('entry markup');

            html = tpl._getPointOfTruthLinkEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function() {

            expect(html).toBe('entry markup');
        });

        it('calls _makeEntryMarkup', function() {

            expect(tpl._makeEntryMarkup).toHaveBeenCalledWith('link markup');
        });

        it('calls _makeExternalLinkMarkup', function() {

            expect(tpl._makeExternalLinkMarkup).toHaveBeenCalledWith('point of truth url', 'View metadata record');
        });
    });

    describe('_dataRowTemplate', function() {

        var childTemplate;

        beforeEach(function() {

            childTemplate = {};
            childTemplate.apply = jasmine.createSpy('apply');
            spyOn(Portal.cart, 'AodaacDataRowTemplate').andReturn(childTemplate);
            spyOn(Portal.cart, 'WfsDataRowTemplate').andReturn(childTemplate);
        });

        it('uses AodaacDataRowTemplate where applicable', function() {

            geoNetworkRecord.wmsLayer = undefined;
            geoNetworkRecord.aodaac = {};

            tpl._dataRowTemplate(geoNetworkRecord);

            expect(Portal.cart.AodaacDataRowTemplate).toHaveBeenCalledWith(tpl);
            expect(childTemplate.apply).toHaveBeenCalledWith(geoNetworkRecord);
        });

        it('uses WfsDataRowTemplate where applicable', function() {

            geoNetworkRecord.wmsLayer = {};
            geoNetworkRecord.aodaac = undefined;

            tpl._dataRowTemplate(geoNetworkRecord);

            expect(Portal.cart.WfsDataRowTemplate).toHaveBeenCalledWith(tpl);
            expect(childTemplate.apply).toHaveBeenCalledWith(geoNetworkRecord);
        });
    });

    describe('_getFileListEntries', function() {

        beforeEach(function() {

            spyOn(tpl, '_getSingleFileEntry').andReturn('[single file markup]');
            spyOn(tpl, '_makeEntryMarkup').andReturn('entry markup');
        });

        it('calls _getSingleFileEntry for each link', function() {

            tpl._getFileListEntries(geoNetworkRecord);

            expect(tpl._getSingleFileEntry.callCount).toBe(2);
            expect(tpl._getSingleFileEntry.argsForCall[0][0]).toBe(geoNetworkRecord.downloadableLinks[0]);
            expect(tpl._getSingleFileEntry.argsForCall[1][0]).toBe(geoNetworkRecord.downloadableLinks[1]);
        });

        it('returns markup for each link', function() {

            var html = tpl._getFileListEntries(geoNetworkRecord);

            expect(html).toBe('[single file markup][single file markup]');
        });

        it('does not call _singleFileEntry when no links', function() {

            geoNetworkRecord.downloadableLinks = [];

            tpl._getFileListEntries(geoNetworkRecord);

            expect(tpl._getSingleFileEntry).not.toHaveBeenCalled();
        });

        it('returns single entry markup when no links', function() {

            geoNetworkRecord.downloadableLinks = [];

            var html = tpl._getFileListEntries(geoNetworkRecord);

            expect(tpl._makeEntryMarkup).toHaveBeenCalledWith('<span class="secondary-text">No attached files.</span>');
            expect(html).toBe('entry markup');
        });

        afterEach(function() {

            tpl._getSingleFileEntry.reset();
            tpl._makeEntryMarkup.reset();
        });
    });

    describe('_getSingleFileEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(tpl, '_makeExternalLinkMarkup').andReturn('link markup');
            spyOn(tpl, '_makeEntryMarkup').andReturn('entry markup');

            var link = geoNetworkRecord.downloadableLinks[0];

            html = tpl._getSingleFileEntry(link);
        });

        it('returns the entry markup', function() {

            expect(html).toBe('entry markup');
        });

        it('calls _makeEntryMarkup', function() {

            expect(tpl._makeEntryMarkup).toHaveBeenCalledWith('link markup');
        });

        it('calls _makeExternalLinkMarkup', function() {

            expect(tpl._makeExternalLinkMarkup).toHaveBeenCalledWith('http://host/some.html', 'the title one');
        });
    });

    describe('_makeEntryMarkup', function() {

        it('wraps the text in a div', function() {

            var html = tpl._makeEntryMarkup('text');

            expect(html).toBe('<div class="entry">text</div>');
        });
    });

    describe('_makeEntryMarkup', function() {

        it('wraps the text in a span', function() {

            var html = tpl._makeSecondaryTextMarkup('text');

            expect(html).toBe('<span class="secondary-text">text</span>');
        });
    });

    describe('_makeExternalLinkMarkup', function() {

        it('wraps the text in an anchor tag', function() {

            var html = tpl._makeExternalLinkMarkup('http://host.com/', 'text');

            expect(html).toBe("<a href='http://host.com/' target='_blank' class='external'>text</a>");
        });

        it('uses href as text if text is undefined', function() {

            var html = tpl._makeExternalLinkMarkup('http://host.com/');

            expect(html).toBe("<a href='http://host.com/' target='_blank' class='external'>http://host.com/</a>");
        });
    });

    describe('template output', function() {

        var rootElement;

        beforeEach(function() {

            tpl._getPointOfTruthLinkEntry = function() { return "point_of_truth" };
            tpl._dataRowTemplate = function() { return "<div>data_row_template</div>" };
            tpl._getFileListEntries = function() { return "file_list" };

            var html = tpl.apply(geoNetworkRecord);
            rootElement = $(html);
        });

        describe('root element', function() {

            it('has correct class', function() {

                expect(rootElement.attr('class')).toBe('download-collection');
            });

            it('has correct number of children', function() {

                expect(rootElement.children().length).toBe(4);
            });
        });

        describe('title row', function() {

            var titleRow;

            beforeEach(function() {

                titleRow = $(rootElement.children()[0]);
            });

            it('has the correct class', function() {

                expect(titleRow.attr('class')).toBe('title-row');
            });

            it('has the correct text value from function', function() {

                var trimmedText = $.trim(titleRow.text());

                expect(trimmedText).toBe('the title');
            });
        });

        describe('metadata row', function() {

            var row;
            var rowHeading;

            beforeEach(function() {

                row = $(rootElement.children()[1]);
                rowHeading = $(row.children()[0]);
            });

            it('has the correct class', function() {

                expect(row.attr('class')).toBe('row');
            });

            it('has correct number of children', function() {

                expect(row.children().length).toBe(1);
            });

            it('has correct row heading', function() {

                expect(rowHeading.attr('class')).toBe('subheading');
                expect(rowHeading.text()).toBe('Metadata');
            });

            it('has correct text value from function', function() {

                expect(getText(row)).toBe('point_of_truth');
            });
        });

        describe('files row', function() {

            var row;
            var rowHeading;

            beforeEach(function() {

                row = $(rootElement.children()[3]);
                rowHeading = $(row.children()[0]);
            });

            it('has the correct class', function() {

                expect(row.attr('class')).toBe('row');
            });

            it('has correct number of children', function() {

                expect(row.children().length).toBe(1);
            });

            it('has correct row heading', function() {

                expect(rowHeading.attr('class')).toBe('subheading');
                expect(rowHeading.text()).toBe('Attached files');
            });

            it('has correct text value from function', function() {

                expect(getText(row)).toBe('file_list');
            });
        });

        describe('template output when no attached files', function() {

            var rootElement;
            var html;

            beforeEach(function() {

                tpl._getPointOfTruthLinkEntry = function() { return "point_of_truth" };
                tpl._dataRowTemplate = function() { return "<div>data_row_template</div>" };
                tpl._getFileListEntries = function() { return "file_list" };

                geoNetworkRecord.downloadableLinks = [];

                html = tpl.apply(geoNetworkRecord);
                rootElement = $(html);
            });

            describe('root element', function() {

                it('has correct number of children', function() {

                    expect(rootElement.children().length).toBe(3);
                });
            });

            describe('files row', function() {

                it('should not be present when there are no links', function() {

                    expect(html.indexOf('file_list')).toBe(-1);
                });
            });
        });
    });

    function getText(element) {

        // Based on http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery

        var text = $(element)
            .contents()
            .filter(function() {
                return this.nodeType === Node.TEXT_NODE;
            }).text();

        var elements = text.split(" ").filter(function(val) { return val.length });

        return (elements.length == 1) ? elements[0] : elements;
    }
});
