
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

        parentTemplate = new Portal.cart.DownloadPanelBodyTemplate();
        tpl = new Portal.cart.WfsDataRowTemplate(parentTemplate);
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                }
            }
        };
        geoNetworkRecord.getWfsLayerFeatureRequestUrl = function() {}
    });




    describe('_getDataDownloadEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(parentTemplate, '_makeSecondaryTextMarkup').andReturn('secondary text markup');

            html = tpl._getDataDownloadEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function() {

            expect(html).toBe('<div id="wfs-download-button-9"></div>');
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

    });


});
