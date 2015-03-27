/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.ui.DateFilterPanel", function() {

    var filterPanel;
    var component;

    beforeEach(function() {
        Portal.filter.ui.DateFilterPanel.prototype._createControls = noOp;

        Portal.filter.ui.DateFilterPanel.prototype._getDateString = noOp;

        filterPanel = new Portal.filter.ui.DateFilterPanel({
            filter: {
                name: 'some_column',
                wmsStartDateName: "aWmsStartDateName",
                wmsEndDateName: "aWmsEndDateName",
                clearValue: noOp,
                setValue: noOp
            },
            layer: {
                name: 'layerName',
                getDownloadCql: function() {
                    return '';
                }
            },
            setLayerAndFilter: noOp
        });

        _mockFilterFields(filterPanel);
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
            component._dateField.getValue = function() { return '12-02-1990' };
            filterPanel._applyDateFilter(component);
            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Date", "atestname user set 12-02-1990", "layerName");
            expect(filterPanel._fireAddEvent).toHaveBeenCalled();
        });
    });

    function _mockFilterFields(filterPanel) {
        Ext.each(['fromDate', 'toDate'], function(property) {
            this[property] = {
                getValue: noOp,
                setMinValue: noOp,
                setMaxValue: noOp,
                applyDefaultValueLimits: noOp
            }
        }, filterPanel);
    }
});
