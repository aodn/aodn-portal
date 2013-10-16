
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.NoDataRowTemplate', function() {

    var parentTemplate;
    var tpl;

    beforeEach(function() {

        parentTemplate = new Portal.cart.DownloadPanelTemplate();
        tpl = new Portal.cart.NoDataRowTemplate(parentTemplate);
    });

    describe('applyWithControls', function() {

        it('calls relevant functions', function() {

            var values = {};

            spyOn(tpl, 'apply').andReturn('final output');

            var returnVal = tpl.applyWithControls(values);

            expect(tpl.apply).toHaveBeenCalledWith(values);
            expect(returnVal).toBe('final output');
        });
    });

    describe('_getNoDataMessageEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(parentTemplate, '_makeEntryMarkup').andReturn('entry markup');
            spyOn(parentTemplate, '_makeSecondaryTextMarkup').andReturn('secondary text markup');

            html = tpl._getNoDataMessageEntry();
        });

        it('returns the entry markup', function() {

            expect(html).toBe('entry markup');
        });

        it('include message', function() {

            expect(parentTemplate._makeSecondaryTextMarkup).toHaveBeenCalledWith(OpenLayers.i18n('noDataMessage'));
            expect(parentTemplate._makeEntryMarkup).toHaveBeenCalledWith('secondary text markup');
        });
    });

    describe('template output', function() {

        var row;
        var rowHeading;

        beforeEach(function() {

            tpl._getNoDataMessageEntry = function() { return "no_data_message" };

            var html = tpl.apply();
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

                expect(rowText).toBe('no_data_message');
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
