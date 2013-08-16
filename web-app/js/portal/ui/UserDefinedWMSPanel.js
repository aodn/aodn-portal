
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.UserDefinedWMSPanel = Ext.extend(Ext.Panel, {

	constructor: function(cfg) {

		this.loadedServerURLS = new Array();

		this.serverURLInputBox = new Ext.form.TextField({

			ref: "userWMSInput",
			fieldClass: "userWMSInput",
			hideLabel: true,
			emptyText: OpenLayers.i18n('addYourURL'),
			width:600,
			anchor:'99%',
			name: 'url',
			enableKeyEvents: true,
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
			ref: "spinnner",
			hidden: true,
			//cls: 'extAjaxLoading',
			html: '<div class="loading-indicator"> Loading...</div>'
		});

		this.hbox = new Ext.Container({
			layout: 'hbox',
			items: [{
				html: "<h4>" +  OpenLayers.i18n("addYourURLHeader") + "</h4>",
				flex: 5

			},
			{
				flex: 1,
				margins: {top:0, right:1, bottom:4, left:0},
				items: [{

					ref: 'submitButton',
					xtype: 'button',

					text: OpenLayers.i18n("addYourURLSubmit"),
					tooltip: OpenLayers.i18n("addYourURLSubmitTip"),
					listeners:	{
						scope: this,
						'click': this.onSubmitClick
					}
				}]
			}]
		});

		this.statusPanel = new Ext.Panel({
			ref: "status",
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

		this.proxyWMSURL = "proxy/wmsOnly?url=";

		var config = Ext.apply({
			title: 'Add WMS Servers',
			layout:'form',
			cls: '',
			items: [
				this.hbox,
				this.serverURLInputBox,
				this.spinnerPanel,
				this.statusPanel
			]
		}, cfg);

		Portal.ui.UserDefinedWMSPanel.superclass.constructor.call(this, config);
	},

	onSubmitClick: function() {
		var url = this.userWMSInput.getValue();
		if (url.length > 0) {
			this.addWMStoTree(url,this.statusPanel,this.spinnerPanel);
		}
	},

	buildURL: function(url){

		// if URL has parameters then we need to send a different query to the proxy
		var concatenator = (url.indexOf("?") > 0)? "&" : "?";
		// add protocol if user left it off
		url = (url.indexOf("http://") == 0)? url : "http://" + url;

		url = url+ concatenator + "SERVICE=WMS&request=GetCapabilities";
		return this.proxyWMSURL+encodeURIComponent(url)
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
							ratio: 1
						},
						layerParams: {
							'TRANSPARENT': true,
							'queryable': true, //if not base layer, then might as well make it querayable, since
											   //GetFeatureInfo popup goes through proxy, which does NOT allow
											   //connections to untrusted servers
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

							scope: this,
							beforeload: function() {

								// check if loaded previously
								if (this.loadedServerURLS.indexOf(url) >= 0) {
									statusField.setTitle(OpenLayers.i18n('addYourURLDuplicate'));
									statusField.update(OpenLayers.i18n('addYourURLDuplicateBody'));
									return false;
								}
								else {
									spinnerPanel.show();
									setViewPortTab(TAB_INDEX_MAP);
									statusField.setTitle(OpenLayers.i18n('searching'));
									statusField.hide();
								}
							},

							load: function() {

								spinnerPanel.hide('slow');
								setViewPortTab(TAB_INDEX_MAP);
								statusField.setTitle(OpenLayers.i18n('addYourURLSuccessful'));
								// ADD TO LIST OF SUCCESSFULL SERVERS
								statusField.update("");
								statusField.show();
								// add to successfully loaded array
								this.loadedServerURLS.push(url);
							},
							loadexception: function(obj,node,e) {

								spinnerPanel.hide('slow');
								statusField.setTitle("ERROR: Server URL Invalid");
								if (e.responseText != undefined) {
									statusField.update( OpenLayers.i18n('addYourURLUnsuccessful',{
										url: e.responseText
										}));
								}
								else {
									statusField.update( OpenLayers.i18n('addYourURLUnsuccessfulNoResponse'));
								}
								statusField.show().expand();
							}
						}
					})
				}),

				listeners: {
					// Add layers to the map when ckecked, remove when unchecked.
					// Note that this does not take care of maintaining the layer
					// order on the map.
					'click': function(node) {
						if (node.attributes.layer != null) {
							var layer = node.attributes.layer;
							statusField.setTitle(OpenLayers.i18n('addYourLayerSuccess',{
								layerName: layer.name.replace(/_/gi, " ")
								}));
							statusField.update("");
							statusField.show();
							layer.server = node.attributes.server;

                            Portal.data.LayerStore.instance().addUsingOpenLayer(layer);
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
