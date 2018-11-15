Ext.namespace('Portal.filter.ui');

Portal.filter.ui.MultiStringFilterPanel = Ext.extend(Portal.filter.ui.ComboFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            typeLabel: OpenLayers.i18n("generalFilterHeading"),
            autoDestroy: true
        }, cfg);

        Portal.filter.ui.MultiStringFilterPanel.superclass.constructor.call(this, config);
    },

    _createControls: function() {
        this._addLabel();

        var resultTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="x-combo-list-item stringFilterResult">',
            '<div class="filterTpl">{text}</div>',
            '</div>',
            '</tpl>'
        );

        this.combo = new Ext.form.ComboBox({
            emptyText: OpenLayers.i18n('clearFilterOption'),
            disabled: true,
            triggerAction: 'all',
            mode: 'local',
            typeAhead: true,
            forceSelection: true,
            validator: this.validateValue,
            width: this.MAX_COMPONENT_WIDTH,
            editable: true,
            tpl: resultTpl,
            tplWriteMode: "applyTemplate",
            store: new Ext.data.ArrayStore({
                fields: [
                    'text'
                ],
                data: []
            }),
            valueField: 'text',
            displayField: 'text',
            listeners: {
                scope: this,
                select: this._onChange,
                change: this._onChange,
                blur: this._onBlur
            }
        });
        this.add(this.combo);
        this.add(this._createVerticalSpacer(10));

        this.activeFiltersContainer = new Ext.Panel({
            cls: "activeFiltersContainer",
            width: this.MAX_COMPONENT_WIDTH,
            items: [
                new Ext.form.Label({
                    html: String.format("<i>{0} {1}</i>", this.filter.getLabel(), OpenLayers.i18n("multiFilterSelectionHeading"))
                })
            ],
            hidden: true,
            listeners: {
                scope: this,
                remove: this._onRemoveActiveFilter
            }
        });

        this.add(this.activeFiltersContainer);
        this.stringItems = [];
    },

    _onBlur: function(combo) {
        combo.clearValue();
    },

    _createNewActiveFilterPanel: function(activeFilterData) {

        return new Ext.Panel({
            title: activeFilterData.text,
            activeFilterData: activeFilterData,
            toolTemplate: new Ext.XTemplate(
                '<tpl>',
                '<div style="float: right;" class="fa fa-close">&#160;</div>',
                '</tpl>'
            ),
            tools: [
                {
                    id: "close",
                    qtip: "Remove this filter",
                    cls: 'fa fa-close',
                    scope: this,
                    handler: this._removeOnClick
                }
            ],
            listeners: {

                scope: this,
                render: function(thisPanel) {
                    new Ext.ToolTip({
                        target: thisPanel.header,
                        html: this.filter.getHumanReadableDescriptor(activeFilterData)
                    });
                }
            }
        });
    },

    _removeOnClick: function(event, toolEl, panel) {
        this.handleRemoveFilter(panel);
    },

    _onRemoveActiveFilter: function() {
        // hide when no activefilters only label
        if (this.activeFiltersContainer.items.length == 1) {
            this.activeFiltersContainer.hide();
        }
    },

    _clearFilter: function(activeFilterData) {
        var activeFilterIndex = this.stringItems.indexOf(activeFilterData);

        if (activeFilterIndex != -1) {
            this.stringItems.splice(activeFilterIndex, 1);
            this.filter.setValue(this.stringItems);
            this.combo.clearValue();
        }
    },

    _onChange: function(combo, record) {

        if (this.combo.getValue() === this.combo.emptyText) {
            // 'All' chosen. clear it all out
            this.handleRemoveFilter();
        }
        else if (this.combo.getValue() !== "" && record.data != undefined) {
            if (this.stringItems.indexOf(record.data) == -1) {

                this.stringItems.push(record.data);
                this.filter.setValue(this.stringItems);

                trackFiltersUsage('trackingFilterAction', this.filter.getHumanReadableForm(), this.dataCollection.getTitle());

                this.activeFiltersContainer.add(this._createNewActiveFilterPanel(record.data));
                this.activeFiltersContainer.show();
                this.activeFiltersContainer.doLayout();
                this.combo.clearValue();
            }
        }
    },

    handleRemoveFilter: function(targetedPanel) {

        var deadPanels = [];
        Ext.each(this.activeFiltersContainer.items.items, function(item) {

            if (targetedPanel) {
                if (item.activeFilterData == targetedPanel.activeFilterData) {
                    deadPanels.push(item);
                }
            }
            else if(item.activeFilterData != undefined) {
                deadPanels.push(item)
            }

        }, this);


        Ext.each(deadPanels, function(panel) {
            this._clearFilter(panel.activeFilterData);
            panel.destroy(); // triggers _onRemoveActiveFilter
        }, this);
    }

});
