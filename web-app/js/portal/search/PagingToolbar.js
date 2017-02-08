Ext.namespace('Portal.search');
/*
Created so the items can be styled as fit for the portal
Cloned from Ext.PagingToolbar
 */

Portal.search.PagingToolbar = Ext.extend(Ext.Toolbar, {

    pageSize : 20,
    displayMsg : 'Displaying {0} - {1} of {2}',
    emptyMsg : 'No data to display',
    beforePageText : 'Page',
    afterPageText : 'of {0}',
    firstText : 'First Page',
    prevText : 'Previous Page',
    nextText : 'Next Page',
    lastText : 'Last Page',
    refreshText : 'Scroll to top',

    initComponent : function(){

        this.items = [
            this.first = new Ext.Toolbar.Button({
            tooltip: this.firstText,
            overflowText: this.firstText,
            iconCls: 'fa fa-fast-backward',
            disabled: true,
            handler: this.moveFirst,
            scope: this
        }), this.prev = new Ext.Toolbar.Button({
            tooltip: this.prevText,
            overflowText: this.prevText,
            iconCls: 'fa fa-backward',
            disabled: true,
            handler: this.movePrevious,
            scope: this
        }), '-', this.beforePageText,
            this.inputItem = new Ext.form.NumberField({
                cls: 'x-tbar-page-number',
                allowDecimals: false,
                allowNegative: false,
                enableKeyEvents: true,
                selectOnFocus: true,
                submitValue: false,
                listeners: {
                    scope: this,
                    keydown: this.onPagingKeyDown,
                    blur: this.onPagingBlur
                }
            }), this.afterTextItem = new Ext.Toolbar.TextItem({
                text: String.format(this.afterPageText, 1)
            }), '-', this.next = new Ext.Toolbar.Button({
                tooltip: this.nextText,
                overflowText: this.nextText,
                iconCls: 'fa fa-forward',
                disabled: true,
                handler: this.moveNext,
                scope: this
            }), this.last = new Ext.Toolbar.Button({
                tooltip: this.lastText,
                overflowText: this.lastText,
                iconCls: 'fa fa-fast-forward',
                disabled: true,
                handler: this.moveLast,
                scope: this
            }), '-', this.refresh = new Ext.Toolbar.Button({
                tooltip: this.refreshText,
                overflowText: this.refreshText,
                iconCls: 'fa fa-arrow-up',
                handler: this.reloadPage,
                scope: this
            })
        ];

        Portal.search.PagingToolbar.superclass.initComponent.call(this);

        this.addEvents(
            'change',
            'beforechange'
        );
        this.on('afterlayout', this.onFirstLayout, this, {single: true});
        this.cursor = 0;
        this.bindStore(this.store, true);
    },

    onFirstLayout : function(){
        if(this.dsLoaded){
            this.onLoad.apply(this, this.dsLoaded);
        }
    },

    updateInfo : function(){
        if(this.displayItem){
            var count = this.store.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, this.store.getTotalCount()
                );
            this.displayItem.setText(msg);
        }
    },

    onLoad : function(store, r, o){
        if(!this.rendered){
            this.dsLoaded = [store, r, o];
            return;
        }
        var p = this.getParams();
        this.cursor = (o.params && o.params[p.start]) ? o.params[p.start] : 0;
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;

        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.inputItem.setValue(ap);
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    },

    getPageData : function(){
        var total = this.store.getTotalCount();
        return {
            total : total,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
        };
    },

    changePage : function(page){
        this.doLoad(((page-1) * this.pageSize).constrain(0, this.store.getTotalCount()));
    },

    // private
    onLoadError : function(){
        if(!this.rendered){
            return;
        }
        this.refresh.enable();
    },

    // private
    readPage : function(d){
        var v = this.inputItem.getValue(), pageNum;
        if (!v || isNaN(pageNum = parseInt(v, 10))) {
            this.inputItem.setValue(d.activePage);
            return false;
        }
        return pageNum;
    },

    onPagingFocus : function(){
        this.inputItem.select();
    },

    //private
    onPagingBlur : function(e){
        this.inputItem.setValue(this.getPageData().activePage);
    },

    // private
    onPagingKeyDown : function(field, e){
        var k = e.getKey(), d = this.getPageData(), pageNum;
        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = this.readPage(d);
            if(pageNum !== false){
                pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
                this.doLoad(pageNum * this.pageSize);
            }
        }else if (k == e.HOME || k == e.END){
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : d.pages;
            field.setValue(pageNum);
        }else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN){
            e.stopEvent();
            if((pageNum = this.readPage(d))){
                var increment = e.shiftKey ? 10 : 1;
                if(k == e.DOWN || k == e.PAGEDOWN){
                    increment *= -1;
                }
                pageNum += increment;
                if(pageNum >= 1 & pageNum <= d.pages){
                    field.setValue(pageNum);
                }
            }
        }
    },

    // private
    getParams : function(){
        //retain backwards compat, allow params on the toolbar itself, if they exist.
        return this.paramNames || this.store.paramNames;
    },

    // private
    beforeLoad : function(){
        if(this.rendered && this.refresh){
            this.refresh.disable();
        }
    },

    // private
    doLoad : function(start){
        var o = {}, pn = this.getParams();
        o[pn.start] = start;
        o[pn.limit] = this.pageSize;
        if(this.fireEvent('beforechange', this, o) !== false){
            this.store.load({params:o});
        }
    },

    /**
     * Move to the first page, has the same effect as clicking the 'first' button.
     */
    moveFirst : function(){
        this.doLoad(0);
    },

    /**
     * Move to the previous page, has the same effect as clicking the 'previous' button.
     */
    movePrevious : function(){
        this.doLoad(Math.max(0, this.cursor-this.pageSize));
    },

    /**
     * Move to the next page, has the same effect as clicking the 'next' button.
     */
    moveNext : function(){
        this.doLoad(this.cursor+this.pageSize);
    },

    /**
     * Move to the last page, has the same effect as clicking the 'last' button.
     */
    moveLast : function(){
        var total = this.store.getTotalCount(),
            extra = total % this.pageSize;

        this.doLoad(extra ? (total - extra) : total - this.pageSize);
    },

    reloadPage : function(){
        this.doLoad(this.cursor);
    },

    bindStore : function(store, initial){
        var doLoad;
        if(!initial && this.store){
            if(store !== this.store && this.store.autoDestroy){
                this.store.destroy();
            }else{
                this.store.un('beforeload', this.beforeLoad, this);
                this.store.un('load', this.onLoad, this);
                this.store.un('exception', this.onLoadError, this);
            }
            if(!store){
                this.store = null;
            }
        }
        if(store){
            store = Ext.StoreMgr.lookup(store);
            store.on({
                scope: this,
                beforeload: this.beforeLoad,
                load: this.onLoad,
                exception: this.onLoadError
            });
            doLoad = true;
        }
        this.store = store;
        if(doLoad){
            this.onLoad(store, null, {});
        }
    },

    unbind : function(store){
        this.bindStore(null);
    },

    bind : function(store){
        this.bindStore(store);
    },

    onDestroy : function(){
        this.bindStore(null);
        Portal.search.PagingToolbar.superclass.onDestroy.call(this);
    }

});
Ext.reg('portal.search.pagingtoolbar', Portal.search.PagingToolbar);