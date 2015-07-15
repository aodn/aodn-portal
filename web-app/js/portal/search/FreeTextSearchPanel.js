/*
 * Copyright 2015 IMOS
 * Originally written by Mark Hepburn for IMAS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FreeTextSearchPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        cfg = cfg || {};

        if (cfg.title) {
            cfg.title = '<span class="filter-selection-panel-header">' + cfg.title + '</span>';
        }

        var defaults = {
            collapsible: true,
            collapsed: false,
            titleCollapse: true
        };

        Ext4.apply(this, cfg, defaults);

        var config = Ext4.apply({
            layout: 'form',
            cls: 'search-filter-panel filter-selection-panel',
            items: [{
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    style: {
                        padding: '2px',
                        margin: '2px'
                    }
                },
                items: [ this.searchField = new Ext.form.TextField({
                        flex: 1,
                        enableKeyEvents: true
                    }), this.goButton = new Ext.Button({
                        text: OpenLayers.i18n("goButton"),
                        width: 65,
                        disabled: false
                }), this.clearButton = new Ext.Button({
                        text: OpenLayers.i18n("clearButton"),
                        width: 65,
                        disabled: false
                })]
            }]
        }, cfg, defaults);

        Portal.search.FreeTextSearchPanel.superclass.constructor.call(this, config);

        this.mon(this.goButton, 'click', this.onGo, this);
        this.mon(this.clearButton, 'click', this.clearSearch, this);
        this.mon(this.searchField, 'keyup', this.onSearchChange, this);
    },

    initComponent: function() {
        Portal.search.FreeTextSearchPanel.superclass.initComponent.apply(this, arguments);
    },

    onGo: function() {
        this.searcher.removeFilters('any');
        this.searcher.addFilter('any', this.searchField.getRawValue());
        this.searcher.search();
    },

    clearSearch: function() {
        this.searchField.setRawValue('');
        this.onGo();
    },

    onSearchChange: function(_field, event) {
        if (event.getKey() === event.ENTER) {
            this.onGo();
        }
    },

    removeAnyFilters: function() {
        this.collapse();
    }
});
