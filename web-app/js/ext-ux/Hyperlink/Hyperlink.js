/*
 adapted from : http://www.sencha.com/forum/showthread.php?89386-Ext.ux.Hyperlink
 Sencha Inc
 Andrea Cammarata, Solutions Engineer
 CEO at SIMACS

 @AndreaCammarata
 www.andreacammarata.com
 github: https://github.com/AndreaCammarata
*/

Ext.namespace('Ext.ux');


Ext.ux.Hyperlink = Ext.extend(Ext.form.Label, {
    
    iconCls: '',
    cls: 'x-hyperlink',

    initComponent : function(){
        this.addEvents(
            'click'
        );
        
        this.template = '<div id="{0}-box" class="x-hyperlink"><a id="{0}-anchor" class="x-hyperlink-anchor {1}">{2}</a></div>';

        Ext.ux.Hyperlink.superclass.initComponent.call(this);
    },
    
    onRender: function(ct, position){

        Ext.ux.Hyperlink.superclass.onRender.call(this, ct, position);
        
        this.mon(this.el, {
            scope: this,
            click: this.click
        });
        this.doLayout();
    },
    
    click: function(e){
        this.fireEvent('click', this);
    },
    
    setText: function(text){
        this.text = text;
        this.doLayout();
    },
    
    setIconCls: function(iconCls){
        this.iconCls = iconCls;
        this.doLayout();
    },
    
    doLayout: function(){
        if (!this.rendered) return;
        var html = String.format(this.template, this.el.id, this.iconCls, this.text);
        Ext.fly(this.el.id).dom.innerHTML = html;
    }
});

Ext.reg('hyperlink', Ext.ux.Hyperlink);