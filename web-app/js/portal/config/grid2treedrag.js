// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext */
/**
 * Dragging from Grid to Tree Example by Saki
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2009, by Ing. Jozef Sakáloš
 * @date      22. June 2008
 * @version   $Id: grid2treedrag.js 152 2009-06-23 20:10:42Z jozo $
 *
 * @license grid2treedrag.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the 
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */
 
Ext.ns('Example');


var tree; 
var theGrid;
var theGridStore;
var jsonLayers;

function createGrid(layerType){
    
    var reader = new Ext.data.JsonReader({
        idProperty: '',
        root: 'data',
        fields:[
                { name:'id'}
                ,{name:'title'}
                ,{name:'name'} 
                ,{name:'server'} 
                ,{name:'isBaseLayer'}                
                ]
    })

   theGridStore = new Ext.data.Store({
                //groupField: 'server',
                url: jsonLayers,
                autoLoad: true, 
                reader: reader,
                baseParams: {
                	
                }
            }) 
   theGrid =  new Ext.grid.GridPanel({

                    
            //id:'availableLayers',
            title:'Drag layers or Servers to the tree',
            height: 500,
            stripeRows : true,
            enableDragDrop:true,
            ddGroup:'grid2tree',
                  
            store: theGridStore,
            //view: new Ext.grid.GroupingView({
            //    forceFit: true//,
                //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            //}),
            width: 600,
           //features: [groupingFeature],
           columns:[{
                header:"Name",
                sortable:true,
                dataIndex:'title'
            },
            {
                header:"WMS Server Layer Name",
                sortable:true,
                dataIndex:'name'
            },
            {
                header:"Base Layer",
                sortable:true,
                dataIndex:'isBaseLayer'
            }],
        
            viewConfig:{
                forceFit:true, 
                groupTextTpl: 'text ',
                getRowClass: function(record, index) {
                    if (record.json['class'] == "au.org.emii.portal.Server") {
                        return 'serverRow';
                    } 
                    else  {
                        return 'layerRow';
                    }
                }
            },
            bbar: new Ext.PagingToolbar({
                store: theGridStore,
                displayInfo:true,   
                pageSize:50
            })
   
        
    });
    
    
};

function dataPanel() {
	return new Ext.Panel({
		width: 600,
		items: [
	        theGrid,
	        searchGrid()
		]
	});
}


function initMenu(menu, _basePath) {
    basePath = _basePath;
    jsonLayers = basePath + 'layer/listForMenuEdit';
    Ext.BLANK_IMAGE_URL = basePath + 'img/blank.gif';

    // initialize QuickTips
    Ext.QuickTips.init();
    
    createGrid(false); // create non baselayer picker
    
    if (menu) {
        setupgrid2treedrag(menu);
        tree.getRootNode().expand(true);
    }
    else {
        menu = new Object();  
        
        var setUpName = function(){            
            Ext.MessageBox.prompt('Node Name', 'Please enter the label for this new Menu tree:', function(status, text) {                           
                if (text != "") {
                    menu.title = text;
                    setupgrid2treedrag(menu); 
                }
                else {
                    if (status == "ok") {
                        setUpName(); //recurse until the label is set
                    }
                }            
            });
        }
        setUpName();  // fail               
                  
    } 
}


function showHideButtons() {
        // hide the help if it exists                                        
    var element = Ext.get('message');                                        
    if(element) {
        element.setVisibilityMode(Ext.Element.DISPLAY);
        element.fadeOut({
            duration: 1.5
        });
    }                         
    Ext.get('submitMenu').fadeIn();
}
 

