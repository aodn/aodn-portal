Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationStepSlider = Ext.extend(Ext.slider.SingleSlider, {

    constructor: function(config) {
        this.state = new Portal.visualise.animations.AnimationState();
        Portal.visualise.animations.AnimationStepSlider.superclass.constructor.call(this, config);
    },

    updateForState: function(state) {
        if (state == this.state.LOADING) {
            this.disable();
        }
        else if (state == this.state.PLAYING) {
            this.enable();
        }
        else if (state == this.state.REMOVED) {
            this.setValue(0);
        }
    }
});