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

