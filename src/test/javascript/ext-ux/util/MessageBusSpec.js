describe("Ext.ux.util.MessageBus", function() {
    
    it("subscribe", function() {
        expect(Ext.ux.util.MessageBus.subscribe("subject", function () {}, this)).toEqual(true);
    });
    
    it("publish", function() {
        
        var listenerCalled = false;
        Ext.ux.util.MessageBus.subscribe("subject", function () {
            listenerCalled = true;
        }, this);
        
        Ext.ux.util.MessageBus.publish("subject");
        
        expect(listenerCalled).toEqual(true);
    });
    
    it("alias", function() {
        var listenerCalled = false;
        Ext.MsgBus.subscribe("subject", function () {
            listenerCalled = true;
        }, this);
        
        Ext.MsgBus.publish("subject");
        
        expect(listenerCalled).toEqual(true);
    });
});