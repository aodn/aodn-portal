Ext.namespace('Portal.utils');

Portal.utils.ObservableUtils = {
    FUNCTIONS_TO_FORWARD: [
        'addEvents',
        'addListener',
        'enableBubble',
        'fireEvent',
        'hasListener',
        'on',
        'purgeListeners',
        'relayEvents',
        'removeListener',
        'resumeEvents',
        'suspendEvents',
        'un'
    ],

    makeObservable: function(target) {
        target._observable = new Ext.util.Observable();

        Ext.each(this.FUNCTIONS_TO_FORWARD, function(funcName) {

            target[funcName] = function() {
                return this._observable[funcName].apply(target._observable, arguments);
            };
        });
    }
};
