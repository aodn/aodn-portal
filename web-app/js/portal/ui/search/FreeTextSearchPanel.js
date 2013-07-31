
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search.FreeTextSearchPanel');

Portal.ui.search.FreeTextSearchPanel = Ext.extend(Ext.Panel, {

	constructor: function(config) {

	    var defaults = {
	    	pageSize: 10
	    };

		this.freeTextInput = new Portal.search.field.FreeText({
			flex: 1
		});

		this.searchButton = new Ext.Button({
			text: OpenLayers.i18n('freeTextSearch')
	    });

		config = Ext.apply({
			layout: 'hbox',
			layoutConfig: {
				align: 'stretchmax'
			},
			items: [
			    this.freeTextInput,
			    new Ext.Spacer({width: 5}),
			    this.searchButton
			]
		}, config, defaults);

		Portal.ui.search.FreeTextSearchPanel.superclass.constructor.call(this, config);

		this.searchButton.on('click', this.onSearchButtonClick, this);
		this.searchButton.on('afterrender', this.onSearchButtonAfterRender, this);
	},

	onSearchButtonClick: function() {
        this.fireEvent('search', this.freeTextInput.getValue());
	},

	onSearchButtonAfterRender: function() {
		this.bindEnterKeyPressToSearch();
	},

	bindEnterKeyPressToSearch: function() {

		new Ext.KeyMap(
			this.el,
			[{
				key: [10, 13],
				fn: this.onSearchButtonClick,
				scope: this
			}]);
	}
});
