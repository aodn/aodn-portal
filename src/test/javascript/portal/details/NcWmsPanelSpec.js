/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.details.NcWmsPanel', function() {

    var map;
    var ncwmsPanel;
    var geoNetworkRecord = {
        id: '45678',
        updateNcwmsParams: jasmine.createSpy('updateNcwmsParams')
    };
    var layer;

    beforeEach(function() {
        map = new OpenLayers.SpatialConstraintMap();

        spyOn(map.events, 'register');
        spyOn(Portal.ui.TimeRangeLabel.prototype, 'update');

        layer = _mockLayer();
        layer.getMissingDays =  function() { return [] };
        layer.isNcwms = function() { return true };
        layer.events = { on: noOp };
        layer.processTemporalExtent = noOp;
        layer.map = map;

        ncwmsPanel = new Portal.details.NcWmsPanel({ map: map });
        ncwmsPanel._setBounds =  noOp;
        ncwmsPanel._removeLoadingInfo = noOp;
        ncwmsPanel.selectedLayer = layer;
    });

    describe('GeoNetworkRecord', function() {

        it('assigns a GeoNetworkRecord instance from a layer', function() {
            _applyCommonSpies();
            spyOn(ncwmsPanel, '_removeLoadingInfo');

            ncwmsPanel.handleLayer(layer, noOp, noOp, {});
            expect(ncwmsPanel.geoNetworkRecord).toBeTruthy();
            expect(ncwmsPanel.geoNetworkRecord.id).toEqual(geoNetworkRecord.id);
        });
    });

    describe('input controls', function() {

        beforeEach(function() {
            _applyCommonSpies();
        });

        it('updates the NcWMS panel object when the layer changes', function() {
            ncwmsPanel.handleLayer(layer, noOp, noOp, {});
            expect(ncwmsPanel.geoNetworkRecord.updateNcwmsParams).toHaveBeenCalled();
            delete ncwmsPanel.geoNetworkRecord;
        });

        it('updates the date when the start date changes via edit', function() {
            ncwmsPanel._addTemporalControls();
            ncwmsPanel.startDateTimePicker.fireEvent('change');
            expect(ncwmsPanel._onDateSelected).toHaveBeenCalled();
        });

        it('updates the date when the end date changes via edit', function() {
            ncwmsPanel._addTemporalControls();
            ncwmsPanel.endDateTimePicker.fireEvent('change');
            expect(ncwmsPanel._onDateSelected).toHaveBeenCalled();
        });

        it('clears the date and time pickers when the layer is updating', function() {
            spyOn(ncwmsPanel, '_clearDateTimeFields');
            ncwmsPanel.handleLayer(layer, noOp, noOp, {});
            expect(ncwmsPanel._clearDateTimeFields).toHaveBeenCalled();
            delete ncwmsPanel.geoNetworkRecord;
        });
    });

    describe('_newHtmlElement', function() {

        it('return an element with the html set', function() {

            var element = ncwmsPanel._newHtmlElement('the html');

            expect(element.html).toBe('the html');
        });
    });

    describe('clearing the date and time pickers', function() {
        it('resets the start picker', function() {
            spyOn(ncwmsPanel.startDateTimePicker, 'reset');
            ncwmsPanel._clearDateTimeFields();
            expect(ncwmsPanel.startDateTimePicker.reset).toHaveBeenCalled();
        });

        it('resets the end picker', function() {
            spyOn(ncwmsPanel.endDateTimePicker, 'reset');
            ncwmsPanel._clearDateTimeFields();
            expect(ncwmsPanel.endDateTimePicker.reset).toHaveBeenCalled();
        });

        it('hides the next and previous buttons', function() {
            spyOn(ncwmsPanel.buttonsPanel, 'hide');
            ncwmsPanel._clearDateTimeFields();
            expect(ncwmsPanel.buttonsPanel.hide).toHaveBeenCalled();
        });

        it('updates the time range label', function() {
            spyOn(ncwmsPanel, '_updateTimeRangeLabelLoading');
            ncwmsPanel._clearDateTimeFields();
            expect(ncwmsPanel._updateTimeRangeLabelLoading).toHaveBeenCalledWith();
        });
    });

    describe('layer temporal extent loaded', function() {

        it('enables the start date picker', function() {
            ncwmsPanel._layerTemporalExtentLoaded();
            expect(ncwmsPanel.startDateTimePicker.disabled).toBeFalsy();
        });

        it('enables the end date picker', function() {
            ncwmsPanel._layerTemporalExtentLoaded();
            expect(ncwmsPanel.endDateTimePicker.disabled).toBeFalsy();
        });

        it('shows the next and previous buttons', function() {
            spyOn(ncwmsPanel.buttonsPanel, 'show');
            ncwmsPanel._layerTemporalExtentLoaded();
            expect(ncwmsPanel.buttonsPanel.show).toHaveBeenCalled();
        });

        it('updates the time range label', function() {
            spyOn(ncwmsPanel, '_updateTimeRangeLabel');
            ncwmsPanel._layerTemporalExtentLoaded();
            expect(ncwmsPanel._updateTimeRangeLabel).toHaveBeenCalled();
        });
    });

    describe('_addDateTimeFilterToLayer', function() {

        it('updates bodaacFilterParams in selected layer', function() {

            var startTime = moment('2000-01-01T01:01:01');
            var endTime = moment('2001-01-01T01:01:01');

            spyOn(ncwmsPanel.startDateTimePicker, 'getValue').andReturn(startTime.toDate());
            spyOn(ncwmsPanel.endDateTimePicker, 'getValue').andReturn(endTime.toDate());

            ncwmsPanel._addDateTimeFilterToLayer();

            expect(layer.bodaacFilterParams.dateRangeStart).toBeSame(startTime);
            expect(layer.bodaacFilterParams.dateRangeEnd).toBeSame(endTime);
        });
    });

    function _applyCommonSpies(panel) {
        var _panel = panel || ncwmsPanel;
        spyOn(_panel, '_showAllControls');
        spyOn(_panel, '_onDateSelected');
        spyOn(_panel, '_setBounds');
    }

    function _mockLayer() {
        var extent = new Portal.visualise.animations.TemporalExtent();
        for (var i = 0; i < 24; i++) {
            extent.add(moment("2001-01-01T01:00:00.000Z").add('h', i));
        }
        return {
            parentGeoNetworkRecord: geoNetworkRecord,
            temporalExtent: extent,
            missingDays: [],
            time: extent.min(),
            getTemporalExtent: function() {
                return this.temporalExtent;
            },
            getSubsetExtentMin: function() { return extent.min() },
            getSubsetExtentMax: function() { return extent.max() },
            wfsLayer: {
                name: 'gogoDingo'
            }
        };
    }
});
