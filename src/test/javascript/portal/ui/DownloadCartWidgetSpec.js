/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.DownloadCartWidget", function() {

    var downloadCartWidget;

    beforeEach(function() {
        downloadCartWidget = new Portal.ui.DownloadCartWidget();
    });

    it('constructs variables', function() {
        expect(downloadCartWidget.downloadCartSize).not.toBeNull();
    });

    it('listens for DATA_COLLECTION_ADDED event', function() {
        spyOn(downloadCartWidget, 'updateDownloadCartSize');
        Ext4.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);
        expect(downloadCartWidget.updateDownloadCartSize).toHaveBeenCalled();

    });

    it('one record is added', function() {
        Ext4.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);
        expect(downloadCartWidget.getCollectionCounterAsString()).toEqual("1");
    });

    it('it clears', function() {
        Ext4.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);
        Ext4.MsgBus.publish(PORTAL_EVENTS.RESET);
        expect(downloadCartWidget.getCollectionCounterAsString()).toEqual("0");
    });

    it('getCollectionCounterAsString returns a string', function() {
        expect(typeof downloadCartWidget.getCollectionCounterAsString()).toEqual("string");
    });

});
