
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.EmptyDropZonePlaceholder = Ext.extend(Ext.Panel, {

	padding: 50,

	constructor: function(config) {

		var emptyDropZonePlaceholderId = config.id;
		var placeholderTextId = config.id + "_text";
		var thePadding = this.padding;

		config = Ext.apply({

			layout: 'fit',
			padding: this.padding,

	    	items: [
	    	    {
	    	    	layout: 'fit',
	    	    	xtype: 'panel',
	    	    	style: {
	    	    		'border-style': 'dashed',
	    	    		'border-width': '5px'
	    	    	},
	    	    	items: [
    		    	    {
    			        	html: '<h1 id="' + placeholderTextId + '">' + config.placeholderText + '</h1>',
    			        	listeners: {

     			        		// Dirty hack to centre align (vert and horizontally) the placeholder text.
    			        		'afterrender': function() {

    			        			$('#'+ placeholderTextId).parent().addClass('drop-zone-placeholder');
    			        			var parentHeight = $('#' + emptyDropZonePlaceholderId).height();
    			        			$('#' + emptyDropZonePlaceholderId).find('.x-panel-body').css('height', '');
    			        			$('#'+ placeholderTextId).parent().css('height', parentHeight - (2 * thePadding) + 'px');
    			        		}
    			        	}
    		    	    }
	    	    	]
	    	    }
	    	]
		}, config);

		Portal.ui.EmptyDropZonePlaceholder.superclass.constructor.call(this, config);
	}
});