// for new and editing menu trees
function setupgrid2treedrag(menu) {
	
    // only menu.title is guaranteed to be set
    var rootLabel = menu.title;
    var builder = new Portal.data.MenuItemToNodeBuilder();
    var children = builder.build(menu);
	
    // any msg's from grails
    if (Ext.get('message')) {
        Ext.get('message').show()
    }
    
    // submitMenu is the button to create or edit a menu
    Ext.get('submitMenu').on('click', function() {

        // get filtered json string
        var json = tree.toJsonString(null,
            function(key, val) {
                return (key == 'leaf' || ((key == 'grailsLayerId' || key == 'grailsServerId') && val) || key == 'text' || key == 'id');
            }, 
            {
                description: 'name'
            });
        if (json != "") {
            Ext.get('jsonString').dom.value = json; 
        }
    });
    
    

    tree = new Ext.tree.TreePanel({       
                
                
        // root with some static demo nodes
        root: {
            text: rootLabel,  
            id: 'root',
            children: children,
            //expanded: true, 
            expandable: true
        },
        // enable DD        
        enableDD:true,
        // set ddGroup - same as for grid       
        ddGroup:'grid2tree',
        id:'tree',
        width: 250,
        border:false,
        collapsible:false,
        padding: 20,
        autoScroll:true,
        loader: new Ext.tree.TreeLoader({preloadChildren:true}), 
        listeners:{
            
            'contextmenu': function(node){
                this.getSelectionModel().select(node);
                treeMenu = rightClickMenu(node);
                if(treeMenu!=null) {
                    treeMenu.show(node.ui.getAnchor());
                }
            },
            
            movenode: {
                fn:function(e) {
                    showHideButtons();
                }
            },


            // create nodes based on data from grid
            beforenodedrop:{
                fn:function(e) {
                    
                    
                    // e.data.selections is the array of selected records
                    if(Ext.isArray(e.data.selections)) {
                        // reset cancel flag
                        e.cancel = false;

                        // setup dropNode (it can be array of nodes)
                        e.dropNode = [];
                        var r;
                        for(var i = 0; i < e.data.selections.length; i++) {

                            // get record from selectons
                            r = e.data.selections[i];
                            
                            // reservered word here but it works!!!
                            if (r.json['class'] == "au.org.emii.portal.Server") {
                                e.dropNode.push(this.loader.createNode({
                                text:r.get('name'),
                                leaf:false,
                                children: [],
                                grailsServerId:r.get('id'), // identify grails Server by this variable   
                                qtip:r.get('json.uri') 
                            }));                            
                            }
                            else {
                            // create layer node
                            e.dropNode.push(this.loader.createNode({
                                text:r.get('title'),
                                leaf:true,
                                grailsLayerId:r.get('id'), // identify grails layers by this variable
                                qtip:r.get('layers') + " - " + r.get('server.shortAcron')
                            }));
                            
                            }
                        };
                    
                        showHideButtons();
                        
                        // we want Ext to complete the drop, thus return true
                        return true;
                        
                    }
                //alert("drop ignored");
                // if we get here the drop is automatically cancelled by Ext
                }
            }
    }
    });
//    Ext.each(children, function(child, index, all) {
//    	this.getRootNode().appendChild(child);
//    }, tree);
//    tree.getRootNode().expand(true);
// }}}

    
//tree.getRootNode().expand();

// create and show the window
var win = new Ext.Panel({
    defaultMargins: 10 ,
    border:false,
    padding: 25,      
    layout:  {
        type: 'column',
        align: 'left'
    },
    pack: 'start',
    align: 'stretch',
    renderTo:'menuConfigurator',
    items:[
        tree,  
        dataPanel()
    ]
                
});
win.doLayout(); 
};             

function rightClickMenu(node){
    var treeMenu = new Ext.menu.Menu({
        plain: false,
        shadow:'drop', 
        showSeparator: false
    });         

    if (!node.isLeaf()) {
        treeMenu.add({
            text:'Add Menu Branch',
            node:node,
            listeners:{
                click: function(item){
                    Ext.MessageBox.prompt('Node Name', 'Please enter the label for this new branch:', function(status, text) {                           
                        if (text != "") {
                            node.appendChild({
                                text: text,
                                leaf: false,
                                expanded: true,
                                expandable: true,
                                children: []                  

                            });
                            node.expand();
                            showHideButtons();
                        }
                        else {
                            Ext.MessageBox.alert('Node not created','You must supply a name for a new branch');
                        }
                    });
                       
                } 
            }
        });
        
        treeMenu.add({
            text:'Rename',
            node:node,
            listeners:{
                click: function(item){
                    Ext.MessageBox.prompt('Node Name', 'Please enter the label for this node:', 
                		function(status, text) {
                        // dont allow the label to be empty   
	                        if (text != "") {
	                            node.setText(text);
	                        }
	                        else {                            
	                            Ext.MessageBox.alert('Node not created', 'You must supply a name for a new node');
	                        }
	                    },
	                    this,
	                    false,
	                    node.text
                    );                    
                    showHideButtons();           
                } 
            }
        });
        
        
    }
    if (node.id != "root") {
        treeMenu.add({
            text:'Remove',
            node:node,
            listeners:{
                click: function(){
                    node.destroy();   
                    showHideButtons();                    
                }
            }        
        })
    }
    
    return treeMenu
        
}



function searchGrid() {

    console.log("searchForm");
    console.log(jsonLayers);

    var searchForm = new Ext.FormPanel({
        frame: true, 
        //padding: 20,
        border: false, 
        buttonAlign: 'center',
        url: jsonLayers, 
        method: 'POST', 
        id: 'frmRegister',
        bodyStyle: 'padding:1px;',
        width: 600,
        //margins: 10,
        layout: 'hbox',
        items: [
        	{
        		xtype: 'textfield',
        		width: 480,
        		id: 'gridFilterPhrase',
        		fieldLabel: 'Filter',
        		name: 'phrase'
        	},
        	{
    			xtype: 'button',
        		text: 'Reset', 
        		width: 50,
        		handler: function() {
        			searchForm.getForm().reset();
        			loadGrid();
        		}
            },
            { 
        		xtype: 'button',
            	text: 'Filter',
            	width: 50,
            	handler: function() {
            		loadGrid();
            	}
            }
        ],
        keys: [
            { key: [Ext.EventObject.ENTER], handler: function() {
                    loadGrid();
                }
            }
        ]
	});
    //searchForm.addKeyListener(27, searchForm.getForm().submit(), searchForm);


    function loadGrid() {
        theGridStore.baseParams = {
    		phrase: searchForm.getForm().findField('phrase').getValue()
        }
        theGridStore.load({
            params: {
        		start: 0,
        		limit: 50
        	}
        });
        theGrid.doLayout();
    }
       
    return searchForm;
}
