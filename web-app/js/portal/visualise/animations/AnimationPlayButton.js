Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationPlayButton = Ext.extend(Ext.Button, {

    constructor: function(config) {
        Portal.visualise.animations.AnimationPlayButton.superclass.constructor.call(this, config);
    },

    updateForState: function(state) {
        if (state.isPlaying()) {
            this.setIconClass('pauseButton');
            this.setTooltip(OpenLayers.i18n('pause'));
        } else {
            this.setIconClass('playButton');
            this.setTooltip(OpenLayers.i18n('play'));
        }
    }
});
