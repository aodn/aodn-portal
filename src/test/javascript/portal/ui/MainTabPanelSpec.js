
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.MainTabPanel", function() {
    var mockConfig = {};
    var mockSearchTabPanel = {};
    var mockPortalPanel = {
        getMapPanel: function() {return { _closeFeatureInfoPopup: function() {}};}
    };
    var mockHomePanel = {};
    
    var buildMockMainTabPanel = function() {
        spyOn(Portal.ui, "PortalPanel").andReturn(mockPortalPanel);
        spyOn(Portal.ui, "HomePanel").andReturn(mockHomePanel);
        spyOn(Portal.search, "SearchTabPanel").andReturn(mockSearchTabPanel);
        spyOn(Portal.ui.MainTabPanel.superclass.constructor, "call");
        spyOn(Portal.ui.MainTabPanel.prototype, "mon");
        spyOn(Portal.ui.MainTabPanel.prototype, "on");

        return new Portal.ui.MainTabPanel({appConfig: mockConfig});
    };

    var mainTabPanel;

    beforeEach(function() {
        mainTabPanel = buildMockMainTabPanel();
        mainTabPanel.items = [];
    });
    
    it("creates map, search and portal panels and monitors search panel layeradd events on instantiation", function() {
        
        expect(Portal.ui.PortalPanel).toHaveBeenCalled();
        expect(Portal.ui.HomePanel).toHaveBeenCalled();
        expect(Portal.search.SearchTabPanel).toHaveBeenCalled();
        expect(Portal.ui.MainTabPanel.superclass.constructor.call).toHaveBeenCalled();
        expect(mainTabPanel.portalPanel).toEqual(mockPortalPanel);
        expect(mainTabPanel.homePanel).toEqual(mockHomePanel);
        expect(mainTabPanel.searchTabPanel).toEqual(mockSearchTabPanel);
        expect(Portal.ui.MainTabPanel.prototype.on).toHaveBeenCalled();
    });

    it('doLayout called during setActiveTab', function() {
        spyOn(mainTabPanel, 'doLayout');
        mainTabPanel.setActiveTab(new Ext.Panel());
        expect(mainTabPanel.doLayout).toHaveBeenCalledWith(false, true);
    });
});
