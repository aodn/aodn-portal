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

        parentTemplate = new Portal.cart.DownloadPanelBodyTemplate();
        tpl = new Portal.cart.AodaacDataRowTemplate(parentTemplate);
        geoNetworkRecord = {
            uuid: 7,
            aodaac: {}
        };
    });


    describe('_getDataDownloadEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(parentTemplate, '_makeSecondaryTextMarkup').andReturn('secondary text markup');

            html = tpl._getDataDownloadEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function() {

            // having an issue with non printing chars
            expect(html).toContain('<div class="delayedDownloadForm">');
        });


    });


    describe('_getNotificationBlurbEntry', function() {

        var markup;

        beforeEach(function() {


            markup = tpl._getNotificationBlurbEntry();
        });

        it('returns notificationBlurbMessage', function() {

            expect(markup).toBe( OpenLayers.i18n('notificationBlurbMessage') );
        });
    });

    describe('_downloadAodaacHandler', function () {

        it('returns a function to be called', function () {

            var collection = { uuid: 5, aodaac: true };
            var returnValue = tpl._downloadAodaacHandler(collection);

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
                '&dateRangeStart=1%2F1%2F1900' +
                '&dateRangeEnd=31%2F12%2F2001' +
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
                expect(row.attr('class')).toBe('x-panel-body x-box-layout-ct');
            });

            it('has correct text value from function', function() {

                var rowText = getText(row);
                expect(rowText.length).toBe(13);
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
