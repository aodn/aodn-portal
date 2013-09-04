Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationSpeedLabel = Ext.extend(Ext.form.Label, {

    constructor: function(config) {
        Portal.visualise.animations.AnimationSpeedLabel.superclass.constructor.call(this, config);
    },

    updateForState: function(state) {
        if (state.isPlaying()) {
            this.setVisible(true);
        }
        else {
            this.setVisible(false);
        }
    }
});