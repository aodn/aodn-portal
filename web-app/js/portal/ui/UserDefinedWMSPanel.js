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
						//var form = field.ownerCt.getForm().getValues();
						var url = field.getValue();
						if (url.length > 0) {
							this.addWMStoTree(url,this.statusPanel);
						}
						else {
					//field.setValue(OpenLayers.i18n('addYourUrl'));
					}
                        
					}
				}
			}
		});
		this.statusPanel = new Ext.Panel({
			//hidden: true//,
			padding: 10,
			title: "Note:",
			collapsible: true,
			titleCollapse: true,
			collapseFirst: true,
			html: "<i>" + OpenLayers.i18n('addYourURLHelp') + "</i>",
			listeners: {
				beforecollapse: function() {
					this.setTitle("");
				},
				beforeexpand: function(){
					this.setTitle("Note:");
					this.update("<i>" + OpenLayers.i18n('addYourURLHelp') + "</i>");
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
			this.statusPanel
			]
		}, cfg);
		
		Portal.ui.UserDefinedWMSPanel.superclass.constructor.call(this, config);
	},
	
	validateURL: function(form){
	//console.log(form);
	},
	
	

	
	addWMStoTree: function(url,textField){
		
		// if URL has parameters then we need to send a different query to the proxy 
		var concatenator = (url.indexOf("?") > 0)? "&" : "?";		
		
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
						
						url: proxyWMSURL+encodeURIComponent(url+ concatenator + "SERVICE=WMS&request=GetCapabilities"),
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
							load: function() {
								setViewPortTab(1); // move to the map tab
								textField.setTitle("Server Loaded");
								textField.update("<i>winner</i>");
							},
							loadexception: function(obj,node,e) {
							//console.log("fail");
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
							
						textField.setTitle(layer.name + " added to map");
					var layer = node.attributes.layer;
					layer.server = node.attributes.server;
					getMapPanel().addLayer(layer,true);
						node.disable();
							
						
					}
				}
			})

			);
		menu.doLayout();
		
	}
	
	
});
//Ext.reg('portal.ui.userdefinedwmspanel', Portal.ui.UserDefinedWMSPanel);
