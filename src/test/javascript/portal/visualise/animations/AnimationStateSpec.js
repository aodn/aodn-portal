/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.visualise.animations.AnimationState", function() {

    describe('observers', function() {
        it('it calls back to observers on state change', function() {
            var callbackObj = {
                callback: function () {}
            };

            // Set the spy before passing the function through to the object being observed
            spyOn(callbackObj, 'callback');

            var state = new Portal.visualise.animations.AnimationState({
                observers: [
                    { onStateChanged: callbackObj.callback, scope: callbackObj }
                ]
            });

            state.setPlaying();
            expect(callbackObj.callback).toHaveBeenCalled();
        });
    });
});
