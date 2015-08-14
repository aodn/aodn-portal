/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.details.NcwmsScaleRangeControls', function() {
    describe('loadScaleFromLayer', function() {

        var controls;
        var layerState = {};
        var dataCollection;

        beforeEach(function() {

            spyOn(Ext.MsgBus, 'subscribe');

            dataCollection = {
                getLayerState: returns(layerState)
            };

            controls = new Portal.details.NcwmsScaleRangeControls({
                dataCollection: dataCollection
            });

            spyOn(controls, 'show');
        });

        it('no param range', function() {

            layerState.getScaleRange = returns({});

            controls.loadScaleFromLayer();
            expect(controls.colourScaleMax.getValue()).toBeUndefined();
            expect(controls.colourScaleMin.getValue()).toBeUndefined();
        });

        it('param range', function() {

            layerState.getScaleRange = returns({
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

            layerState.getScaleRange = returns({});

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
