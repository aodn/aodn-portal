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
								[
										Portal.app.config.metadataLayerProtocols.split(
												'\n').join(' or '),
										'Show me results with map layers only' ],
								[ '', 'Show me all results' ] 
							],
						hiddenName : 'protocol',
						value : Portal.app.config.metadataLayerProtocols.split('\n').join(' or '),
						getFilterValue: function() {
							return { value: this.getValue() };
						},
						setFilterValue: function(v) {
							this.setValue(v.value);
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
    var opensearchSuggest = Portal.app.config.catalogUrl + '/srv/en/main.search.suggest';
	
	return new Portal.search.filter.FilterStore({
		data: 
			[ 
				[ 
				  	3,
				  	'portal.search.field.daterange',
				  	OpenLayers.i18n("dateRange"), 
				  	{
				 		xtype : 'portal.search.field.daterange',
				 	},
					false
				], 
				[ 
				  	4, 
				  	'portal.search.field.boundingbox',
				  	OpenLayers.i18n("boundingBox"), 
				  	{
				  		xtype : 'portal.search.field.boundingbox',
						listeners : 
						{
							scope : rootContainer,
							beforeRender : rootContainer.setResultsGridText,
							removed : rootContainer.resetResultsGridText
						}
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
						url : opensearchSuggest,
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
						url : opensearchSuggest,
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
						url : opensearchSuggest,
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
			fields : [ 'sortOrder', 'type', 'displayText', 'componentConfig', 'fixed', 'asJson', 'displayedComponentId', 'filterValue' ],
		}, cfg);

        Portal.search.filter.FilterStore.superclass.constructor.call(this, config);
	}
});


		