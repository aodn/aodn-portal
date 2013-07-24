/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.details.NCWMSColourScalePanel', function() {
    describe('makeNcWMSColourScale', function() {
        it('no param range', function() {
            var ncWmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();

            var layer = {}
            ncWmsColourScalePanel.makeNcWMSColourScale(layer);

            expect(ncWmsColourScalePanel.colourScaleMax.getValue()).toBeUndefined();
            expect(ncWmsColourScalePanel.colourScaleMin.getValue()).toBeUndefined();
        });

        it('param range', function() {
            var ncWmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();

            var layer = {
                params: {
                    COLORSCALERANGE: '2.3,6.7'
                }
            }
            ncWmsColourScalePanel.makeNcWMSColourScale(layer);

            expect(ncWmsColourScalePanel.colourScaleMax.getValue()).toEqual('6.7');
            expect(ncWmsColourScalePanel.colourScaleMin.getValue()).toEqual('2.3');
        });

        it('no param range layer after layer with param range', function() {

            var ncWmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();
            ncWmsColourScalePanel.colourScaleMin.setValue('2');
            ncWmsColourScalePanel.colourScaleMax.setValue('5');

            var layer = {}
            ncWmsColourScalePanel.makeNcWMSColourScale(layer);

            expect(ncWmsColourScalePanel.colourScaleMax.getValue()).toBeUndefined();
            expect(ncWmsColourScalePanel.colourScaleMin.getValue()).toBeUndefined();
        });

        it('show called', function() {
            var ncWmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();
            spyOn(ncWmsColourScalePanel, 'show');

            var layer = {}
            ncWmsColourScalePanel.makeNcWMSColourScale(layer);

            expect(ncWmsColourScalePanel.show).toHaveBeenCalled();

        });
    });
});
