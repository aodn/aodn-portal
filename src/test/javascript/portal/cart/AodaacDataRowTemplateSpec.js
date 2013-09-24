
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.AodaacDataRowTemplate', function() {

    var html;
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

    describe('_getDataFilterEntry', function() {

        beforeEach(function() {

            spyOn(tpl, '_aodaacParamatersMarkup').andReturn('parameter_markup');
            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('entry markup');
        });

        it('returns the entry markup', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(html).toBe('entry markup');
        });

        it('calls entry markup with parameter description', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(tpl._aodaacParamatersMarkup).toHaveBeenCalledWith(geoNetworkRecord.aodaac);
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

            html = tpl._getDataDownloadEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function() {

            expect(html).toBe('entry markup');
        });

        it('include placeholder when layer is present', function() {

            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith('<div id="aodaac-download-button-7"></div>');
        });

        it('include message when there is no layer', function() {

            geoNetworkRecord.aodaac = null;

            tpl._getDataDownloadEntry(geoNetworkRecord);

            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith('<span class="secondary-text">' + OpenLayers.i18n('noData') + '</span>');
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
                dateRangeEnd: '31/12/2001',
                timeOfDayRangeStart: '00:00',
                timeOfDayRangeEnd: '23:59'
            };

            markup = tpl._aodaacParamatersMarkup(params);
        });

        it('returns parameter list markup', function() {

            expect(markup).toBe('<b>' + OpenLayers.i18n('parametersLabel') + '</b><br>');
        });

        it('calls _parameterString with correct arguments', function() {

            expect(tpl._parameterString.callCount).toBe(3);
            expect(tpl._parameterString.calls[0].args).toEqual(['parameterArea', '-90&nbsp;N,&nbsp;-180&nbsp;E', '90&nbsp;N,&nbsp;180&nbsp;E']);
            expect(tpl._parameterString.calls[1].args).toEqual(['parameterDate', '1/1/1900', '31/12/2001']);
            expect(tpl._parameterString.calls[2].args).toEqual(['parameterTime', '00:00', '23:59']);
        });
    });

    describe('_parameterString', function() {

        expect('write moar tests').toBe('true');
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
                expect(rowHeading.text()).toBe(OpenLayers.i18n('subheadingData'));
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
