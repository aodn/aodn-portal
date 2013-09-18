
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanel", function() {

    var downloadPanel;

    beforeEach(function() {

        downloadPanel = new Portal.cart.DownloadPanel();
    });

    describe('initComponent()', function() {

        it('store is the ActiveGeoNetworkRecordStore singleton instance', function() {
            expect(downloadPanel.store).toBe(Portal.data.ActiveGeoNetworkRecordStore.instance());
        });

        it('listens for beforeshow event', function() {

            spyOn(downloadPanel, 'generateContent');

            downloadPanel.fireEvent('beforeshow');

            expect(downloadPanel.generateContent).toHaveBeenCalled();
        });
    });

    describe('onBeforeShow()', function() {

        it('calls refresh() on its view', function() {

            spyOn(downloadPanel, 'generateContent');

            downloadPanel.onBeforeShow();

            expect(downloadPanel.generateContent).toHaveBeenCalled();
        });
    });

    describe('generateContent', function() {

        var mockTemplate;
        var testCollection1 = {value: '[Content 1]'};
        var testCollection2 = {value: '[Content 2]'};
        var testCollection3 = {value: '[Content 3]'};
        var testCollection4 = {value: '[Content 4]'};

        beforeEach(function() {

            mockTemplate = {
                apply: jasmine.createSpy('template apply').andCallFake(function(collection) { return collection.value })
            };

            spyOn(Portal.cart, 'DownloadPanelTemplate').andReturn(mockTemplate);

            downloadPanel = new Portal.cart.DownloadPanel();
            downloadPanel.store.data.items = [
                {data: testCollection1},
                {data: testCollection2}
            ];

            spyOn(downloadPanel, '_replacePlaceholderWithButton');
            spyOn(downloadPanel, 'update');

            downloadPanel.generateContent();
        });

        it('creates a DownloadPanelTemplate', function() {

            expect(Portal.cart.DownloadPanelTemplate).toHaveBeenCalled();
        });

        it('reverse view order enforced', function() {

            downloadPanel.store.data.items = [
                {data: testCollection1},
                {data: testCollection2},
                {data: testCollection3},
                {data: testCollection4}
            ];
            downloadPanel.generateContent();

            expect(mockTemplate.apply.argsForCall[3][0]).toBe(testCollection1);
            expect(mockTemplate.apply.argsForCall[2][0]).toBe(testCollection2);
            expect(mockTemplate.apply.argsForCall[1][0]).toBe(testCollection3);
            expect(mockTemplate.apply.argsForCall[0][0]).toBe(testCollection4);
        });

        it('calls apply on the template', function() {

            // Order of items is reversed!!
            expect(mockTemplate.apply.callCount).toBe(2);
            expect(mockTemplate.apply.argsForCall[1][0]).toBe(testCollection1);
            expect(mockTemplate.apply.argsForCall[0][0]).toBe(testCollection2);
        });

        it('calls _replacePlaceholderWithButton', function() {

            // Order of items is reversed!!
            expect(downloadPanel._replacePlaceholderWithButton.callCount).toBe(2);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[0][0]).toBe(testCollection2.value);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[0][1]).toBe(testCollection2);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[1][0]).toBe(testCollection2.value + testCollection1.value);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[1][1]).toBe(testCollection1);
        });

        it('calls update', function() {

            // Order of items is reversed!!
            expect(downloadPanel.update).toHaveBeenCalledWith('[Content 2][Content 1]');
        });

        it('calls _contentForEmptyView when empty', function() {

            spyOn(downloadPanel, '_contentForEmptyView').andReturn('empty cart content');

            downloadPanel.store.data.items = [];

            downloadPanel.generateContent();

            expect(downloadPanel._contentForEmptyView).toHaveBeenCalled();
            expect(downloadPanel.update).toHaveBeenCalledWith('empty cart content');
        });
    });

    describe('generateContent', function() {

        it('returns marked-up text', function() {

            spyOn(OpenLayers, 'i18n').andReturn('empty');

            var content = downloadPanel._contentForEmptyView();

            expect(content).toBe('<i>empty</i>');
            expect(OpenLayers.i18n).toHaveBeenCalled();
        });
    });

    describe('_replacePlaceholderWithButton', function() {

        var collectionMock;
        var htmlMock;
        var expectedEmlementId;

        beforeEach(function() {

            collectionMock = {
                uuid: 12345
            };

            expectedEmlementId = 'download-button-12345';

            htmlMock = {
                indexOf: jasmine.createSpy('html indexOf').andReturn(1)
            };

            spyOn(downloadPanel._createDownloadButton, 'defer');

            downloadPanel._replacePlaceholderWithButton(htmlMock, collectionMock);
        });

        it('calls indexOf with correct id', function() {

            expect(htmlMock.indexOf).toHaveBeenCalledWith(expectedEmlementId);
        });

        it('calls _createDownloadButton.defer', function() {

            expect(downloadPanel._createDownloadButton.defer).toHaveBeenCalledWith(
                1,
                downloadPanel,
                [htmlMock, 'Download as...', expectedEmlementId, collectionMock]
            );
        });
    });

    describe('_createDownloadButton', function() {

        var mockMenu = {};
        var mockMenuItems = {};
        var mockButton = {};
        var mockCollection = {};

        beforeEach(function() {

            spyOn(downloadPanel, '_createMenuItems').andReturn(mockMenuItems);
            spyOn(Ext.menu, 'Menu').andReturn(mockMenu);
            spyOn(Ext, 'Button').andReturn(mockButton);
            mockButton.render = jasmine.createSpy('button render');

            downloadPanel._createDownloadButton('html', 'value', '12345', mockCollection);
        });

        it('calls _createMenuItems', function() {

            expect(downloadPanel._createMenuItems).toHaveBeenCalledWith(mockCollection);
        });

        it('create a new Menu', function() {

            expect(Ext.menu.Menu).toHaveBeenCalledWith({items: mockMenuItems})
        });

        it('creates a new Button', function() {

            expect(Ext.Button).toHaveBeenCalledWith({
                text: 'value',
                icon: 'images/down.png',
                scope: downloadPanel,
                menu: mockMenu
            });
        });

        it('calls render on the button', function() {

            expect(mockButton.render).toHaveBeenCalledWith('html', '12345');
        });
    });

    describe('_createMenuItems', function() {

        it('returns array of menu items', function() {

            spyOn(downloadPanel, '_downloadHandlerFor');

            var items = downloadPanel._createMenuItems({});

            expect(items.length).not.toBe(0);

            Ext.each(items, function(item){

                expect(item.text).toBeDefined();
                expect(typeof item.text === 'string').toBeTruthy();
            });

            expect(downloadPanel._downloadHandlerFor.callCount).toBe(items.length);
        });
    });

    describe('_downloadHandlerFor', function() {

        beforeEach(function() {

            spyOn(downloadPanel, '_wfsUrlForGeoNetworkRecord');
        });

        it('calls _wfsUrlForGeoNetworkRecord', function() {

            downloadPanel._downloadHandlerFor('collection', 'format');

            expect(downloadPanel._wfsUrlForGeoNetworkRecord).toHaveBeenCalledWith('collection', 'format');
        });

        it('returns a function to be called', function() {

            var returnValue = downloadPanel._downloadHandlerFor();

            expect(typeof returnValue).toBe('function');
        });
    });
});
