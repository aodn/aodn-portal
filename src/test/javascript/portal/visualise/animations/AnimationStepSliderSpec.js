/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.visualise.animations.AnimationStepSlider", function() {

    var state = new Portal.visualise.animations.AnimationState();
    var stepSlider;

    beforeEach(function() {
        stepSlider = new Portal.visualise.animations.AnimationStepSlider({
            width : 115
        });
    });

    describe('update for state', function() {
        it('is disabled during loading', function() {
            spyOn(stepSlider, 'disable');
            stepSlider.updateForState(state.LOADING);
            expect(stepSlider.disable).toHaveBeenCalled();
        });

        it('is enabled during playing', function() {
            spyOn(stepSlider, 'enable');
            stepSlider.updateForState(state.PLAYING);
            expect(stepSlider.enable).toHaveBeenCalled();
        });

        it('sets value to zero when removed', function() {
            spyOn(stepSlider, 'setValue');
            stepSlider.updateForState(state.REMOVED);
            expect(stepSlider.setValue).toHaveBeenCalledWith(0);
        });
    });
});
