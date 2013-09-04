Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationSpeedButton = Ext.extend(Ext.Button, {

    constructor: function(config) {
        this.state = new Portal.visualise.animations.AnimationState();
        Portal.visualise.animations.AnimationSpeedButton.superclass.constructor.call(this, config);
    },

    updateForState: function(state) {
        if (state == this.state.LOADING) {
            this.disable();
        }
    }
});