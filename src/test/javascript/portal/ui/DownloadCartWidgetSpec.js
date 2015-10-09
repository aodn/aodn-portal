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
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);
        expect(downloadCartWidget.updateDownloadCartSize).toHaveBeenCalled();
    });

    it('one record is added', function() {
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);
        expect(downloadCartWidget.getCollectionCounterAsString()).toEqual("1");
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);
        expect(downloadCartWidget.getCollectionCounterAsString()).toEqual("2");
    });

    it('record is removed', function() {
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);
        expect(downloadCartWidget.getCollectionCounterAsString()).toEqual("1");
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED);
        expect(downloadCartWidget.getCollectionCounterAsString()).toEqual("0");
    });

    it('getCollectionCounterAsString returns a string', function() {
        expect(typeof downloadCartWidget.getCollectionCounterAsString()).toEqual("string");
    });
});
