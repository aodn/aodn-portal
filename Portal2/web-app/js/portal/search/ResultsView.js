Ext.namespace('Portal.search');

Portal.search.ResultsView = Ext.extend(Ext.DataView, {
	//TODO: catalogue url should be configurable
	tpl: [
	    '<ul>',
	        '<tpl for=".">',
	            '<li title="{abstract}">',
	                '<table><tr><td style="width:30px;">',  // FIXME
	                '<div class="md-logo"><img src="http://asdddev.emii.org.au/geonetwork/images/logos/{source}.gif"/></div>',
	                '</td><td id="{uuid}">',
	                '<p>{title}</p>' +
                    '<p class="abstract">{[values.abstract.substring(0, 350)]}<tpl if="values.abstract.length &gt; 350"> ...</tpl></p>',    // TODO : 350 as parameter
	                '</td></tr></table>',
	            '</li>',
	        '</tpl>',
	    '</ul>'
	],
	
   initComponent: function() {
	      Portal.search.ResultsView.superclass.initComponent.call(this);
   }
	
});

Ext.reg('portal.search.resultsview', Portal.search.ResultsView);
