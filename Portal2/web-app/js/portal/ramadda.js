//Ramadda base URL

var ramaddaUrl = 'http://ramadda.aodn.org.au/repository/';
var ramaddaHost = 'http://ramadda.aodn.org.au';
var ramaddaPath='/repository/';
var rootId='21b7aa26-9a0b-492a-9aca-e2ea55dc10d0';
var ramaddaTree;
var ramaddaInfoWindow =null;
var testingRamadda;

function addRamadda() {

    ramaddaTree=ramaddaFolderToTree('AODN data repository','ramaddaTree',rootId,ramaddaHost,ramaddaPath);
    ramaddaTreeWMS=ramaddaFolderToTree('WMS Servers','ramaddaTreeWMS','f48cd9c1-fee8-42f8-8bfc-aa0cbcea673f',ramaddaHost,ramaddaPath);
    
    Ext.getCmp('contributorTree').add(ramaddaTree);
    Ext.getCmp('contributorTree').add(ramaddaTreeWMS);
   
}

/* Given a root ID, ramadda base URL, folder title
 * create a tree 
 */
function ramaddaFolderToTree(rootLabel,treeId,rootId,ramaddaHost,ramaddaPath ){
    var ramaddaUrl=ramaddaHost+ramaddaPath;
    var ramaddaLoader = new Ext.tree.TreeLoader({
          dataUrl: proxyURL+encodeURIComponent(ramaddaUrl+'?entryid='+rootId+'&output=json')
          ,createNode: function(attr) {

             attr.text=attr.name;
             attr.leaf=!attr.isGroup;
             if(attr.id!=rootId){
                attr.icon=ramaddaHost+attr.icon;
             }
             return(attr.leaf ?
                        new Ext.tree.TreeNode(attr) :
                        new Ext.tree.AsyncTreeNode(attr));// Ext.tree.TreeLoader.superclass.createNode.call(this, attr);
           }
           ,listeners:{
                beforeload:function(treeLoader, node) {
                    this.dataUrl = proxyURL+encodeURIComponent(ramaddaUrl+'?entryid='+node.id+'&output=json')
                }
           }
    });

    tree = new Ext.tree.TreePanel({
         id:treeId
         ,autoHeight: true
          ,border: false
          ,rootVisible: true
        ,root:{
             nodeType:'async'
            ,id:rootId
            ,expanded:false
            ,name:rootLabel
            ,isGroup:'true'
        }
        ,loader: ramaddaLoader
    });
    
    tree.on("contextmenu",function(node,event){
                    this.getSelectionModel().select(node);
                    treeMenu = createEntryMenu(node);
                    if(treeMenu!=null)
                        treeMenu.show(node.ui.getAnchor());
    });
    return tree;

}

function ramaddaBrowseFolderWindow(rootLabel,treeId,rootId,ramaddaHost,ramaddaPath){
     var win = new Ext.Window({
                id:treeId+'_window',
                width:400,
                height:400,
                maximizable: true,
                collapsible: true,
                autoScroll: true,
                title:rootLabel,
                items: [
                    ramaddaFolderToTree(rootLabel,treeId+"_tree",rootId,ramaddaHost,ramaddaPath)
                ]
         });
      win.show();

}

function createEntryMenu(node){
   var treeMenu = undefined;
    treeMenu = new Ext.menu.Menu();

    // Show information about the entry
    treeMenu.add({
        text:'information'
        ,node:node
        ,listeners:{
                   click: function(item){
                       showInfoRamaddaEntry(item);
                   }
               }
        
    })

    // To browse WMS layers into the portal
    if(node.attributes.type=="wmsserver"){
        treeMenu.add({
            text:'browse WMS server'
            ,node:node
             ,listeners:{
                   click: function(item){
                       addWMStoTree(item);
                   }
               }
        });
    }
     // To browse WMS layers into the portal
    if(node.attributes.isGroup){
        treeMenu.add({
            text:'Browse Folder new window'
            ,node:node
             ,listeners:{
                   click: function(item){
                      var entry = item.node.attributes;
                      testingRamadda=item;
                      ramaddaBrowseFolderWindow(entry.name,entry.id,entry.id,ramaddaHost,ramaddaPath);
                   }
               }
        });
    }
    if(node.attributes.links!=undefined){
        for(i=0;i< node.attributes.links.length;i++){
                link=node.attributes.links[i];
                treeMenu.add(
                    {
                       text:link.label
                       ,icon: ramaddaHost+link.icon
                       ,url: ramaddaHost+link.url
                       ,label: link.label
                       ,listeners:{
                           click: function(item){
                               ramaddaHandler(item.url,item.label);
                           }
                       }
                    }
                );
        }
        
        return treeMenu;
    }return null;
}


