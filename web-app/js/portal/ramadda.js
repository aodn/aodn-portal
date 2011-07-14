//Ramadda base URL

var ramaddaUrl = 'http://ramadda.aodn.org.au/repository/';
var rootId='21b7aa26-9a0b-492a-9aca-e2ea55dc10d0';
var ramaddaTree;

Ext.onReady(function() {



var ramaddaLoader = new Ext.tree.TreeLoader({
      dataUrl: proxyURL+encodeURIComponent(ramaddaUrl+'?entryid='+rootId+'&output=json')
      ,baseParams: {
           perrito: 'gatito'
       }
      ,createNode: function(attr) {
         testing=attr;
         attr.text=attr.name;
         attr.leaf=!attr.isGroup;
         /*if(attr.isGroup){attr.leaf=false;attr.cls="folder";}
         else{attr.leaf=true;attr.cls="file";}
*/
         //attr.checked = attr.leaf ? false : undefined;
           return(attr.leaf ?
                    new Ext.tree.TreeNode(attr) :
                    new Ext.tree.AsyncTreeNode(attr));// Ext.tree.TreeLoader.superclass.createNode.call(this, attr);
    },
    listeners:{
        beforeload:function(treeLoader, node) {
            this.dataUrl = proxyURL+encodeURIComponent(ramaddaUrl+'?entryid='+node.id+'&output=json')
        }

    }

});

ramaddaTree = new Ext.tree.TreePanel({
     id:'tree'
    ,autoScroll:true
//  ,rootVisible:false
    ,root:{
         nodeType:'async'
        ,id:rootId
        ,expanded:false
        ,name:'AODN Data Repository'
        ,isGroup:'true'
    }
    ,loader: ramaddaLoader

}); // eo tree



    Ext.getCmp('contributorTree').add(ramaddaTree);

    /*
    // create and show window
    var win = new Ext.Window({
         id:'combo-win'
        ,title:'hello'
        ,layout:'fit'
        ,width:280
        ,height:360
        ,closable:false
        ,border:false
        ,items:ramaddaTree
    });

    win.show();
*/
}); // eo onReady




/*
 *
 *
 var rootId='21b7aa26-9a0b-492a-9aca-e2ea55dc10d0';

var root = new Ext.tree.AsyncTreeNode({
            text: 'ramadda',
            draggable:false,
            leaf: false,
            id:'ramadda',
            expanded: false,
            listeners: {
                //expanded:alert("expanding"),
                click: function (node) {
                        alert("clicking"+node.id);
                        loadChildrens(node,rootId);
                }
            }
    });


    var ramaddaTree = new Ext.tree.TreePanel({
        animate: true,
        autoScroll: true,
        nodeType: 'async',
        loader: new Ext.tree.TreeLoader(),
        containerScroll: true,
        border: false,
        
        id: 'ramaddaTree',
        root:root,
         listeners: {
                //beforeload : loadChildrens(root,rootId)
            }
    });

*/
function loadChildrens(node, id){
        Ext.Ajax.request({
               url: proxyURL+encodeURIComponent('http://ramadda.aodn.org.au/repository/entry/show/Data%20Repository.json?entryid='+id+'&output=json'),
               success: function(resp){
                     //alert(resp.responseText);
                     var jsonData= Ext.util.JSON.decode(resp.responseText);
                     if(jsonData.length > 0){

                          for(var i = 0; i < jsonData.length; i++){
                                   entry=jsonData[i];
                                    alert(entry.name);
                                   if(entry.isGroup){
                                       newNode = new Ext.tree.TreeNode({
                                            id: entry.id,
                                            text: entry.name,
                                            expanded: true,
                                            leaf : true,
                                              listeners: {
                                                click: function(node, event){
                                                    alert(node.id);
                                                }
                                            }
                                        });
                                    }else{
                                        newNode = new Ext.tree.TreeNode({
                                            id: entry.id,
                                            text: entry.name,
                                            expanded: true,
                                            leaf : true,
                                              listeners: {
                                                click:  function ( node, event) {
                                                    loadChildrens(node, event,entry.id)
                                                }
                                            }
                                        });

                                    }
                                   node.appendChild(newNode);
                            }
                            
                        }
             },failure: function ( result, request ) {
                   alert("error");
               }
        });
}
