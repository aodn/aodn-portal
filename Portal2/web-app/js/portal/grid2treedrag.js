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
Ext.BLANK_IMAGE_URL = '/Portal2/img/blank.gif';

var jsonLayers = '/Portal2/layer/list?type=JSON';
var tree; 



function initMenu(menu) {
    
            if (menu) {
                jsonLayers = jsonLayers + "&id=" + menu.id
            }
            
    
                
              // initialize QuickTips
              Ext.QuickTips.init();
              
              setupgrid2treedrag(menu);
              
 
             Ext.get('submitMenu').on('click', function() {

                // get filtered json string
                var json = tree.toJsonString(null,
                    function(key, val) {
                        return (key == 'leaf' ||  key == 'grailsLayerId'   || key =='text' );
                        //return true;
                    }
                    , 
                    {
                    description: 'name'
                });
                if (json != "") {
                  Ext.get('jsonString').dom.value = json;                  
                  
                }
                return false;
            });
}



function setupgrid2treedrag(menu) {
    
        var rootLabel = 'New Layer Menu';
        var children = [];
        if (menu) {
            
            rootLabel = menu.title;
            children = JSON.parse(menu.json) // supplied as a string
            
            
        }

	tree = new Ext.tree.TreePanel({
        
                
                
		// root with some static demo nodes
		root:{text: rootLabel,  id: 'root', leaf:false, children: children, expanded: true, expandable: true}
        
                //,rootVisible: false     

		// preloads 1st level children
		,loader:new Ext.tree.TreeLoader({preloadChildren:true})

		// enable DD
		,enableDD:true

		// set ddGroup - same as for grid
		,ddGroup:'grid2tree'

		,id:'tree'
                ,width: 250
		,border:false
		,collapsible:false
                ,padding: 20
		,autoScroll:true
		,listeners:{
            
                        'contextmenu': function(node){
                            this.getSelectionModel().select(node);
                            treeMenu = rightClickMenu(node);
                            if(treeMenu!=null) {
                                treeMenu.show(node.ui.getAnchor());
                            }
                        },


			// create nodes based on data from grid
			beforenodedrop:{fn:function(e) {

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

						// create node from record data
						e.dropNode.push(this.loader.createNode({
							 text:r.get('name')
							,leaf:true
							,grailsLayerId:r.get('id') // identify grails layers by this variable                            
							,qtip:r.get('layers') + " - " + r.get('server.shortAcron')
						}));
					};
                    
                                        // hide the help if it exists                                        
                                        var element = Ext.get('message');
                                        
                                        if(element) {
                                            element.setVisibilityMode(Ext.Element.DISPLAY);
                                            element.fadeOut({duration: 1.5});
                                            // show the submit button
                                            Ext.get('submitMenu').fadeIn();
                                        }
                                        



					// we want Ext to complete the drop, thus return true
					return true;
				}
                                //alert("drop ignored");
				// if we get here the drop is automatically cancelled by Ext
			}}
		}
	});
	// }}}
    
        //tree.getRootNode().expand();
 
	// create and show the window
	var win = new Ext.Panel({
                defaultMargins: 10 ,
		border:false,
                padding: 25,      
                layout:  {
                    type: 'column'          
                  ,align: 'left'
                  
                }
                
                ,pack: 'start',
                align: 'stretch'
		,renderTo:'menuConfigurator'

                ,items:[
                    tree,
                    {                                  
			 xtype:'thegrid'
			,id:'availableLayers'
			,title:'Drag layers to the tree'  
                        ,height: 500
                        ,stripeRows : true
			,enableDragDrop:true
			,ddGroup:'grid2tree'
                    }
                ]
                
	});
	win.doLayout();    
    
 
 
}; 

// {{{
// example grid extension
Example.Grid = Ext.extend(Ext.grid.GridPanel, {
	initComponent:function() {
		var config = {
                            
			 store:new Ext.data.JsonStore({
				url: jsonLayers,
				fields:[
				    {name:'id'}
				   ,{name:'name'}
				   ,{name:'layers'}
				   ,{name:'description'}
				   ,{name:'server.shortAcron'}
				]
			}),
                        width: 600,
			columns:[{
				 id:'grailsLayerId'
				,header:"Id"
                                ,width: 10
                                ,sortable:true
				,dataIndex:'id'
			},{
				 header:"Name"
				,sortable:true
				,dataIndex:'name'
			},{
				 header:"WMS Server"
				,sortable:true
                                ,width: 30
				,dataIndex:'server.shortAcron'
			},{
				 header:"WMS Server Layer Name"
				,sortable:true
				,dataIndex:'layers'
			}]
			,viewConfig:{forceFit:true}
		}; // eo config object

		// apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

		this.bbar = new Ext.PagingToolbar({
			 store:this.store
			,displayInfo:true
			,pageSize:50
		});
		// call parent
		Example.Grid.superclass.initComponent.apply(this, arguments);
	} // eo function initComponent

	,onRender:function() {

		// call parent
		Example.Grid.superclass.onRender.apply(this, arguments);

		// load the store
		this.store.load({params:{start:0, limit:50}});

	} // eo function onRender

});
Ext.reg('thegrid', Example.Grid); 





function rightClickMenu(node){
    var treeMenu = undefined;
    treeMenu = new Ext.menu.Menu({plain: false,shadow:'drop', showSeparator: false});  

    if (!node.isLeaf()) {
        treeMenu.add({
            text:'Add Menu Branch'
            ,node:node
            ,listeners:{
                   click: function(item){
                       Ext.MessageBox.prompt('Node Name', 'Please enter the label for this new branch:', function(status, text) {
                            if (text != "") {
                                node.appendChild({
                                       text: text
                                       ,leaf: false            
                                       ,expanded: true   
                                       ,expandable: true
                                       ,children: []                  

                               });
                               node.expand();
                            }
                            else {
                                Ext.MessageBox.alert('Node not created','You must supply a name for a new branch');
                            }
                       });
                       
                   } 
             }
        });
        
        treeMenu.add({
            text:'Rename'
            ,node:node
            ,listeners:{
                   click: function(item){
                           Ext.MessageBox.prompt('Node Name', 'Please enter the label for this node:', function(status, text) {
                                if (text != "") {
                                    node.setText(text);
                                }
                                else {
                                    Ext.MessageBox.alert('Node not created','You must supply a name for a new node');
                                }
                           }
                           ,this
                            ,false
                            ,node.text
                        );
                       
                       
                   } 
             }
        });
        
        
    }
    if (node.id != "root") {
        treeMenu.add({
            text:'Remove'
            ,node:node
            ,listeners:{
                       click: function(){
                           node.destroy();                       
                       }
                   }        
        })
    }
    
    return treeMenu
        
}





 
// eof
