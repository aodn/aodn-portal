Ext.ns('Ext.ux');
Ext.ux.ComponentDataView = Ext.extend(Ext.DataView, {
    items: [],
    defaultType: 'textfield',
    initComponent : function(){
        Ext.ux.ComponentDataView.superclass.initComponent.call(this);
        this.components = [];
    },
    refresh : function(){
        Ext.destroy(this.components);
        this.components = [];
        Ext.ux.ComponentDataView.superclass.refresh.call(this);
        this.renderItems(0, this.store.getCount() - 1);
    },
    onUpdate : function(ds, record){
        var index = ds.indexOf(record);
        if(index > -1){
            this.destroyItems(index);
        }
        Ext.ux.ComponentDataView.superclass.onUpdate.apply(this, arguments);
        if(index > -1){
            this.renderItems(index, index);
        }
    },
    onAdd : function(ds, records, index){
        var count = this.all.getCount();
        Ext.ux.ComponentDataView.superclass.onAdd.apply(this, arguments);
        if(count !== 0){
            this.renderItems(index, index + records.length - 1);
        }
    },
    onRemove : function(ds, record, index){
        this.destroyItems(index);
        Ext.ux.ComponentDataView.superclass.onRemove.apply(this, arguments);
    },
    onDestroy : function(){
        Ext.ux.ComponentDataView.superclass.onDestroy.call(this);
        Ext.destroy(this.components);
        this.components = [];
    },
    renderItems : function(startIndex, endIndex){
        var ns = this.all.elements;
        var args = [startIndex, 0];
        for(var i = startIndex; i <= endIndex; i++){
            var r = args[args.length] = [];
            for(var items = this.items, j = 0, k = 0, len = items.length, c; j < len; j++){
               var nodes = undefined;
               if(items[j].renderTarget){
                  nodes = Ext.DomQuery.jsSelect(items[j].renderTarget, ns[i]);
               }else if(items[j].applyTarget){
                  nodes = Ext.DomQuery.jsSelect(items[j].applyTarget, ns[i]);
               }else{
                  nodes = [ns[i]];
               }
               for (var n = 0; n < nodes.length; n++) {
                   c = items[j].render ?
                       c = items[j].cloneConfig() :
                       Ext.create(items[j], this.defaultType);
                   r[k++] = c;
                   if(c.renderTarget){
                       c.render(nodes[n]);
                   }else if(c.applyTarget){
                       c.applyToMarkup(nodes[n]);
                   }else{
                       c.render(nodes[n]);
                   }
                   if(Ext.isFunction(c.setValue) && c.applyValue){
                       c.setValue(this.store.getAt(i).get(c.applyValue));
                       c.on('blur', function(f){
                        this.store.getAt(this.index).data[this.dataIndex] = f.getValue();
                       }, {store: this.store, index: i, dataIndex: c.applyValue});
                   }
                }
            }
        }
        this.components.splice.apply(this.components, args);
    },
    destroyItems : function(index){
        Ext.destroy(this.components[index]);
        this.components.splice(index, 1);
    }
});
Ext.reg('compdataview', Ext.ux.ComponentDataView);