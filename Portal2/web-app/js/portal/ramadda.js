var rootId='21b7aa26-9a0b-492a-9aca-e2ea55dc10d0';

var Tree = Ext.tree;
 var ramaddaTree = new Ext.tree.TreePanel({
        text: 'ramadda',
        expanded: false,
        loader: new Tree.TreeLoader(),
        selModel: new Ext.tree.MultiSelectionModel(),
        root : new Ext.tree.AsyncTreeNode({
            text: 'ramadda',
            draggable:false,
            leaf: false,
            id:'ramadda',
            listeners: {
                load: function (node, event) {
                        alert("node.id");

                },
                expand: function (node, event) {
                        alert("node.id");
                        
                },
                click: function (node) {
                        alert(node.id);
                        loadChildrens(node,rootId);
                }
            }
         })        
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


