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
    var layerSelectionModel;

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

        layerSelectionModel = new Ext.util.Observable();
        layerSelectionModel.getSelectedLayer = returns(layer);

        dataCollection = {
            getUuid: returns(45678),
            setFilters: jasmine.createSpy('setFilters'),
            getLayerSelectionModel: returns(layerSelectionModel)
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
            expect(ncwmsPanel.dataCollection.setFilters).toHaveBeenCalled();
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
            ncwmsPanel.dataCollection.getLayerSelectionModel().fireEvent('selectedlayerchanged', newLayer);

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

    describe('_ncwmsParamsAsFilters', function() {

        var expectedNcwmsParamsFilter;
        var expectedDateFilterConfig;
        var testDateFilter = {};

        beforeEach(function() {
            expectedNcwmsParamsFilter = {
                isNcwmsParams: true/*,
                hasValue: function() { return false; }*/
            };

            expectedDateFilterConfig = {
                name: 'time',
                value: {},
                visualised: true
            };

            spyOn(Portal.filter, 'DateFilter').andReturn(testDateFilter);
        });

        it('updated start date', function() {

            var testStartDate = moment();

            var returnValue = ncwmsPanel._ncwmsParamsAsFilters(testStartDate, moment('invalid date'), null);

            expectedNcwmsParamsFilter.dateRangeStart = testStartDate;
            expectedDateFilterConfig.value.fromDate = testStartDate.toDate();

            delete returnValue[1].hasValue; // Remove function so it isn't compared against
            expect(Portal.filter.DateFilter).toHaveBeenCalledWith(expectedDateFilterConfig);
            expect(returnValue).toEqual([
                testDateFilter,
                expectedNcwmsParamsFilter
            ]);
        });

        it('updated end date', function() {

            var testEndDate = moment();

            var returnValue = ncwmsPanel._ncwmsParamsAsFilters(moment('invalid date'), testEndDate, null);

            expectedNcwmsParamsFilter.dateRangeEnd = testEndDate;
            expectedDateFilterConfig.value.toDate = testEndDate.toDate();

            delete returnValue[1].hasValue; // Remove function so it isn't compared against
            expect(Portal.filter.DateFilter).toHaveBeenCalledWith(expectedDateFilterConfig);
            expect(returnValue).toEqual([
                testDateFilter,
                expectedNcwmsParamsFilter
            ]);
        });

        it('update geometry', function() {

            var returnValue = ncwmsPanel._ncwmsParamsAsFilters(null, null, {
                getBounds: returns({
                    bottom: 4,
                    left: 3,
                    top: 2,
                    right: 1
                })
            });

            expectedNcwmsParamsFilter.latitudeRangeStart = 4;
            expectedNcwmsParamsFilter.longitudeRangeStart = 3;
            expectedNcwmsParamsFilter.latitudeRangeEnd = 2;
            expectedNcwmsParamsFilter.longitudeRangeEnd = 1;

            expect(Portal.filter.DateFilter).toHaveBeenCalledWith(expectedDateFilterConfig);
            expect(returnValue[0]).toEqual(
                testDateFilter,
                expectedNcwmsParamsFilter
            );
         });
    });

    describe('resetting extents', function() {
        beforeEach(function() {
            spyOn(ncwmsPanel, '_applyFilterValuesFromMap');

            ncwmsPanel._resetExtent();
        });

        it('applies filters with reset values', function() {
            expect(ncwmsPanel._applyFilterValuesFromMap).toHaveBeenCalled();
        });
    });

    function _applyCommonSpies() {
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