function showInfoRamaddaEntry(item){
    node=item.node;
    if(ramaddaInfoWindow!=null){
        ramaddaInfoWindow.close();
    }

    html='<h1><img src='+node.attributes.icon+'>'+node.attributes.name+'<h1>';
    html+='<p>'+node.attributes.description+'<p>';
    
    if(node.attributes.metadata.length>0){
        html+='<ul>';
        for(var i=0; i<node.attributes.metadata.length;i++){
            metadata=node.attributes.metadata[i];
            html+='<li>'+metadata.type+' - '+metadata.attr1+' - '+metadata.attr2+' - '+metadata.attr3+'</li>';
        }
        html+='</ul>';
    }


    ramaddaInfoWindow = new Ext.Window({
            id:'ramaddaInfoWindow',
            width:400,
            height:400,
            maximizable: true,
            collapsible: true,
            autoScroll: true,
            title:node.label,
            html:html
    });
    
    ramaddaInfoWindow.show();
}


function ramaddaHandler(url,label){
    
    // This is the default handler probably we have to make available only
    // The entries that you want.
    if(ramaddaInfoWindow!=null){
        ramaddaInfoWindow.close();
    }

    ramaddaInfoWindow = new Ext.Window({
            id:'ramaddaInfoWindow',
            width:400,
            height:400,
            maximizable: true,
            collapsible: true,
            autoScroll: true,
            title:label
    });

    ramaddaInfoWindow.add({
        xtype : "component",
        autoEl : {
            tag : "iframe",
            src : url+'&templateurl=contentaodnStyle',
            align: 'left',
            scrolling: 'auto',
            marginheight: '0',
            marginwidth: '0',
            frameborder: '2'

        }
    })
    ramaddaInfoWindow.on('resize', function(ramaddaInfoWindow,w,h){
      Ext.get(ramaddaInfoWindow.id).query('iframe')[0].style.height = h;
      Ext.get(ramaddaInfoWindow.id).query('iframe')[0].style.width = w;
    });
    ramaddaInfoWindow.on('show', function(ramaddaInfoWindow){
      Ext.get(ramaddaInfoWindow.id).query('iframe')[0].style.height = this.height;
      Ext.get(ramaddaInfoWindow.id).query('iframe')[0].style.width = this.width;
    });
    ramaddaInfoWindow.show();
}

function addWMStoTree(item){
            attributes=item.node.attributes;
            Ext.getCmp('contributorTree').add(
                new Ext.tree.TreePanel({
                    root: new Ext.tree.AsyncTreeNode({
                            text: attributes.name,
                            loader: new GeoExt.tree.WMSCapabilitiesLoader({
                                    url: proxyURL+encodeURIComponent(attributes.filename+"SERVICE=WMS&version="+attributes.extraColumns[1]['1']+"&request=GetCapabilities"),
                                    layerOptions: {buffer: 0,  ratio: 1},
                                    layerParams: {'TRANSPARENT': 'TRUE', 'VERSION' : attributes.extraColumns[1]['1'],
                                                   'serverType':attributes.extraColumns[0]['0']},

                                    // customize the createNode method to add a checkbox to nodes
                                    createNode: function(attr) {
                                            attr.checked = attr.leaf ? false : undefined;
                                            //attr.active=attr.leaf ? false : undefined;;
                                            return GeoExt.tree.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
                                    }
                            })
                    })
                    ,
                    width: 250,
                    autoHeight: true,
                    border: false,

                    rootVisible: true,
                    listeners: {
                        // Add layers to the map when ckecked, remove when unchecked.
                        // Note that this does not take care of maintaining the layer
                        // order on the map.
                        'checkchange': function(node,checked) {
                            if (checked === true) {
                                    if (node.attributes.layer.serverType=='ncWMS'){
                                            node.attributes.layer.yx = true;
                                            node.attributes.layer.isncWMS =true;
                                    }
                                    mapPanel.map.addLayer(node.attributes.layer);
                            } else {
                                    mapPanel.map.removeLayer(node.attributes.layer);
                        }
                    }
                }
            })
       );
       Ext.getCmp('contributorTree').doLayout();
}

