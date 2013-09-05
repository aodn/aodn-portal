Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationStepSlider = Ext.extend(Ext.slider.SingleSlider, {

    constructor: function(config) {
        Portal.visualise.animations.AnimationStepSlider.superclass.constructor.call(this, config);
    },

    updateForState: function(state) {
        if (state.isLoading()) {
            this.disable();
        }
        else if (state.isPlaying()) {
            this.enable();
        }
        else if (state.isRemoved()) {
            this.setValue(0);
        }
    }
});