/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.DateFilterPanel", function() {

    var filterPanel;
    var component;

    beforeEach(function() {
        Portal.filter.DateFilterPanel.prototype._createField = function() {};

        Portal.filter.DateFilterPanel.prototype._getDateString = function() {};

        filterPanel = new Portal.filter.DateFilterPanel({
            filter: {
                name: 'some_column',
                wmsStartDateName: "aWmsStartDateName",
                wmsEndDateName: "aWmsEndDateName"
            },
            layer: {
                name: 'layerName',
                getDownloadFilter: function() {
                    return '';
                }
            },
            setLayerAndFilter: noOp
        });

        _mockFilterFields(filterPanel);
    });

    describe('_getDateHumanString', function() {

        beforeEach(function() {

            filterPanel.combo = {
                getValue: function() { return new Date('2012') }
            };
        });

        it('after', function() {
            // uses time zone so cant test for equality in Travis
            expect(filterPanel._getDateHumanString(filterPanel.combo)).toNotEqual(undefined);
        });

    });

    describe('handleRemoveFilter', function() {
        beforeEach(function() {
            filterPanel.toDate.reset = jasmine.createSpy('toDate reset');
            filterPanel.toDate.setMinValue = jasmine.createSpy('toDate setMinValue');

            filterPanel.fromDate.reset = jasmine.createSpy('fromDate reset');
        });

        it('resets toDate', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel.toDate.reset).toHaveBeenCalled();
        });

        it('sets min value of toDate', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel.toDate.setMinValue).toHaveBeenCalled();
        });

        it('resets fromDate', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel.toDate.reset).toHaveBeenCalled();
        });
    });

    describe('apply date filter', function() {

        beforeEach(function() {
            spyOn(filterPanel, '_fireAddEvent');
            spyOn(window, 'trackUsage');
            component = {'_dateField':{"name":"atestname"}}
        });

        it('fires events when required fields are set', function() {
            component._dateField.getValue = function() { return '12-02-1990'};
            filterPanel._applyDateFilterPanel(component);
            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Date", "atestname reset 12-02-1990", "layerName");
            expect(filterPanel._fireAddEvent).toHaveBeenCalled();
        });
    });

    describe('CQL', function() {
        beforeEach(function() {
            spyOn(filterPanel, '_getDateString').andCallFake(function(combo) { return combo.getValue() });
        });

        it('after', function() {
            setTestValue(filterPanel.fromDate, '2012');

            expect(filterPanel._getCQL('some_column')).toEqual("some_column >= '2012'");
        });

        it('before', function() {
            setTestValue(filterPanel.toDate, '2014');

            expect(filterPanel._getCQL("filterName")).toEqual("filterName <= '2014'");
        });

        it('between', function() {
            setTestValue(filterPanel.fromDate, '2012');
            setTestValue(filterPanel.toDate, '2014');

            // To capture any data that falls within the range the end date is compared to the start of the range, and the start date is compared to the end of the range
            expect(filterPanel._getCQL()).toEqual("aWmsEndDateName >= '2012' AND aWmsStartDateName <= '2014'");
        });

        it('single date attribute', function() {
            setTestValue(filterPanel.fromDate, '2012');
            setTestValue(filterPanel.toDate, '2014');

            filterPanel.filter.wmsStartDateName = null;
            expect(filterPanel._getCQL()).toEqual("aWmsEndDateName >= '2012' AND some_column <= '2014'");

            filterPanel.filter.wmsStartDateName = 'updatedName';
            filterPanel.filter.wmsEndDateName = null;
            expect(filterPanel._getCQL()).toEqual("some_column >= '2012' AND updatedName <= '2014'");

        });

        var setTestValue = function(resettableDate, value) {
            spyOn(resettableDate, 'getValue').andReturn(value);
            spyOn(resettableDate, 'hasValue').andReturn(true);
        };
    });

    describe('_setExistingFilters', function() {
        it('sets from and to fields from cql parameter', function() {
            filterPanel.layer = {};
            filterPanel.layer.getDownloadFilter = function() {
                return "some_column >= '2013-10-07T13:00:00Z' AND some_column <= '2013-10-08T13:00:00Z'";
            };

            var MockField = function() {
                this.setValue = jasmine.createSpy();
            };

            filterPanel.fromDate = new MockField();
            filterPanel.toDate = new MockField();

            filterPanel._setExistingFilters();

            expect(filterPanel.fromDate.setValue).toHaveBeenCalledWith(new Date("Tue Oct 08 2013 00:00:00 GMT+1100 (EST)"));
            expect(filterPanel.toDate.setValue).toHaveBeenCalledWith(new Date("Wed Oct 09 2013 00:00:00 GMT+1100 (EST)"));
        });
    });

    function _mockFilterFields(filterPanel) {
        Ext.each(['fromDate', 'toDate'], function(property, index, all) {
            this[property] = {
                getValue: noOp,
                hasValue: noOp,
                applyDefaultValueLimits: noOp
            }
        }, filterPanel);
    }
});
