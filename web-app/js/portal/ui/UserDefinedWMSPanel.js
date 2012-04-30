Ext.namespace('Portal.ui');

Portal.ui.UserDefinedWMSPanel = Ext.extend(Ext.Panel, {
	
	constructor: function(cfg) {		
		
		
		this.serverURLInputBox = new Ext.form.TextField({
					
			id: "userWMSInput",
			fieldClass: "userWMSInput",
			hideLabel: true,
			emptyText: OpenLayers.i18n('addYourURL'),
			width:600,
			anchor:'99%',
			name: 'url',
			enableKeyEvents: true,
			allowBlank: false,
			listeners: {
				scope: this,
				specialkey: function(field,e) {
					if (e.getKey() == e.ENTER) {		
						var url = field.getValue();
						if (url.length > 0) {
							this.addWMStoTree(url,this.statusPanel,this.spinnerPanel);
						}
					}
				}
			}
		});
		this.spinnerPanel = new Ext.Panel({   
			hidden: true,
			//cls: 'extAjaxLoading',
			html: '<div class="loading-indicator"> Loading...</div>'
		});
		this.statusPanel = new Ext.Panel({
			cls: 'addServerStatusPanel',
			padding: 10,
			title: "Note:",
			collapsible: true,
			titleCollapse: true,
			collapseFirst: true,
			html: OpenLayers.i18n('addYourURLHelp'),
			listeners: {
				beforecollapse: function() {
					this.setTitle("");
				},
				beforeexpand: function(){
					this.setTitle("Note:");
					this.update(OpenLayers.i18n('addYourURLHelp'));
				}
			}
			
		});
		
		var config = Ext.apply({
			title: 'Add WMS Servers',
			layout:'form',
			cls: '',
			items: [
			{
				html: "<h4>WMS Server URL</h4>"
			},
			this.serverURLInputBox,
			this.spinnerPanel,
			this.statusPanel
			]
		}, cfg);
		
		Portal.ui.UserDefinedWMSPanel.superclass.constructor.call(this, config);
	},
	
	buildURL: function(url){
		
		// if URL has parameters then we need to send a different query to the proxy 
		var concatenator = (url.indexOf("?") > 0)? "&" : "?";
		// add protocol if user left it off
		url = (url.indexOf("http://") == 0)? url : "http://" + url;
		
		url = url+ concatenator + "SERVICE=WMS&request=GetCapabilities";
		return proxyWMSURL+encodeURIComponent(url)
	},
	
	

	
	addWMStoTree: function(url,statusField, spinnerPanel){
				
		
		var menu = this;
		
		menu.add(
			new Ext.tree.TreePanel({
				autoHeight: true,
				border: false,
				rootVisible: false,
				root: new Ext.tree.AsyncTreeNode({
					text: url,
					expanded: true,
					loader: new GeoExt.tree.WMSCapabilitiesLoader({
						
						url: this.buildURL(url),
						layerOptions: {
							buffer: 0, 
							singleTile: false, 
							ratio: 1, 
							queryable: false
						},
						layerParams: {
							'TRANSPARENT': true,
							'queryable': false,
							'isBaseLayer': false
							
						},
						
						// customize the createNode method to add a checkbox to nodes
						createNode: function(attr) {
							//attr.checked = attr.leaf ? false : undefined;
							//attr.active=attr.leaf ? false : undefined;;
							//
							// add attributes we need latter to create a complete layer for our map
							attr.server= {};
							attr.server.url = url;
							attr.server.opacity = 50;
							attr.server.type = "WMS";
							
							return GeoExt.tree.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
						},
						listeners: {
							beforeload: function() {
								
								spinnerPanel.show();
								setViewPortTab(1); // move to the map tab
								statusField.setTitle(OpenLayers.i18n('searching'));
								statusField.hide();
							},
							
							load: function() {
								
								spinnerPanel.hide('slow');
								setViewPortTab(1); // move to the map tab
								statusField.setTitle(OpenLayers.i18n('addYourURLSucessful'));
								statusField.update("");
								statusField.show();
							},
							loadexception: function(obj,node,e) {
								
								spinnerPanel.hide('slow');
								statusField.setTitle("ERROR: Server URL Invalid");
								if (e.responseText != undefined) {
									statusField.update( OpenLayers.i18n('addYourURLUnsucessful',{url: e.responseText}));
								}
								else {
									statusField.update( OpenLayers.i18n('addYourURLUnsucessfulNoResponse'));
								}								
								statusField.show().expand();
								
								
							}
						
							
						}
							
					})
				})
				,
				listeners: {
					// Add layers to the map when ckecked, remove when unchecked.
					// Note that this does not take care of maintaining the layer
					// order on the map.
					'click': function(node) {
						if (node.attributes.layer != null) {
							var layer = node.attributes.layer;	
							statusField.setTitle(OpenLayers.i18n('addYourLayerSucess',{layerName: layer.name.replace(/_/gi, " ")}));
							statusField.show();
							layer.server = node.attributes.server;
							
							//layer.metadata.dimensions = null; 
							
							getMapPanel().addLayer(layer,true);
							//node.disable();
						}
						else {
							node.expand();
						}
						
							
						
					}
				}
			})

			);
		menu.doLayout();
		
	}
	
	
});
//Ext.reg('portal.ui.userdefinedwmspanel', Portal.ui.UserDefinedWMSPanel);
