describe("Portal.common.DownloadCart", function() {
    beforeEach(function () {
        Ext.getBody().insertHtml('beforeEnd', '<div id="downloadCart">Download cart: <b><span id="downloadCartSize">0</span></b> item(s)</div>');
    });
    
    afterEach(function () {
        var element = Ext.get('downloadCart');
        if ( element ) element.remove();
    });
    
    describe("sadfsadf1111", function() {

    it('sadf', function() {
        expect(0).toEqual(1);
        });
    });
    
    describe("sadfsadf2222", function() {

    it('sadf', function() {
        expect(0).toEqual(2);
        });
    });
});