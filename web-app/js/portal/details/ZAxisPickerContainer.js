Ext.namespace('Portal.details');

Portal.details.ZAxisPickerContainer = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        // todo onselected layer change

        var config = Ext.apply({}, cfg);

        Portal.details.ZAxisPickerContainer.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.ZAxisPickerContainer.superclass.initComponent.call(this);
        this._addZAxisControls();
    },

    _addZAxisControls: function() {

        this.zAxisPickerTitle = OpenLayers.i18n('zAxisLabel');

        this.zAxisPickerStore = new Ext.data.ArrayStore({
            fields: [
                {name: this.zAxisPickerTitle, type: "integer"}
            ],
            expandData: true
        });

        this.zAxisFromPicker = this._getNewZaxisPicker(OpenLayers.i18n('fromLabelText'));
        this.zAxisToPicker = this._getNewZaxisPicker(OpenLayers.i18n('toLabelText'));

        this._resetZAxisPickersLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('clearLinkLabel', {text: String.format(OpenLayers.i18n('resetLabelText'), "Vertical slice")}),
            cls: 'clearFiltersLink',
            iconCls: 'small resetText',
            listeners: {
                scope: this,
                'click': this.resetZAxisFilters
            }
        });

        this.add(
            new Ext.Container({
                html: String.format("<h4>{0}</h4>", this.zAxisPickerTitle)
            }),
            new Portal.common.CommonHBoxRowPanel({
                label: OpenLayers.i18n('toLabelText'),
                field: this.zAxisFromPicker
            }),
            new Portal.common.CommonHBoxRowPanel({
                label: OpenLayers.i18n('toLabelText'),
                field: this.zAxisToPicker
            }),
            this._resetZAxisPickersLink,
            new Ext.Spacer({height: 30})
        );
    },

    _getNewZaxisPicker: function(name) {
        return new Ext.form.ComboBox({
            comboName: name,
            parentScope: this,
            dataCollection: this.dataCollection,
            triggerAction: 'all',
            editable: false,
            displayField: this.zAxisPickerTitle,
            mode: "local",
            width: 100,
            store: this.zAxisPickerStore,
            validator: this.zAxisValidator,
            listeners: {
                scope: this,
                beforequery: function(combo) {
                    // Stop filtering on selection
                    this.lastQuery = null;
                    combo.query = '';
                    return true;
                },
                'select': function(combo) {
                    this.parent.setZAxisValues(combo);
                },
                'render': function(combo) {
                    this.setZAxisComboDefaultValues(combo);
                }
            }
        });
    },

    zAxisValidator: function() {

        this.parentScope.zAxisFromPicker.clearInvalid();
        this.parentScope.zAxisToPicker.clearInvalid();

        if (this.parentScope.zAxisFromPicker.getValue() != undefined && this.parentScope.zAxisToPicker.getValue() != undefined) {

            var start = parseFloat(this.parentScope.zAxisFromPicker.getValue());
            var end = parseFloat(this.parentScope.zAxisToPicker.getValue());

            if (start < end) {
                return String.format(OpenLayers.i18n('elevationLogicalError'), start, end);
            }
        }
        return true;
    },

    setZAxisComboDefaultValues: function(combo) {

        var fromVal = this.zAxisPickerStore.getRange()[0].data[this.zAxisPickerTitle].valueOf();
        var lastItem = this.zAxisPickerStore.getRange().length - 1;
        var toVal = this.zAxisPickerStore.getRange()[lastItem].data[this.zAxisPickerTitle].valueOf();

        var value = (combo.comboName == OpenLayers.i18n('fromLabelText')) ? fromVal : toVal;
        combo.setValue(value);

        this.lastSelectedZAxisValue = fromVal;
        this.parent._updateTimeRangeLabel();
    },

    getZAxisPickerValues: function() {

        if (this._isZAxisFilterAvailable()) {

            if (this.layer.extraLayerInfo) {

                var multiplier = (this.layer.extraLayerInfo.zaxis.positive === false) ? -1 : 1;

                return [this.zAxisFromPicker.getValue() * multiplier,
                    this.zAxisToPicker.getValue() * multiplier
                ];
            }
        }
    },

    resetZAxisFilters: function() {
        this.zAxisFromPicker.reset();
        this.zAxisToPicker.reset();
        this.layer.setZAxis();
        this.parent._applyFilterValuesToCollection();
    },

    _isZAxisFilterAvailable: function() {
        return (
            !this.hidden &&
            this.zAxisFromPicker.isValid() && this.zAxisFromPicker.isValid() &&
            this.zAxisFromPicker.getValue() != undefined && this.zAxisToPicker.getValue() != undefined
        );
    }

});