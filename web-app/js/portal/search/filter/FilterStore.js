Ext.namespace('Portal.search.filter');

Portal.search.filter.getDefaultFilters = function() {
  return [ 
       [ 
        1, 
        'portal.search.field.freetext',
        null, 
        {
        xtype : 'portal.search.field.freetext',
        anchor: '100%'
      },
      true
    ],
    [
      2,
      'combo',
      null,
      {
        xtype: 'portal.search.field.maplayers',
      },
      true
    ]
  ];
 };

Portal.search.filter.newDefaultActiveFilterStore = function()
{
	return new Portal.search.filter.FilterStore({
		data: this.getDefaultFilters() 
	});
};

/**
 * Convenience method for instantiating a new FilterStore with all the default optional parameters.
 * 
 * @returns {Portal.search.filter.FilterStore}
 */
Portal.search.filter.newDefaultInactiveFilterStore = function()
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
            anchor: '100%',
						proxyUrl : proxyURL,
						url : keywordSuggestUrl
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
            anchor: '100%',
						proxyUrl : proxyURL,
						url : paramSuggestUrl
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
            anchor: '100%',
						proxyUrl : proxyURL,
						url : orgSuggestUrl
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
			
			fields : [ 'sortOrder', 'type', 'displayText', 'componentConfig', 'fixed', 'asJson', 'filterValue' ]
		}, cfg);

        Portal.search.filter.FilterStore.superclass.constructor.call(this, config);
	}
});


		