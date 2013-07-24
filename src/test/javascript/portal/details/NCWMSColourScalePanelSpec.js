/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.details.NCWMSColourScalePanel', function() {
    describe('makeNcWMSColourScale', function() {

        var ncWmsColourScalePanel;
        var layer;

        beforeEach(function() {
            ncWmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();
            layer = {}
        });

        it('no param range', function() {
            ncWmsColourScalePanel.makeNcWMSColourScale(layer);
            expect(ncWmsColourScalePanel.colourScaleMax.getValue()).toBeUndefined();
            expect(ncWmsColourScalePanel.colourScaleMin.getValue()).toBeUndefined();
        });

        it('param range', function() {
            layer.params = {
                COLORSCALERANGE: '2.3,6.7'
            }

            ncWmsColourScalePanel.makeNcWMSColourScale(layer);
            expect(ncWmsColourScalePanel.colourScaleMax.getValue()).toEqual('6.7');
            expect(ncWmsColourScalePanel.colourScaleMin.getValue()).toEqual('2.3');
        });

        it('no param range layer after layer with param range', function() {
            ncWmsColourScalePanel.colourScaleMin.setValue('2');
            ncWmsColourScalePanel.colourScaleMax.setValue('5');

            ncWmsColourScalePanel.makeNcWMSColourScale(layer);
            expect(ncWmsColourScalePanel.colourScaleMax.getValue()).toBeUndefined();
            expect(ncWmsColourScalePanel.colourScaleMin.getValue()).toBeUndefined();
        });

        it('show called', function() {
            spyOn(ncWmsColourScalePanel, 'show');

            ncWmsColourScalePanel.makeNcWMSColourScale(layer);
            expect(ncWmsColourScalePanel.show).toHaveBeenCalled();
        });
    });
});
