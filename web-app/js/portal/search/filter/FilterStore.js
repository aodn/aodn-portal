Ext.namespace('Portal.search.filter');

Portal.search.filter.newDefaultActiveFilterStore = function()
{
	return new Portal.search.filter.FilterStore({
		data: 
			[ 
				[ 
				  	1, 
				  	'portal.search.field.freetext',
				  	null, 
				  	{
						xtype : 'portal.search.field.freetext',
						width : 515
					},
					true
				],
				// TODO: this element could do with refactoring...
				[
				 	2,
				 	'combo',
				 	null,
					{
						hideLabel : true,
						name : 'protocolCombo',
						xtype : 'combo',
						width : 510,
						mode : 'local',
						editable : false,
						submitValue : false,
						forceSelection : true,
						triggerAction : 'all',
						store : 
							[
								[ '', 'Show me all results' ],
								[
										Portal.app.config.metadataLayerProtocols.split(
												"\n").join(' or '),
										'Show me results with map layers only' ]
							],
						hiddenName : 'protocol',
						value : '',
						getFilterValue: function() {
							return { value: this.getValue() };
						},
						setFilterValue: function(v) {
							this.setValue(v.value);
						},
						listeners :
						{
							'select': function(combo, record, index) {
								this.fireEvent('protocolChange', record.data.field1);
							}
						},
						onContentChange: function()
						{
							this.fireEvent('protocolChange', this.getValue());
						}	
					},
					true
				]
			]
	});
};

/**
 * Convenience method for instantiating a new FilterStore with all the default optional parameters.
 * 
 * @param rootContainer
 * @returns {Portal.search.filter.FilterStore}
 */
Portal.search.filter.newDefaultInactiveFilterStore = function(rootContainer)
{
    var keywordSuggestUrl = Portal.app.config.catalogUrl + '/srv/eng/portal.summary.keywords';
    var paramSuggestUrl = Portal.app.config.catalogUrl + '/srv/eng/portal.summary.longParamNames';
    var orgSuggestUrl = Portal.app.config.catalogUrl + '/srv/eng/portal.summary.organisations';

	return new Portal.search.filter.FilterStore({
		data: 
			[ 
				[ 
				  	3,
				  	'portal.search.field.daterange',
				  	OpenLayers.i18n("dateRange"), 
				  	{
				 		xtype : 'portal.search.field.daterange'
				 	},
					false
				], 
				[ 
				  	4, 
				  	'portal.search.field.boundingbox',
				  	OpenLayers.i18n("boundingBox"), 
				  	{
				  		xtype : 'portal.search.field.boundingbox'
				 	},
				 	false
				],
				[ 
				 	5, 
				 	'portal.search.field.multiselect-keyword',
				 	OpenLayers.i18n("keyword"), 
				 	{
						fieldLabel : OpenLayers.i18n("keyword"),
						labelSeparator : '',
						name : 'themekey',
						field : 'keyword',
						xtype : 'portal.search.field.multiselect',
						proxyUrl : proxyURL,
						url : keywordSuggestUrl,
						listeners : 
						{
							scope : rootContainer,
							redraw : rootContainer.refreshDisplay
						}
					},
					false
				], 
				[ 
				  	6, 
				  	'portal.search.field.multiselect-parameter',
				  	OpenLayers.i18n("parameter"), 
				  	{
						fieldLabel : OpenLayers.i18n("parameter"),
						labelSeparator : '',
						name : 'longParamName',
						field : 'longParamName',
						xtype : 'portal.search.field.multiselect',
						proxyUrl : proxyURL,
						url : paramSuggestUrl,
						listeners : 
						{
							scope : rootContainer,
							redraw : rootContainer.refreshDisplay
						}
					},
					false
				], 
				[ 
				  	7, 
				  	'portal.search.field.multiselect-organisation',
				  	OpenLayers.i18n("organisation"), 
				  	{
						fieldLabel : OpenLayers.i18n("organisation"),
						labelSeparator : '',
						name : 'orgName',
						field : 'orgName',
						xtype : 'portal.search.field.multiselect',
						proxyUrl : proxyURL,
						url : orgSuggestUrl,
						listeners : 
						{
							scope : rootContainer,
							redraw : rootContainer.refreshDisplay
						}
					},
					false
				]
			]			
	});
};

Portal.search.filter.FilterStore = Ext.extend(Ext.data.ArrayStore, {

	constructor : function(cfg) 
	{
		cfg = cfg || {};

        var config = Ext.apply(
		{
			id : 0,
			
			// displayedComponentId stores the ID of the component which wraps the filter component (so
			// we a have a reference for removing later).
			fields : [ 'sortOrder', 'type', 'displayText', 'componentConfig', 'fixed', 'asJson', 'displayedComponentId', 'filterValue' ]
		}, cfg);

        Portal.search.filter.FilterStore.superclass.constructor.call(this, config);
	}
});


		