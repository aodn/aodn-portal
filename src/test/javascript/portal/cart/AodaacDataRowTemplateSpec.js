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


    describe('_getDataDownloadEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('entry markup');
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

            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('markup entry');

            markup = tpl._getNotificationBlurbEntry();
        });

        it('returns the result of _makeEntryMarkup', function() {

            expect(markup).toBe( OpenLayers.i18n('notificationBlurbMessage') );
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
