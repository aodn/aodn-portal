
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.AnimationPanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        this.animationPanelMinimizedHeight = 48;
        this.animationPanelExpandedHeight = 140;
        
        //setVisible(true) for floating panel doesn't work without this fix
        //http://www.sencha.com/forum/showthread.php?49848-2.2-panel-setVisible-true-not-working
        var supr = Ext.Element.prototype;
        Ext.override(Ext.Layer, {
            hideAction : function(){
                this.visible = false;
                if(this.useDisplay === true){
                    this.setDisplayed(false);
                }else{
                    supr.setLeftTop.call(this, -10000, -10000);
                }
            }
        });

        this.setvisTimeoutId = null;

        this.animationControlsPanel = new Portal.details.AnimationControlsPanel(config);
        
        this.controlButtonPanel = new Ext.Panel({
            cls: 'animationSubPanel',
            bodyStyle:'padding: 6px; margin: 2px;',
            items: [{
                xtype: 'button',
                iconCls: 'arrowUpWhite',
                ref: 'controlButton',
                iconAlign: 'right',
                padding: 10,
                text: OpenLayers.i18n('controlButton_4AnimationControlsPanel'),
                listeners:{
                    // stops the click bubbling to a getFeatureInfo request on the map
                    scope: this,
                    click: this.toggle
                }
            }]
        });

        this.mapToolbar = new Ext.Toolbar({
            id: 'maptools',
            height: '100%',
            width: '100%',
            cls: 'semiTransparent',
            defaults: {
                //bodyStyle:'padding:5px; margin:2px'
            },
            unstyled: true,
            items: [
                {
                    xtype: 'tbspacer',
                    width: 230
                },
                this.animationControlsPanel,
                this.controlButtonPanel
            ],
            listeners:{
                // stops the click bubbling to a getFeatureInfo request on the map
                scope: this,
                render: function(p){
                    p.getEl().on('click', this.eventStopper);
                    p.getEl().on('dblclick', this.eventStopper);
                },
                single: true  // Remove the listener after first invocation
            }
        });

        this.expandBar = this.initToolBarExpanderBar();

        var config = Ext.apply({
            id: "animationPanel",
            shadow: false,
            width: '100%',
            hidden: true,
            height: this.animationPanelMinimizedHeight,
            floating: true,
            unstyled: true,
            items: [
                //this.expandBar,
                this.mapToolbar
            ],
            listeners:{
                // stops the click bubbling to a getFeatureInfo request on the map
                render: function(p){
                    p.getEl().on('mouseenter', function(){
                        this._modMapDragging(false);
                    }, this);
                    p.getEl().on('mouseleave', function(){
                        this._modMapDragging(true);
                    }, this);
                }
            }
        });

        Portal.ui.AnimationPanel.superclass.constructor.call(this, config);
        
        this.setPosition(1, 0); // override with CSS later

        Ext.MsgBus.subscribe('reset', function() {
            this.setVisible(false);
        }, this);

        
        Ext.MsgBus.subscribe('selectedLayerChanged', function(msg,openLayer) {
            // delay hiding/showing until animation cleaned up
            var task = new Ext.util.DelayedTask(function(){
                this._setAnimationPanelVis(openLayer);
            }, this);

            //calls function in 500ms
            task.delay(500);

        }, this);

    },

    _setAnimationPanelVis: function(openLayer) {


        if (this.map) {
            // no layers no show
            if (this.map.getLayersBy("isBaseLayer", false).length == 0 ) {
                this.setVisible(false);
            }
            else if (!this.animationControlsPanel.isAnimating()) {
                // there is no animation running so it can be hidden if not applicable
                if (openLayer) {
                    this.setVisible(openLayer.isAnimatable());
                }
            }
        }
    },
    
    setMap: function(map) {
        this.map = map;
        this.animationControlsPanel.setMap(this.map);
    },

    _modMapDragging: function(toggle) {
        for (var i = 0; i < this.map.controls.length; i++) {
            if ((this.map.controls[i].displayClass === "olControlNavigation") || (this.map.controls[i].displayClass === "olControlZoomBox")){
                if (toggle) {
                    if(this.map.controls[i].displayClass === this.lastActive)
                    {
                        this.map.controls[i].activate();
                    }
                }
                else {

                    if(this.map.controls[i].active)
                    {
                        this.lastActive = this.map.controls[i].displayClass


                        //if the user was in middle of dragging a zoombox, remove the box.
                        if(this.map.controls[i].displayClass === "olControlZoomBox")
                        {
                            if(this.map.controls[i].handler.dragHandler.dragging)
                            {
                                this.map.controls[i].handler.removeBox();
                            }
                        }

                    }
                    this.map.controls[i].deactivate();
                }
            }
        }
    },

    _contract: function() {
        this.setHeight(this.animationPanelMinimizedHeight);
        this.expandBar.addClass("expandUpLink");
        this.expandBar.removeClass("expandDownLink");
        this.controlButtonPanel.controlButton.setIconClass("arrowUpWhite");
    },

    _expand: function() {
        this.setHeight(this.animationPanelExpandedHeight);
        this.expandBar.addClass("expandDownLink");
        this.expandBar.removeClass("expandUpLink");
        this.controlButtonPanel.controlButton.setIconClass("arrowDownWhite");
    },

    toggle: function() {

        if (this.getHeight() > this.animationPanelMinimizedHeight) {
            this._contract();
        }
        else {
            this._expand();
        }
    },

    initToolBarExpanderBar: function() {
        
        var toolbar = new Ext.Toolbar({
            id: 'mapToolbarExpanderBar',
            height: 10,
            width: '100%',
            cls: 'semiTransparent noborder expandUpLink link',
            overCls: "mapToolbarExpanderBarOver",
            unstyled: true,
            listeners:{
                scope: this,
                render: function(bar) {
                    bar.getEl().on('click', function(ev) {
                        this.toggle();
                        this.eventStopper(ev);
                    }, this);
                    bar.getEl().on('dblclick', this.eventStopper);
                }
            }
        });
        return toolbar;
    },

    eventStopper: function(ev) {
        ev.stopPropagation(); // Cancels bubbling of the event
    }
});
