
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.AnimationPanel", function() {

    var animationPanel;

    beforeEach(function() {
        animationPanel = new Portal.ui.AnimationPanel();
    });

    it("test panel hides on map reset", function() {
        spyOn(animationPanel, 'setVisible');

        Ext.MsgBus.publish('reset');

        expect(animationPanel.setVisible).toHaveBeenCalledWith(false);
    });
});