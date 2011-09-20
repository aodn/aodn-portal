Ext.namespace('Portal.search');

Portal.search.ResultsView = Ext.extend(Ext.DataView, {
	//TODO: catalogue url should be configurable
	tpl: [
	    '<ul>',
	        '<tpl for=".">',
	            '<li class="md md-simple" title="{abstract}">',
	                '<table><tr><td style="width:30px;">',  // FIXME
	                '<div class="md-logo"><img src="http://asdddev.emii.org.au/geonetwork/srv/en/images/logos/{source}.gif"/></div>',
	                '</td><td id="{uuid}">',
	                '<h1><input type="checkbox" <tpl if="selected==\'true\'">checked="true"</tpl> class="selector" onclick="javascript:catalogue.metadataSelect((this.checked?\'add\':\'remove\'), [\'{uuid}\']);"/><a href="#" onclick="javascript:catalogue.metadataShow(\'{uuid}\');">{title}</a>' +
                    '<span class="md-action-menu"> - <a rel="mdMenu">' + OpenLayers.i18n('mdMenu') + '</a></span></h1>',
	    			'<span class="subject"><tpl for="subject">',
	                    '{value}{[xindex==xcount?"":", "]}',
	                '</tpl></span>',
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
