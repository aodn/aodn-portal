Ext.namespace('Portal.filter.ui');

Portal.filter.ui.ALASpeciesFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            autoDestroy: true
        }, cfg);

        Portal.filter.ui.ALASpeciesFilterPanel.superclass.constructor.call(this, config);
    },

    _createControls: function() {

        var resultTpl = new Ext.XTemplate(
            '<tpl for=".">' +
            '<div class="x-combo-list-item">',
            '<div><b><i>Name:</i></b> {name}</div>',
            ' <tpl if="rankString != \'\' ">',
            '  <div><b>Rank:</b> \'{rankString}\'</div>',
            ' </tpl>',
            ' <tpl if="commonName != \'\' ">',
            '  <div><b>Common Name:</b> \'{commonName}\'</div>',
            ' </tpl>',
            '</div>',
            '</tpl>'
        );

        this.jsonStore = new Ext.data.JsonStore({
            url: 'https://bie.ala.org.au/ws/search/auto.json?geoOnly=true', //?q=species_habitats%3A%22Marine%22&
            //url: 'https://bie.ala.org.au/ws/search.json',
            root: 'autoCompleteList',
            idProperty: 'name',
            fields: [
                {name: 'name', type: 'string'},
                {name: 'commonName', type: 'string'},
                {name: 'guid', type: 'string'},
                {name: 'rankString', type: 'string'}
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
                change: this._onSpeciesComboChange
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
                        html: this._getHumanReadableDescriptor(activeFilterData)
                    });
                }
            }
        })
    },

    _getHumanReadableDescriptor: function(item) {
        var commonName = (item.commonName != "") ? String.format("'{0}'", item.commonName) : "";
        return String.format("{0} - {1} {2}", Ext.util.Format.capitalize(item.rankString), item.name, commonName);
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

    handleRemoveFilter: function(activeFilterData) {

        var activeFilterIndex = this.speciesComboItems.indexOf(activeFilterData);

        if (activeFilterIndex != -1) {
            this.speciesComboItems.splice(activeFilterIndex, 1);
            this.speciesFilter.setValue(this.speciesComboItems);
            this.speciesCombo.clearValue();
        }
    },

    _onSpeciesComboChange: function(combo, record) {

        if (record.data != undefined) {

            var s = record.data;

            if (this.speciesComboItems.indexOf(record.data) == -1) {

                this.speciesComboItems.push(record.data);
                this.speciesFilter.setValue(this.speciesComboItems);

                trackFiltersUsage('trackingAlaFilterAction', this.speciesFilter.getHumanReadableForm(), this.dataCollection.getTitle());

                this.activeFiltersContainer.add(this._createNewActiveFilterPanel(record.data));
                this.activeFiltersContainer.show();
                this.activeFiltersContainer.doLayout();
                this.speciesCombo.clearValue();
            }
        }
    }
});
