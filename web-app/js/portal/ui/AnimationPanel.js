
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.AnimationPanel = Ext.extend(Ext.Panel, {

    constructor: function() {
        
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

        this.animationControlsPanel = new Portal.details.AnimationControlsPanel();

        this.controlButtonPanel = new Ext.Panel({

            bodyStyle:'padding: 6px; margin: 2px;',
            items: [{
                xtype: 'button',
                iconCls: 'arrowUp',
                ref: 'controlButton',
                iconAlign: 'right',
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

        this.maplinksHeight = 52;

        this.expandBar = this.initToolBarExpanderBar();

        var config = Ext.apply({
            id: "animationPanel",
            shadow: false,
            width: '100%',
            hidden: true,
            height: this.maplinksHeight,
            floating: true,
            unstyled: true,
            items: [
                this.expandBar,
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
        
        Ext.MsgBus.subscribe('removeLayer', function() {
            this.setVisible(false);
        }, this);

        Ext.MsgBus.subscribe('reset', function() {
            this.setVisible(false);
        }, this);
        
        Ext.MsgBus.subscribe('selectedLayerChanged', function(subject, openLayer) {
            
            if (!this.animationControlsPanel.isAnimating()) {
                if (openLayer) {
                    if (openLayer.isAnimatable()) {
                        this.setVisible(true);
                    }
                    else {
                        this.setVisible(false);
                    }
                }
            }
        }, this);
    },
    
    setMap: function(map) {
        this.map = map;
        this.animationControlsPanel.setMap(this.map);
    },

    _modMapDragging: function(toggle) {
        for (var i = 0; i < this.map.controls.length; i++) {
            if ((this.map.controls[i].displayClass === "olControlNavigation") || (this.map.controls[i].displayClass === "olControl")){
                if (toggle) {
                    this.map.controls[i].activate();
                }
                else {
                    this.map.controls[i].deactivate();
                }
            }
        }
    },

    _contract: function() {
        this.setHeight(this.maplinksHeight);
        this.expandBar.addClass("expandUpLink");
        this.expandBar.removeClass("expandDownLink");
        this.controlButtonPanel.controlButton.setIconClass("arrowUp");

    },

    _expand: function() {
        this.setHeight(200);
        this.expandBar.addClass("expandDownLink");
        this.expandBar.removeClass("expandUpLink");
        this.controlButtonPanel.controlButton.setIconClass("arrowDown");
    },

    toggle: function() {

        if (this.getHeight() > this.maplinksHeight) {
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
