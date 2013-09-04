/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.visualise.animations.AnimationSpeedLabel", function() {

    var state = new Portal.visualise.animations.AnimationState();
    var speedLabel;

    beforeEach(function() {
        speedLabel = new Portal.visualise.animations.AnimationSpeedLabel({
            text: '1x'
        });
    });

    describe('update for state', function() {
        it('is visible when playing', function() {
            spyOn(speedLabel, 'setVisible');
            speedLabel.updateForState(state.PLAYING);
            expect(speedLabel.setVisible).toHaveBeenCalledWith(true);
        });

        it('is not visible when the animation is removed', function() {
            spyOn(speedLabel, 'setVisible');
            speedLabel.updateForState(state.REMOVED);
            expect(speedLabel.setVisible).toHaveBeenCalledWith(false);
        });

        it('is not visible when the animation is loading', function() {
            spyOn(speedLabel, 'setVisible');
            speedLabel.updateForState(state.LOADING);
            expect(speedLabel.setVisible).toHaveBeenCalledWith(false);
        });

        it('is not visible when the animation is paused', function() {
            spyOn(speedLabel, 'setVisible');
            speedLabel.updateForState(state.PAUSED);
            expect(speedLabel.setVisible).toHaveBeenCalledWith(false);
        });
    });
});
