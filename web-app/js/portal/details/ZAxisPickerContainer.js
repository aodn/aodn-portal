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

        this.zAxisPickerTitle = OpenLayers.i18n('zAxisLabelPositiveDown');

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

        this.zAxisPickerTitleContainer = new Ext.Container({
            html: this.formatZAxisPickerTitle(this.zAxisPickerTitle)
        });

        this.add(
            this.zAxisPickerTitleContainer,
            new Portal.common.CommonHBoxRowPanel({
                label: OpenLayers.i18n('fromLabelText'),
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

    formatZAxisPickerTitle: function(title) {
        return String.format("<h4>{0}</h4>", title);
    },

    updateTitleContainer: function(label) {
        this.zAxisPickerTitleContainer.update(this.formatZAxisPickerTitle(label));
    },

    zAxisValidator: function() {

        this.parentScope.zAxisFromPicker.clearInvalid();
        this.parentScope.zAxisToPicker.clearInvalid();

        if (this.parentScope.zAxisFromPicker.getValue() != undefined && this.parentScope.zAxisToPicker.getValue() != undefined) {

            var minDepth = parseFloat(this.parentScope.zAxisFromPicker.getValue());
            var maxDepth = parseFloat(this.parentScope.zAxisToPicker.getValue());

            if (minDepth > maxDepth) {
                return String.format(OpenLayers.i18n('elevationLogicalError'), minDepth, maxDepth);
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
                return [this.zAxisFromPicker.getValue(),
                    this.zAxisToPicker.getValue()
                ];
            }
        }
    },

    resetZAxisFilters: function() {
        this.zAxisFromPicker.reset();
        this.zAxisToPicker.reset();
        this.layer.setZAxis();
        this.parent.lastSelectedZAxisValue = undefined;
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