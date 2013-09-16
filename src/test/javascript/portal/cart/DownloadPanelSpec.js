
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

        it('calls apply on the template', function() {

            expect(mockTemplate.apply.callCount).toBe(2);
            expect(mockTemplate.apply.argsForCall[0][0]).toBe(testCollection1);
            expect(mockTemplate.apply.argsForCall[1][0]).toBe(testCollection2);
        });

        it('calls _replacePlaceholderWithButton', function() {

            expect(downloadPanel._replacePlaceholderWithButton.callCount).toBe(2);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[0][0]).toBe(testCollection1.value);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[0][1]).toBe(testCollection1);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[1][0]).toBe(testCollection1.value + testCollection2.value);
            expect(downloadPanel._replacePlaceholderWithButton.argsForCall[1][1]).toBe(testCollection2);
        });

        it('calls update', function() {

            expect(downloadPanel.update.mostRecentCall.args[0]).toBe('[Content 1][Content 2]');
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
                [htmlMock, 'Download as...', expectedEmlementId]
            );
        });
    });

    describe('_createDownloadButton', function() {

        var mockMenu = {};
        var mockMenuItems = {};
        var mockButton = {};

        beforeEach(function() {

            spyOn(downloadPanel, '_createMenuItems').andReturn(mockMenuItems);
            spyOn(Ext.menu, 'Menu').andReturn(mockMenu);
            spyOn(Ext, 'Button').andReturn(mockButton);
            mockButton.render = jasmine.createSpy('button render');

            downloadPanel._createDownloadButton('html', 'value', '12345');
        });

        it('calls _createMenuItems', function() {

            expect(downloadPanel._createMenuItems).toHaveBeenCalled();
        });

        it('create a new Menu', function() {

            expect(Ext.menu.Menu).toHaveBeenCalledWith({items: mockMenuItems})
        });

        it('creates a new Button', function() {

            expect(Ext.Button).toHaveBeenCalledWith({
                text: 'value',
                iconCls: '',
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

            var items = downloadPanel._createMenuItems();

            expect(items.length).not.toBe(0);

            Ext.each(items, function(item){

                expect(item.text).toBeDefined();
                expect(typeof item.text === 'string').toBeTruthy();

                expect(item.handler).toBeDefined();
                expect(typeof item.handler === 'function').toBeTruthy();
            });
        });
    });
});
