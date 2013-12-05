
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.AodaacDataRowTemplate', function() {

    var parentTemplate;
    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {

        parentTemplate = new Portal.cart.DownloadPanelTemplate();
        tpl = new Portal.cart.AodaacDataRowTemplate(parentTemplate);
        geoNetworkRecord = {
            uuid: 7,
            aodaac: {}
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

            spyOn(tpl, '_aodaacParametersMarkup').andReturn('parameter_markup');
            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('entry markup');
        });

        it('returns the entry markup', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(html).toBe('entry markup');
        });

        it('calls entry markup with parameter description', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(tpl._aodaacParametersMarkup).toHaveBeenCalledWith(geoNetworkRecord.aodaac);
            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith('parameter_markup');
        });

        it('returns empty string when no aodaac parameters', function() {

            geoNetworkRecord.aodaac = null;

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

            var expectedArg = '' +
                '<input type="text" id="aodaac-email-address-7" value="' + OpenLayers.i18n('emailAddressPlaceholder') + '" class="floatLeft">' +
                '<div class="floatLeft">' +
                '<div id="aodaac-download-button-7"></div>' +
                '</div>' +
                '<div class="clear"></div>';

            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith(expectedArg);
        });

        it('include message when there is no layer', function() {

            geoNetworkRecord.aodaac = null;

            tpl._getDataDownloadEntry(geoNetworkRecord);

            expect(parentTemplate._makeSecondaryTextMarkup).toHaveBeenCalledWith(OpenLayers.i18n('noDataMessage'));
            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith('secondary text markup');
        });

        afterEach(function() {

            parentTemplate._makeEntryMarkup.reset();
        });
    });

    describe('_adoaacParameterMarkup', function() {

        var markup;
        var params;

        beforeEach(function() {

            spyOn(tpl, '_parameterString').andReturn('');

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

        it('returns parameter list markup', function() {

            expect(markup).toBe('<b>' + OpenLayers.i18n('parametersLabel') + '</b><br>');
        });

        it('calls _parameterString with correct arguments', function() {

            expect(tpl._parameterString.callCount).toBe(2);
            expect(tpl._parameterString.calls[0].args).toEqual(['parameterAreaLabel', '-90<b>N</b>,&nbsp;180<b>E</b>,', '90<b>S</b>,&nbsp;-180<b>W</b>']);
            expect(tpl._parameterString.calls[1].args).toEqual(['parameterDateLabel', '1/1/1900', '31/12/2001']);
        });
    });

    describe('_getNotificationBlurbEntry', function() {

        var markup;

        beforeEach(function() {

            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('markup entry');

            markup = tpl._getNotificationBlurbEntry();
        });

        it('calls _makeEntryMarkup with correct value', function() {

            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith(OpenLayers.i18n('notificationBlurbMessage'));
        });

        it('returns the result of _makeEntryMarkup', function() {

            expect(markup).toBe('markup entry');
        });
    });

    describe('_parameterString', function() {

        beforeEach(function() {

            spyOn(OpenLayers, 'i18n').andReturn('i18n value');
            spyOn(String, 'format');

            tpl._parameterString('the_key', 'val1', 'val2');
        });

        it('calls OpenLayers.i18n()', function() {

            expect(OpenLayers.i18n).toHaveBeenCalledWith('the_key');
        });

        it('calls String.format()', function() {

            expect(String.format).toHaveBeenCalledWith('{0}: <code>{1}</code> – <code>{2}</code><br>', 'i18n value', 'val1', 'val2')
        });
    });

    describe('_replacePlaceholdersWithControls', function() {

        var collectionMock;
        var htmlMock;
        var expectedEmlementId;

        beforeEach(function() {

            collectionMock = {
                uuid: 12345
            };

            expectedEmlementId = 'aodaac-download-button-12345';

            htmlMock = {
                indexOf: jasmine.createSpy('html indexOf').andReturn(1)
            };

            spyOn(tpl._createDownloadButton, 'defer');

            tpl._replacePlaceholdersWithControls(htmlMock, collectionMock);
        });

        it('calls indexOf with correct id', function() {

            expect(htmlMock.indexOf).toHaveBeenCalledWith(expectedEmlementId);
        });

        it('calls _createDownloadButton.defer', function() {

            expect(tpl._createDownloadButton.defer).toHaveBeenCalledWith(
                1,
                tpl,
                [htmlMock, expectedEmlementId, collectionMock]
            );
        });
    });

    describe('_createDownloadButton', function() {

        var mockMenu = {};
        var mockMenuItems = {};
        var mockButton = {};
        var mockCollection = {};
        var mockElement = {};

        beforeEach(function() {

            spyOn(tpl, '_createMenuItems').andReturn(mockMenuItems);
            spyOn(Ext.menu, 'Menu').andReturn(mockMenu);
            spyOn(Ext, 'Button').andReturn(mockButton);
            spyOn(tpl, '_emailTextFieldElement').andReturn(mockElement);
            mockButton.render = jasmine.createSpy('button render');
            mockElement.on = jasmine.createSpy();

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

        it('calls _emailTextFieldElement', function() {
            expect(tpl._emailTextFieldElement).toHaveBeenCalled();
        });

        it('calls _emailTextFieldElement to attach events to', function() {
            expect(mockElement.on).toHaveBeenCalled();
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

        it('returns a function to be called', function() {

            var collection = { uuid: 5 };
            var returnValue = tpl._downloadHandlerFor(collection);

            expect(typeof returnValue).toBe('function');
        });
    });

    describe('_aodaacUrl', function() {

        it('builds URL with correct query string', function() {

            var params = {
                productId: 89,
                latitudeRangeStart: -90,
                latitudeRangeEnd: 90,
                longitudeRangeStart: -180,
                longitudeRangeEnd: 180,
                productLatitudeRangeStart: 1,  // Shouldn't be used
                productLatitudeRangeEnd: 2,    // Shouldn't be used
                productLongitudeRangeStart: 3, // Shouldn't be used
                productLongitudeRangeEnd: 4,   // Shouldn't be used
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

        it('uses product defaults if no other bounds are set', function() {

            var params = {
                productId: 89,
                latitudeRangeStart: null,
                latitudeRangeEnd: null,
                longitudeRangeStart: null,
                longitudeRangeEnd: null,
                productLatitudeRangeStart: -90,
                productLatitudeRangeEnd: 90,
                productLongitudeRangeStart: -180,
                productLongitudeRangeEnd: 180,
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

    describe('_validateEmailAddress', function() {

        it('returns false for an empty address', function() {

            var returnVal = tpl._validateEmailAddress('');

            expect(returnVal).toBe(false);
        });

        it('returns false for an invalid address', function() {

            var returnVal = tpl._validateEmailAddress('notAnEmailAddress');

            expect(returnVal).toBe(false);
        });

        it('returns true for a valid address', function() {

            var returnVal = tpl._validateEmailAddress('user@domain.com');

            expect(returnVal).toBe(true);
        });
    });

    describe('template output', function() {

        var row;
        var rowHeading;

        beforeEach(function() {

            tpl._getDataFilterEntry = function() { return "data_filter" };
            tpl._getDataDownloadEntry = function() { return "data_download" };
            tpl._getNotificationBlurbEntry = function() { return "notification_blurb" };

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

                expect(rowText.length).toBe(3);
                expect(rowText[0]).toBe('data_filter');
                expect(rowText[1]).toBe('data_download');
                expect(rowText[2]).toBe('notification_blurb');
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
