/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.visualise.animations.AnimationSpeedButton", function() {

    var state = new Portal.visualise.animations.AnimationState({});
    var speedButton;

    beforeEach(function() {
        speedButton = new Portal.visualise.animations.AnimationSpeedButton({});
    });

    describe('update for state', function() {
        it('is disabled during loading', function() {
            spyOn(speedButton, 'disable');
            speedButton.updateForState(state.setLoading());
            expect(speedButton.disable).toHaveBeenCalled();
        });
    });
});
