/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.visualise.animations.AnimationPlayButton", function() {

    var state = new Portal.visualise.animations.AnimationState();
    var playButton;

    beforeEach(function() {
        playButton = new Portal.visualise.animations.AnimationPlayButton({});
    });

    describe('update for state', function() {

         it('is enabled when animation is paused', function() {
            spyOn(playButton, 'enable');
            playButton.updateForState(state.setPaused());
        });
    });
});
