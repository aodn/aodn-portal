Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationSpeedLabel = Ext.extend(Ext.form.Label, {

    constructor: function(config) {
        this.state = new Portal.visualise.animations.AnimationState();
        Portal.visualise.animations.AnimationSpeedLabel.superclass.constructor.call(this, config);
    },

    updateForState: function(state) {
        if (state == this.state.PLAYING) {
            this.setVisible(true);
        }
        else {
            this.setVisible(false);
        }
    }
});