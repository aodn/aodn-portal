/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.details.NcWmsPanel', function() {

    var map;
    var ncwmsPanel;
    var dataCollection;

    var layer;
    var layerState;

    beforeEach(function() {
        map = new OpenLayers.SpatialConstraintMap();

        spyOn(map.events, 'register');
        spyOn(Portal.ui.TimeRangeLabel.prototype, 'update');

        layer = _mockLayer();
        layer.getMissingDays = returns([]);
        layer.isNcwms = returns(true);
        layer.events = { on: noOp };
        layer.processTemporalExtent = noOp;
        layer.map = map;

        layerState = new Ext.util.Observable();

        dataCollection = {
            getUuid: returns(45678),
            updateNcwmsParams: jasmine.createSpy('updateNcwmsParams'),
            getSelectedLayer: returns(layer),
            getLayerState: returns(layerState)
        };

        ncwmsPanel = new Portal.details.NcWmsPanel({
            map: map,
            dataCollection: dataCollection
        });

        ncwmsPanel._setBounds = noOp;
        ncwmsPanel._removeLoadingInfo = noOp;
        ncwmsPanel.selectedLayer = layer;

        spyOn(window, 'trackUsage');
    });

    describe('DataCollection', function() {

        it('assigns a DataCollection instance from a layer', function() {
            _applyCommonSpies();
            spyOn(ncwmsPanel, '_removeLoadingInfo');

            ncwmsPanel._initWithLayer();
            expect(ncwmsPanel.dataCollection).toBeTruthy();
            expect(ncwmsPanel.dataCollection.getUuid()).toEqual(dataCollection.getUuid());
        });
    });

    describe('input controls', function() {

        beforeEach(function() {
            _applyCommonSpies();
        });

        it('updates the record when panel is created', function() {
            ncwmsPanel._initWithLayer();
            expect(ncwmsPanel.dataCollection.updateNcwmsParams).toHaveBeenCalled();
        });

        it('updates the date when the start date changes via edit', function() {
            ncwmsPanel._addTemporalControls();
            ncwmsPanel.startDateTimePicker.fireEvent('change', ncwmsPanel.startDateTimePicker);
            expect(ncwmsPanel._onDateSelected).toHaveBeenCalled();
        });

        it('updates the date when the end date changes via edit', function() {
            ncwmsPanel._addTemporalControls();
            ncwmsPanel.startDateTimePicker.fireEvent('change', ncwmsPanel.endDateTimePicker);
            expect(ncwmsPanel._onDateSelected).toHaveBeenCalled();
        });

        // Not sure that this is necessary.
        // it('clears the date and time pickers when the layer is updating', function() {
        //     spyOn(ncwmsPanel, '_disableDateTimeFields');
        //     ncwmsPanel._initWithLayer();
        //     expect(ncwmsPanel._disableDateTimeFields).toHaveBeenCalled();
        //     delete ncwmsPanel.dataCollection;
        // });
    });

    describe('_newHtmlElement', function() {

        it('return an element with the html set', function() {

            var element = ncwmsPanel._newHtmlElement('the html');

            expect(element.html).toBe('the html');
        });
    });

    describe('reset button', function() {
        it('resets the temporal extent', function() {
            layer.getTemporalExtentMin = returns("ExtentMin");
            layer.getTemporalExtentMax = returns("ExtentMax");

            spyOn(ncwmsPanel, '_resetExtent');
            ncwmsPanel.resetConstraints();
            expect(ncwmsPanel._resetExtent).toHaveBeenCalledWith("ExtentMin", "ExtentMax");
        });

    });

    describe('layer temporal extent load', function() {
        it('enables the start date picker', function() {
            ncwmsPanel._layerTemporalExtentLoad();
            expect(ncwmsPanel.startDateTimePicker.disabled).toBeFalsy();
        });

        it('enables the end date picker', function() {
            ncwmsPanel._layerTemporalExtentLoad();
            expect(ncwmsPanel.endDateTimePicker.disabled).toBeFalsy();
        });

        it('updates the time range label', function() {
            spyOn(ncwmsPanel, '_updateTimeRangeLabel');
            ncwmsPanel._layerTemporalExtentLoad();
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

    describe('next and previous buttons', function() {
        beforeEach(function() {
            ncwmsPanel.layer.getPreviousTimeSlice = noOp;
            ncwmsPanel.layer.getNextTimeSlice = noOp;
            spyOn(ncwmsPanel.layer, 'getPreviousTimeSlice');
            spyOn(ncwmsPanel.layer, 'getNextTimeSlice');
        });

        describe('_previousTimeSlice', function() {
            it('attaches pending event', function() {
                ncwmsPanel._loadPreviousTimeSlice();
                expect(ncwmsPanel._getPendingEvent()).toEqual('previous');
            });

            it('loads previous time slice', function() {
                ncwmsPanel._loadPreviousTimeSlice();
                expect(ncwmsPanel.layer.getPreviousTimeSlice).toHaveBeenCalled();
            });
        });

        describe('_nextTimeSlice', function() {
            it('attaches pending event', function() {
                ncwmsPanel._loadNextTimeSlice();
                expect(ncwmsPanel._getPendingEvent()).toEqual('next');
            });

            it('loads next time slice', function() {
                ncwmsPanel._loadNextTimeSlice();
                expect(ncwmsPanel.layer.getNextTimeSlice).toHaveBeenCalled();
            });
        });
    });

    describe('selected layer change', function() {
        var newLayer = {};

        it('responds to selectedlayerchanged event', function() {
            spyOn(ncwmsPanel, '_onSelectedLayerChanged');
            ncwmsPanel.dataCollection.getLayerState().fireEvent('selectedlayerchanged', newLayer);

            expect(ncwmsPanel._onSelectedLayerChanged).toHaveBeenCalledWith(newLayer);
        });

        it('updates and resets for new layer', function() {
            spyOn(ncwmsPanel, '_initWithLayer');
            spyOn(ncwmsPanel, 'resetConstraints');
            ncwmsPanel._onSelectedLayerChanged(newLayer);

            expect(ncwmsPanel.layer).toBe(newLayer);
            expect(ncwmsPanel._initWithLayer).toHaveBeenCalled();
            expect(ncwmsPanel.resetConstraints).toHaveBeenCalled();
        });


    });

    function _applyCommonSpies(panel) {
        spyOn(ncwmsPanel, '_onDateSelected');
        spyOn(ncwmsPanel, '_setBounds');
    }

    function _mockLayer() {
        var extent = new Portal.visualise.animations.TemporalExtent();
        for (var i = 0; i < 24; i++) {
            extent.add(moment("2001-01-01T01:00:00.000Z").add('h', i));
        }
        return {
            dataCollection: dataCollection,
            temporalExtent: extent,
            missingDays: [],
            time: extent.min(),
            getTemporalExtent: function() {
                return this.temporalExtent;
            },
            setSubsetExtentView: noOp,
            getSubsetExtentMin: returns(extent.min()),
            getSubsetExtentMax: returns(extent.max())
        };
    }
});
