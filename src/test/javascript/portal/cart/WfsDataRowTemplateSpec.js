
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.WfsDataRowTemplate', function() {

    var parentTemplate;
    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {

        parentTemplate = new Portal.cart.DownloadPanelTemplate();
        tpl = new Portal.cart.WfsDataRowTemplate(parentTemplate);
        geoNetworkRecord = {
            uuid: 9,
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                }
            }
        };
    });

    describe('applyWithControls', function() {

        it('calls relevant functions', function() {

            var values = {};

            spyOn(tpl, '_replacePlaceholdersWithControls').andReturn('final output');
            spyOn(tpl, 'apply').andReturn('template with placeholders');

            var returnVal = tpl.applyWithControls(values);

            expect(tpl.apply).toHaveBeenCalledWith(values);
            expect(tpl._replacePlaceholdersWithControls).toHaveBeenCalledWith('template with placeholders', values);
            expect(returnVal).toBe('final output');
        });
    });

    describe('_getDataFilterEntry', function() {

        beforeEach(function() {

            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('entry markup');
        });

        it('returns the entry markup', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(html).toBe('entry markup');
        });

        it('calls entry markup with filter description', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith('<b>' + OpenLayers.i18n('filterLabel') + '</b> <code>cql_filter</code>');
        });

        it('calls entry markup with no filter message', function() {

            geoNetworkRecord.wmsLayer.getDownloadFilter = function() { return null };

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith(OpenLayers.i18n('noFilterMessage'));
        });

        it('returns empty string when no layer', function() {

            geoNetworkRecord.wmsLayer = null;

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(html).toBe('');
            expect(parentTemplate._makeEntryMarkup).not.toHaveBeenCalled();
        });

        afterEach(function() {

            parentTemplate._makeEntryMarkup.reset();
        });
    });

    describe('_getDataDownloadEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('entry markup');
            spyOn(parentTemplate, '_makeSecondaryTextMarkup').andReturn('secondary text markup');

            html = tpl._getDataDownloadEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function() {

            expect(html).toBe('entry markup');
        });

        it('include placeholder when layer is present', function() {

            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith('<div id="wfs-download-button-9"></div>');
        });
    });

    describe('_replacePlaceholdersWithControls', function() {

        var collectionMock;
        var expectedEmlementId;

        beforeEach(function() {

            collectionMock = {
                uuid: 12345
            };

            expectedEmlementId = 'wfs-download-button-12345';

            spyOn(tpl._createDownloadButton, 'defer');

            tpl._replacePlaceholdersWithControls('the_html', collectionMock);
        });

        it('calls _createDownloadButton.defer', function() {

            expect(tpl._createDownloadButton.defer).toHaveBeenCalledWith(
                1,
                tpl,
                ['the_html', expectedEmlementId, collectionMock]
            );
        });
    });

    describe('_createDownloadButton', function() {

        var mockMenu = {};
        var mockMenuItems = {};
        var mockButton = {};
        var mockCollection = {};

        beforeEach(function() {

            spyOn(tpl, '_createMenuItems').andReturn(mockMenuItems);
            spyOn(Ext.menu, 'Menu').andReturn(mockMenu);
            spyOn(Ext, 'Button').andReturn(mockButton);
            mockButton.render = jasmine.createSpy('button render');

            tpl._createDownloadButton('html', '12345', mockCollection);
        });

        it('calls _createMenuItems', function() {

            expect(tpl._createMenuItems).toHaveBeenCalledWith(mockCollection);
        });

        it('create a new Menu', function() {

            expect(Ext.menu.Menu).toHaveBeenCalledWith({items: mockMenuItems})
        });

        it('creates a new Button', function() {

            expect(Ext.Button).toHaveBeenCalledWith({
                text: OpenLayers.i18n('downloadButtonLabel'),
                icon: 'images/down.png',
                scope: tpl,
                menu: mockMenu
            });
        });

        it('calls render on the button', function() {

            expect(mockButton.render).toHaveBeenCalledWith('html', '12345');
        });
    });

    describe('_createMenuItems', function() {

        it('returns array of menu items', function() {

            spyOn(tpl, '_downloadHandlerFor');

            var items = tpl._createMenuItems({});

            expect(items.length).not.toBe(0);

            Ext.each(items, function(item){

                expect(item.text).toBeDefined();
                expect(typeof item.text === 'string').toBeTruthy();
            });

            expect(tpl._downloadHandlerFor.callCount).toBe(items.length);
        });
    });

    describe('_downloadHandlerFor', function() {

        beforeEach(function() {

            spyOn(tpl, '_wfsUrlForGeoNetworkRecord');
        });

        it('calls _wfsUrlForGeoNetworkRecord', function() {

            tpl._downloadHandlerFor('collection', 'format');

            expect(tpl._wfsUrlForGeoNetworkRecord).toHaveBeenCalledWith('collection', 'format');
        });

        it('returns a function to be called', function() {

            var returnValue = tpl._downloadHandlerFor('collection');

            expect(typeof returnValue).toBe('function');
        });
    });

    describe('template output', function() {

        var row;
        var rowHeading;

        beforeEach(function() {

            tpl._getDataFilterEntry = function() { return "data_filter" };
            tpl._getDataDownloadEntry = function() { return "data_download" };

            var html = tpl.apply(geoNetworkRecord);
            row = $(html);

            rowHeading = $(row.children()[0]);
        });

        describe('download row', function() {

            it('has the correct class', function() {

                expect(row.attr('class')).toBe('row data');
            });

            it('has correct number of children', function() {

                expect(row.children().length).toBe(1);
            });

            it('has correct row heading', function() {

                expect(rowHeading.attr('class')).toBe('subheading');
                expect(rowHeading.text()).toBe(OpenLayers.i18n('dataSubheading'));
            });

            it('has correct text value from function', function() {

                var rowText = getText(row);

                expect(rowText.length).toBe(2);
                expect(rowText[0]).toBe('data_filter');
                expect(rowText[1]).toBe('data_download');
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
