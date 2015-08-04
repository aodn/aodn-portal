/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.LayerDetailsPanel", function() {

    var layerDetailsPanel;

    beforeEach(function() {
        spyOn(Portal.details.LayerDetailsPanel.prototype, '_initWithLayer');
        layerDetailsPanel = new Portal.details.LayerDetailsPanel({});
    });
});
