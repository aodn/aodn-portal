Ext.namespace('Portal.utils');

Portal.utils.ObservableUtils = {
    FUNCTIONS_TO_FORWARD: ['on', 'un', 'fireEvent'],

    makeObservable: function(target) {
        target._observable = new Ext.util.Observable();

        Ext.each(this.FUNCTIONS_TO_FORWARD, function(funcName) {

            target[funcName] = function() {
                return this._observable[funcName].apply(target._observable, arguments);
            };
        });
    }
};
