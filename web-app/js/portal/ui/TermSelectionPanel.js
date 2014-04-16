/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.TermSelectionPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        cfg = cfg || {};

        this.titleText = cfg.title;
        if (cfg.title) cfg.title = '<span class="term-selection-panel-header">' + cfg.title + '</span>';

        if (!cfg.separator)
            cfg.separator = "|";

        var defaults = {
            collapsible: true,
            collapsed: true,
            titleCollapse: true
        };

        Ext.apply(this, cfg, defaults);

        this.collapsedByDefault = this.collapsed;

        this.selectionStore = this._buildSelectionStore(this.hierarchical, this.separator);
        this.termStore = new Portal.data.TopTermStore({
            separator: this.separator,
            titleText: this.titleText
        });
        this.selectedView = this._buildSelectedView(this.selectionStore);
        this.filterView = this._buildFilterView(this.termStore);
        this.toggleAllLink = this._buildToggleAll(this.termStore);

        var config = Ext.apply({
            layout:'form',
            cls:'search-filter-panel term-selection-panel',
            items:[
                this.selectedView,
                this.filterView,
                {
                    xtype:'container',
                    layout:'hbox',
                    items:[
                        {xtype:'spacer', flex:1},
                        this.toggleAllLink,
                        {xtype:'spacer', width:5}
                    ]
                }
            ]
        }, cfg, defaults);

        this.addEvents('contentchange');
        this.enableBubble('contentchange');

        Portal.ui.TermSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.filterView, 'click', this._onFilterClick, this);
        this.mon(this.selectedView, 'filterremoved', this._onFilterRemoved, this);
        this.mon(this.selectedView, 'searchinvalidated', this._onSearchInvalidated, this);

        this.mon(this.searcher, 'searchcomplete', this._loadStore, this);
        this.mon(this.searcher, 'summaryOnlySearchComplete', this._loadStore, this);
    },

    initComponent: function () {
        Portal.ui.TermSelectionPanel.superclass.initComponent.apply(this, arguments);
        this.on('afterrender', function () {
            this.on('collapse', this._onCollapsedChange, this);
            this.on('expand', this._onCollapsedChange, this);
        }, this);

    },

    // Builders

    _buildSelectionStore: function (hierarchical, separator) {
        return new Ext.data.ArrayStore({
            hierarchical:hierarchical,
            fields:['selection'],
            separator:separator,
            getFilterValue: function () {
                if (this.hierarchical) {
                    var result = new Array();
                    this.each(function (rec) {
                        result.push(rec.get('selection'));
                    });
                    return result.join(this.separator);
                }
                else {
                    return this.getCount() == 0 ? "" : this.getAt(0).get('selection');
                }
            },
            setFilterValue: function (filter) {
                if (this.hierarchical) {
                    var values = filter.split(this.separator);
                    var data = new Array();
                    Ext.each(values, function (value) {
                        data.push([value]);
                    });
                    this.loadData(data);
                }
                else {
                    if (filter == "") {
                        this.removeAll();
                    }
                    else {
                        this.loadData([
                            [filter]
                        ]);
                    }
                }
            }
        });
    },

    _buildSelectedView: function (selectionStore) {
        var viewTpl = new Ext.XTemplate(
            '<tpl if="xcount &gt; 0">',
            '<div class="p-selected-view">',
            '<tpl for=".">',
            '<div class="p-selection-wrap">',
            '<input type="checkbox" checked="true">{selection}',
            '</div>',
            '</tpl>',
            '</div>',
            '</tpl>'
        );

        var selectedView = new Ext.DataView({
            store:selectionStore,
            tpl:viewTpl,
            autoHeight:true,
            itemSelector:'.p-selection-wrap',
            onSelectionsRendered: function () {
                var options = {
                    delegate:'.p-selection-clear'
                };

                this.getEl().on('click', this.onRemoveLast, this, options);
            },
            onSelectionClick: function (view, index) {
                this.deleteFrom(index, true);
            },

            onRemoveLast: function () {
                this.deleteFrom(this.getStore().getCount() - 1, true);
            },

            clear: function () {
                this.deleteFrom(0, false);
            },

            deleteFrom: function (index, searchAfterwards) {
                var store = this.getStore();
                var clearRecs = store.getRange(index, store.getCount() - 1);
                store.remove(clearRecs);
                this.fireEvent('filterremoved');

                if (searchAfterwards) {
                    this.fireEvent('searchinvalidated');
                }
            }
        });

        selectedView.addEvents('filterremoved');
        selectedView.addEvents('searchinvalidated');

        selectedView.on('click', selectedView.onSelectionClick, selectedView);
        selectedView.on('afterrender', selectedView.onSelectionsRendered, selectedView);

        return selectedView;
    },

    _buildToggleAll: function (termStore) {
        var toggleAll = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('showAll')['false'],
            showAll: false,
            termStore: termStore,
            hidden: true,
            setShowAll: function (showAll) {
                this.showAll = showAll;
                this.setText(OpenLayers.i18n('showAll')[showAll]);
                this.termStore.setShowAll(showAll);
            },
            toggleShowAll: function () {
                this.setShowAll(!this.showAll);
            },
            _onTermsLoaded: function () {
                this.setShowAll(false);
                if (termStore.getCount() == 1) {
                    this.setVisible(false);
                }
                else {
                    this.setVisible(termStore.canLimit, true);
                }
                this.doLayout();
            }
        });

        toggleAll.on('click', toggleAll.toggleShowAll, toggleAll);

        toggleAll.mon(termStore, 'termsloaded', toggleAll._onTermsLoaded, toggleAll);

        return toggleAll;
    },

    _buildFilterView: function (termStore) {
        return new Ext.list.ListView({
            hideHeaders:true,
            store:termStore,
            columns:[
                {
                    width:.8,
                    cls:'p-wrapped-col',
                    dataIndex:'display'
                },
                {
                    dataIndex:'count',
                    align:'right',
                    tpl:'({count})'
                }
            ]
        });
    },

    // private methods

    _loadStore: function (response) {
        var fieldGroup = this._getFieldGroup();
        var filter = this.selectionStore.getFilterValue();

        this.termStore.loadTopTerms(response, fieldGroup, filter);

        this.setDisabled(this.selectionStore.getCount() == 0 && this.termStore.getCount() == 0);
        this.filterView.setVisible(this.hierarchical || this.selectionStore.getCount() == 0);
        this.doLayout();
    },

    _getFieldGroup: function () {
        if (this.hierarchical) {
            var hierarchyLevel = this.selectionStore.getCount() + 1;
            return this.fieldName + this._getLevelSuffix(hierarchyLevel);
        }
        else {
            return this.fieldGroup;
        }
    },

    _getCurrentFilterName: function () {
        if (this.hierarchical) {
            var filterLevel = this.selectionStore.getCount();
            return this.fieldName + this._getLevelSuffix(filterLevel);
        }
        else {
            return this.fieldName;
        }
    },

    _getClickedFilterName: function () {
        if (this.hierarchical) {
            var filterLevel = this.selectionStore.getCount() + 1;
            return this.fieldName + this._getLevelSuffix(filterLevel);
        }
        else {
            return this.fieldName;
        }
    },

    _getLevelSuffix: function (level) {
        return 'Lvl' + level;
    },

    _onFilterClick: function (view, index) {
        var rec = view.store.getAt(index);
        var filterValue = rec.get('value');

        this.searcher.removeFilters(this._getCurrentFilterName());
        this.searcher.addFilter(this._getClickedFilterName(), filterValue);
        this.searcher.search();

        this.selectionStore.setFilterValue(filterValue);
        this._onFilterValueChanged();
    },

    _onFilterRemoved: function () {
        var filter = this.selectionStore.getFilterValue();
        this._onFilterValueChanged();
        this.searcher.removeFilters(this.fieldName);
        this.searcher.addFilter(this._getCurrentFilterName(), filter);
    },

    _onSearchInvalidated: function () {

        this.searcher.search();
    },

    _onCollapsedChange: function () {
        this.fireEvent('contentchange');
        //doLayout() doesn't work when collapsed,
        // so after uncollapsing we call it to make up for anything missed
        this.doLayout();
    },

    _onFilterValueChanged: function() {
        var currentFilterValue = this.selectionStore.getFilterValue();

        if (currentFilterValue.trim() == '') {
            this.removeSelectedSubTitle();
        }
        else {
            // Trim filter value for better fit
            var trimmedFilterValue = currentFilterValue;

            if (trimmedFilterValue.length > 30) {
               trimmedFilterValue = trimmedFilterValue.substr(0, 30) + '...'
            }

            this.setSelectedSubTitle(trimmedFilterValue);
        }
    },

    removeAnyFilters: function () {
        this.selectedView.clear();

        if (this.collapsedByDefault) {
            this.collapse();
        }
        else {
            this.expand();
        }
    },

    setSelectedSubTitle: function (subtitle) {
        var newTitle = '<span class="term-selection-panel-header-selected">' + this.titleText + '</span>';
        newTitle += " - " + subtitle;
        this.setTitle(newTitle);
    },

    removeSelectedSubTitle: function () {
        var newTitle = '<span class="term-selection-panel-header">' + this.titleText + '</span>';
        this.setTitle(newTitle);
    }
});
