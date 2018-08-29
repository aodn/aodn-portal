Ext.namespace('Portal.filter.ui');

Portal.filter.ui.AlaSpeciesFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            typeLabel: OpenLayers.i18n('alaSpeciesOccuranceHeading'),
            autoDestroy: true
        }, cfg);

        Portal.filter.ui.AlaSpeciesFilterPanel.superclass.constructor.call(this, config);
    },

    _createControls: function() {

        var resultTpl = new Ext.XTemplate(
            '<tpl for=".">' +
            '<div class="x-combo-list-item alafilter">',
            '<div>{highlight}</div>',
            ' <tpl if="rawRank != \'\' ">',
            '  <div><b>Most specific rank:</b> {[this.decapitalise(values.rawRank)]}</div>',
            ' </tpl>',
            ' <tpl if="classs != \'\' ">',
            '  <div><b>Class:</b> {classs}</div>',
            ' </tpl>',
            ' <tpl if="phylum != \'\' ">',
            '  <div><b>Phylum:</b> {phylum}</div>',
            ' </tpl>',
            '</div>',
            '</tpl>',
            {
                decapitalise: function(title) {
                    return title.toLowerCase();
                }
            }
        );

        this.jsonStore = new Ext.data.JsonStore({
            url: 'proxy?', // portal proxy controller
            root: "searchResults.results",
            idProperty: 'guid',
            baseParams : {
                fq: Portal.app.appConfig.ala.index, // ALA index for marine only
                url: Portal.app.appConfig.ala.url,
                pageSize: 10000
            },
            fields: [
                {name: 'name', type: 'string'},
                {name: 'highlight', type: 'string'},
                {name: 'guid', type: 'string'},
                {name: 'phylum', type: 'string'},
                {name: 'classs', type: 'string'},
                {name: 'rawRank', type: 'string'},
                {name: 'commonNameSingle', type: 'string'}
            ]
        });

        this.speciesCombo = new Ext.form.ComboBox({
            triggerAction: 'all',
            mode: 'remote',
            emptyText: 'Select a Species...',
            hideTrigger: true,
            typeAhead: false,
            forceSelection: true,
            width: this.MAX_COMPONENT_WIDTH,
            queryParam: 'q',
            minChars: 2,
            lastQuery: '',
            tpl: resultTpl,
            tplWriteMode: "applyTemplate",
            store: this.jsonStore,
            valueField: 'guid',
            displayField: 'name',
            listeners: {
                scope: this,
                select: this._onSpeciesComboChange,
                change: this._onSpeciesComboChange,
                blur: this._onBlur
            }
        });

        this.add(this.speciesCombo);
        this.add(this._createVerticalSpacer(10));

        this.activeFiltersContainer = new Ext.Panel({
            width: this.MAX_COMPONENT_WIDTH,
            items: [
                new Ext.form.Label({
                    html: "<i>Selected species filters</i>"
                })
            ],
            hidden: true,
            listeners: {
                scope: this,
                remove: this._onRemoveActiveFilter
            }
        });

        this.add(this.activeFiltersContainer);
        this.speciesComboItems = [];
    },

    _onBlur: function(combo) {
        combo.clearValue();
        this._clearFilter(combo.activeFilterData);
    },

    _createNewActiveFilterPanel: function(activeFilterData) {

        return new Ext.Panel({
            title: activeFilterData.name,
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
        this.handleRemoveFilter(panel.activeFilterData);
        panel.destroy(); // triggers _onRemoveActiveFilter
    },

    _onRemoveActiveFilter: function() {
        // hide when no activefilters only label
        if (this.activeFiltersContainer.items.length == 1) {
            this.activeFiltersContainer.hide();
        }
    },

    needsFilterRange: function() {
        return false;
    },

    _clearFilter: function(activeFilterData) {
        var activeFilterIndex = this.speciesComboItems.indexOf(activeFilterData);

        if (activeFilterIndex != -1) {
            this.speciesComboItems.splice(activeFilterIndex, 1);
            this.filter.setValue(this.speciesComboItems);
            this.speciesCombo.clearValue();
        }
    },

    _onSpeciesComboChange: function(combo, record) {
        if (record.data != undefined) {

            if (this.speciesComboItems.indexOf(record.data) == -1) {

                this.speciesComboItems.push(record.data);
                this.filter.setValue(this.speciesComboItems);

                trackFiltersUsage('trackingAlaFilterAction', this.filter.getHumanReadableForm(), this.dataCollection.getTitle());

                this.activeFiltersContainer.add(this._createNewActiveFilterPanel(record.data));
                this.activeFiltersContainer.show();
                this.activeFiltersContainer.doLayout();
                this.speciesCombo.clearValue();
            }
        }
    },

    handleRemoveFilter: function() {
        var that = this;
        Ext.each(this.activeFiltersContainer.items.items, function(panel) {
            if (panel.activeFilterData != undefined) {
                that._clearFilter(panel.activeFilterData);
                panel.destroy();
            }
        });
    }
});