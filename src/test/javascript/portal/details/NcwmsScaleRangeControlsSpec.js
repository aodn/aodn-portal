/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.details.NcwmsScaleRangeControls', function() {
    describe('makeNcWMSColourScale', function() {

        var controls;
        var layer;

        beforeEach(function() {
            controls = new Portal.details.NcwmsScaleRangeControls();
            layer = {};
        });

        it('no param range', function() {
            controls.makeNcWMSColourScale(layer);
            expect(controls.colourScaleMax.getValue()).toBeUndefined();
            expect(controls.colourScaleMin.getValue()).toBeUndefined();
        });

        it('param range', function() {
            layer.params = {
                COLORSCALERANGE: '2.3,6.7'
            };

            controls.makeNcWMSColourScale(layer);
            expect(controls.colourScaleMax.getValue()).toEqual('6.7');
            expect(controls.colourScaleMin.getValue()).toEqual('2.3');
        });

        it('no param range layer after layer with param range', function() {
            controls.colourScaleMin.setValue('2');
            controls.colourScaleMax.setValue('5');

            controls.makeNcWMSColourScale(layer);
            expect(controls.colourScaleMax.getValue()).toBeUndefined();
            expect(controls.colourScaleMin.getValue()).toBeUndefined();
        });

        it('show called', function() {
            spyOn(controls, 'show');

            controls.makeNcWMSColourScale(layer);
            expect(controls.show).toHaveBeenCalled();
        });
    });
});
