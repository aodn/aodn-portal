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

        filterPanel = new Portal.filter.ui.DateFilterPanel({
            filter: {
                name: 'some_column',
                wmsStartDateName: "aWmsStartDateName",
                wmsEndDateName: "aWmsEndDateName",
                clearValue: noOp,
                setValue: jasmine.createSpy('setValue')
            },
            dataCollection: {
                getTitle: returns('Collection title'),
                getLayerSelectionModel: returns({
                    getSelectedLayer: returns({
                        name: 'layerName',
                        getDownloadCql: returns("")
                    })
                })
            }
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
            spyOn(window, 'trackUsage');
            component = {
                _dateField: {
                    name: "atestname",
                    getValue: returns('12-02-1990')
                }
            };
            filterPanel.toDate = {
                getValue: returns(new Date(1999, 11, 31, 4, 4, 4, 4)), // 4:04:04.0004am
                setMinValue: noOp
            };

            filterPanel._applyDateFilter(component);
        });

        it('fires events when required fields are set', function() {
            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Date", "atestname user set 12-02-1990", "Collection title");
        });

        it('uses end-of-day for end date', function() {
            expect(filterPanel.filter.setValue).toHaveBeenCalledWith({
                fromDate: undefined,
                toDate: new Date(1999, 11, 31, 23, 59, 59, 999)
            });
        });
    });

    function _mockFilterFields(filterPanel) {
        Ext.each(['fromDate', 'toDate'], function(property) {
            this[property] = {
                getValue: noOp,
                setMinValue: noOp,
                setMaxValue: noOp,
                applyDefaultValueLimits: noOp
            };
        }, filterPanel);
    }
});
