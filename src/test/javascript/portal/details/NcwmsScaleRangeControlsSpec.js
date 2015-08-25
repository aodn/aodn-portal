/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.details.NcWmsScaleRangeControls', function() {
    describe('loadScaleFromLayer', function() {

        var controls;
        var layerAdapter;
        var layerSelectionModel;
        var dataCollection;

        beforeEach(function() {

            layerAdapter = {
                getScaleRange: returns({})
            };
            layerSelectionModel = {
                on: noOp
            };

            dataCollection = {
                getLayerAdapter: returns(layerAdapter),
                getLayerSelectionModel: returns(layerSelectionModel)
            };

            controls = new Portal.details.NcWmsScaleRangeControls({
                dataCollection: dataCollection
            });

            spyOn(controls, 'show');
        });

        it('no param range', function() {

            layerAdapter.getScaleRange = returns({});

            controls.loadScaleFromLayer();
            expect(controls.colourScaleMax.getValue()).toBeUndefined();
            expect(controls.colourScaleMin.getValue()).toBeUndefined();
        });

        it('param range', function() {

            layerAdapter.getScaleRange = returns({
                min: '2.3',
                max: '6.7'
            });

            controls.loadScaleFromLayer();
            expect(controls.colourScaleMax.getValue()).toEqual('6.7');
            expect(controls.colourScaleMin.getValue()).toEqual('2.3');
        });

        it('no param range layer after layer with param range', function() {
            controls.colourScaleMin.setValue('2');
            controls.colourScaleMax.setValue('5');

            layerAdapter.getScaleRange = returns({});

            controls.loadScaleFromLayer();
            expect(controls.colourScaleMax.getValue()).toBeUndefined();
            expect(controls.colourScaleMin.getValue()).toBeUndefined();
        });

        it('show called', function() {
            controls.loadScaleFromLayer();
            expect(controls.show).toHaveBeenCalled();
        });
    });
});
