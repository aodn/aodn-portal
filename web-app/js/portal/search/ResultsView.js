Ext.namespace('Portal.search');

Portal.search.ResultsView = Ext.extend(Ext.ux.ComponentDataView, {
   autoWidth: true,
   autoHeight: true,
	cls: 'p-results',
	
	//TODO: catalogue url should be configurable
	tpl: [
	    '<ul>',
	        '<tpl for=".">',
	            '<li  id="{uuid}" title="{abstract}">',
	                '<table><tr><td class="p-logo">', 
	                '<div><img src="http://asdddev.emii.org.au/geonetwork/images/logos/{source}.gif"/></div>',
	                '</td><td class="abstract">',
	                '<h1>{title}</h1>',
                    '<p>{[values.abstract.substring(0, 350)]}<tpl if="values.abstract.length &gt; 350"> ...</tpl></p>',    // TODO : 350 as parameter
	                '</td><td class="p-result-actions">',
	                '<table><tr>',
                   '<td class="p-result-info p-result-action"></td>',
                   '<td class="p-result-add p-result-action"></td>',
                   '</tr></table>',
                   '</td></tr></table>',
	            '</li>',
	        '</tpl>',
	    '</ul>'
	],
	
	itemSelector: 'li',
	
	initComponent: function() {
   	this.items = [{
         xtype: 'button',
         text: 'Info',
         renderTarget: '.p-result-info',
         listeners: {
            scope: this,
            'click': this.infoClick
         }
   	},{
         xtype: 'button',
         text: 'Add to Map',
         renderTarget: '.p-result-add',
         listeners: {
            scope: this,
            'click': this.addClick
         }
   	}];
   	
      Portal.search.ResultsView.superclass.initComponent.call(this);
	},
	
   infoClick: function(btn) {
      Ext.Msg.alert(btn.el.parent('li').id);
   },
   
   addClick: function(btn) {
      Ext.Msg.alert(btn.el.parent('li').id);
   }
   
});

Ext.reg('portal.search.resultsview', Portal.search.ResultsView);
