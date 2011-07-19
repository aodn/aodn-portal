
var store;
var grid;
var filterTextField
Ext.onReady(function(){

	
     var reader=new Ext.data.JsonReader(
            {
            },[
                     {name:'id', type:'string'}
                    ,{name:'name', type:'string'}
                    ,{name:'type', type:'string'}
            ]
        )
     store=new Ext.data.JsonStore(    {
          url: proxyURL+encodeURIComponent('http://ramadda.aodn.org.au/repository/search/do?search.type=search.type.text&search.submit.y=0&search.submit.x=0&text=matias&output=json')
          ,fields: ['id', 'name', {name:'type', type: 'string'},'icon']

     });

     store.load();


    // create the grid
    grid = new Ext.grid.GridPanel({
        store: store,
        columns: [
            
            //{header: "icon", width: 30, dataIndex: 'icon', sortable: true},
            {header: "name", width: 400, dataIndex: 'name', sortable: true},
            {header: "id", width: 200, dataIndex: 'id', sortable: true},
            {header: "type", width: 60, dataIndex: 'type', sortable: true}
        ]
        ,autoHeight:true
        ,emptyText:'Use the search box'
    });

    filterTextField = new Ext.form.TextField({
            enableKeyEvents: true,
            width: 100,
            id: 'unique id',
            fieldLabel: 'search',
            name: 'unique name'
        });

        filterTextField.on('specialkey', function(form,e){
           
            if (e.button == 12) {
                store=new Ext.data.JsonStore(    {
                      url: proxyURL+encodeURIComponent('http://ramadda.aodn.org.au/repository/search/do?search.type=search.type.text&search.submit.y=0&search.submit.x=0&text='+filterTextField.getRawValue()+'&output=json')
                      ,fields: ['id', 'name', {name:'type', type: 'string'},'icon']
                      ,baseParams:{hello:'hello'}
                 });
                
                grid.store=store;
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
                    /*,buttons: [{
                            text: 'Search',
                            click: function()
                            {
                                alert('hello');
                            }
                        }]*/
                    }]
        }       ,grid]
    });
    win.show();

});