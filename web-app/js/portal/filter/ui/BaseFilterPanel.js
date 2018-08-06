Ext.namespace('Portal.filter.ui');

/**
   This is the base type of all filters for geoserver layers.
**/
Portal.filter.ui.BaseFilterPanel = Ext.extend(Ext.Panel, {

    MAX_COMPONENT_WIDTH: 300,

    constructor: function(cfg) {
        var config = Ext.apply({
            typeLabel: OpenLayers.i18n('generalFilterHeading'),
            listeners: {
                beforeremove: function() {
                    this.removeAll(true);
                }
            }
        }, cfg);

        Ext.apply(this, cfg);

        Portal.filter.ui.BaseFilterPanel.superclass.constructor.call(this, config);

        this._createControls();
    },

    _createVerticalSpacer: function(sizeInPixels) {
        return new Ext.Spacer({
            cls: 'block',
            height: sizeInPixels
        });
    },

    _createControls: function() {
        throw "Subclasses must implement the _createControls function";
    },

    handleRemoveFilter: function() {
        throw "Subclasses must implement the handleRemoveFilter function";
    },

    needsFilterRange: function() {
        throw "Subclasses must implement the needsFilterRange function";
    },

    setFilterRange: function() {
        throw "Subclasses must implement the setFilterRange function if needsFilterRange() returns true";
    },

    _addLabel: function() {
        this.add(new Ext.form.Label({
            html: this.filter.getLabel()
        }));
    }
});
