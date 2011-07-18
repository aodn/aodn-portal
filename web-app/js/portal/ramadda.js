//Ramadda base URL

var ramaddaUrl = 'http://ramadda.aodn.org.au/repository/';
var ramaddaHost = 'http://ramadda.aodn.org.au';
var ramaddaPath='/respository/';
var rootId='21b7aa26-9a0b-492a-9aca-e2ea55dc10d0';
var ramaddaTree;

Ext.onReady(function() {



    var ramaddaLoader = new Ext.tree.TreeLoader({
          dataUrl: proxyURL+encodeURIComponent(ramaddaUrl+'?entryid='+rootId+'&output=json')
          ,createNode: function(attr) {

             attr.text=attr.name;
             attr.leaf=!attr.isGroup;

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

    ramaddaTree = new Ext.tree.TreePanel({
         id:'tree'
        ,autoScroll:true
        ,root:{
             nodeType:'async'
            ,id:rootId
            ,expanded:false
            ,name:'AODN Data Repository'
            ,isGroup:'true'
        }
        ,loader: ramaddaLoader
    });

    Ext.getCmp('contributorTree').add(ramaddaTree);

    ramaddaTree.on("contextmenu",function(node,event){
                    ramaddaTree.getSelectionModel().select(node);
                    treeMenu = createEntryMenu(node);
                    if(treeMenu!=null)
                        treeMenu.show(node.ui.getAnchor());
    });
      


});

function createEntryMenu(node){
    var treeMenu = undefined;
    treeMenu = new Ext.menu.Menu({
                items: [
                {
                }]});
    testing=node;
    if(node.attributes.links!=undefined){
        for(i=0;i< node.attributes.links.length;i++){
                link=node.attributes.links[i];
                treeMenu.add(
                    {
                       text:link.label
                       ,icon: ramaddaHost+link.icon
                       ,url: ramaddaHost+link.url
                       ,labe: link.label
                       //,handler: ramaddaHandler(ramaddaHost+link.url,link.label)
                    }
                    /*,
                    {
                      xtype: 'box'
                      ,autoEl: {

                        icon: ramaddaHost+link.icon,
                        tag: 'a',
                        href: ramaddaHost+link.url,
                        target:'_blank',
                        cn: link.label
                       

                      }
                    }*/
                );
        }
        treeMenu.on('click', function(menu, item){
            ramaddaHandler(item.url,item.label);
        });
        return treeMenu;
    }return null;
}





function ramaddaHandler(url,label){
    var win = new Ext.Window({
            id:'ramaddaInfoWindow',
            width:400,
            height:400,
            maximizable: true,
            collapsible: true,
            autoScroll: true,
            title:label
    });
    win.add({
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
    win.on('resize', function(win,w,h){
      Ext.get(win.id).query('iframe')[0].style.height = h;
      Ext.get(win.id).query('iframe')[0].style.width = w;
    });
    win.on('show', function(win){
      Ext.get(win.id).query('iframe')[0].style.height = this.height;
      Ext.get(win.id).query('iframe')[0].style.width = this.width;
    });
    win.show();
};