var store;
var grid;
var filterTextField

function ramaddaSearchWindow(){


    filterTextField = new Ext.form.TextField({
            enableKeyEvents: true,
            width: 100,
            id: 'unique id',
            fieldLabel: 'search',
            name: 'unique name'
        });

     var reader=new Ext.data.JsonReader(
            {
            },[
                     {name:'id', type:'string'}
                    ,{name:'name', type:'string'}
                    ,{name:'type', type:'string'},
                    ,{name:'icon', type:'string'},
            ]
        )

    store = new Ext.data.JsonStore(    {
                      url:'proxy',
                      method:'GET',
                      baseParams:{
                          url: '',
                          format:'text/html'
                      },
                      fields: ['id', 'name', {name:'type', type: 'string'},'icon'],
                      reader:reader

                   });
    // create the grid
    grid = new Ext.grid.GridPanel({
        store: store,
        columns: [

            //{header: "icon", width: 30, dataIndex: 'icon', sortable: true},
            {header: "icon", width: 60, dataIndex: 'icon', sortable: false,renderer:renderIcon},
            {header: "name", width: 400, dataIndex: 'name', sortable: true},
            {header: "id", width: 200, dataIndex: 'id', sortable: true},
            {header: "type", width: 60, dataIndex: 'type', sortable: true}
            /* add other renderers for example button to browse the folder,
            {header: "browse", width: 60, dataIndex: 'type', renderer:renderBrowse},*/

        ]
        ,autoHeight:true
        ,autoWidth:true
        ,emptyText:'Use the search box'
        /*,listeners:{
            rowcontextmenu: function(grid, index, event){
                                 event.stopEvent();
                                 grid.getSelectionModel().selectRow(index);
                                 var contexMenu= createRamaddaGridContextMenu(grid,index)
                                 contexMenu.showAt(event.xy);
                            }
        }*/
    });


    filterTextField.on('specialkey', function(form,e){
            // Press enter key
            if (e.button == 12) {
                 grid.getStore().baseParams.url='http://ramadda.aodn.org.au/repository/search/do?search.type=search.type.text&search.submit.y=0&search.submit.x=0&text='+filterTextField.getRawValue()+'&output=json';
                 grid.getStore().load();
            }
        });


     var win = new Ext.Window({
            id:'ramaddaSearch',
            width:400,
            height:400,
            maximizable: true,
            collapsible: true,
            autoScroll: true,
            title:'Ramadda Search',
            items: [{
                     id:'fs2col-form'
                    ,xtype:'form'
                    ,layout:'column'
                    ,frame:true
                    ,labelWidth:50
                    // these are applied to columns
                    ,defaults:{
                         columnWidth:0.5
                        ,layout:'form'
                        ,hideLabels:true
                        ,border:false
                        ,bodyStyle:'padding:4px'
                    }
                    // columns
                    ,items:[{
                        // these are applied to fieldsets
                         defaults:{xtype:'fieldset', layout:'form', anchor:'100%', autoHeight:true}
                        // fieldsets
                        ,items:[
                            {
                                 title:'Search in ramadda'
                                ,defaultType:'textfield'
                                ,id:'textsearch'
                                // these are applied to fields
                                ,defaults:{anchor:'-20', allowBlank:false}

                                // fields
                                ,items:[filterTextField]
                        }]
                    }]
        }       ,grid]
    });

    win.show();

}

function createRamaddaGridContextMenu(grid,index){
    
    var contextMenu = undefined;
    contextMenu = new Ext.menu.Menu({
        items: [{
            id: 'someAction',
            text: 'someAction',
            node: grid.getSelectionModel().getSelected()
        }],
        listeners: {
                itemclick: function(item) {
                    testingRamadda=item;
                    ramaddaBrowseFolderWindow(item.node.json.name,item.node.json.id,item.node.json.id,ramaddaHost,ramaddaPath)
                }
            }
        });
    return contextMenu;

}

// Function to render grid results from a search
function renderIcon(val) {
    return '<img src="' +ramaddaHost+ val + '">';
}

function renderBrowse(val) {
    return '<img src="' +ramaddaHost+ val + '">';
}