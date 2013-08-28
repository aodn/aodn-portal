/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

// Override Ext LoadMask to provide a LoadMask that doesn't mask (grey out)
// the element being masked - just overlay a message

Portal.common.LoadMask = Ext.extend(Ext.LoadMask, {


    initComponent: function(){
        console.log(arguments);
        Portal.common.LoadMask.superclass.initComponent.apply(this, arguments);
    },


    onLoad: function(){
        var dom = this.el.dom,
            maskMsg = Ext.Element.data(dom, 'maskMsg');

        if (maskMsg) {
            maskMsg.remove();
            Ext.Element.data(dom, 'maskMsg', undefined);
        }
    },

    // override default masking behaviour

    onBeforeLoad: function(){
        var me = this,
            dom = me.el.dom,
            dh = Ext.DomHelper;

        var mm = dh.append(dom, {cls: 'ext-el-mask-msg', cn: {tag: 'div'}}, true);
        Ext.Element.data(dom, 'maskMsg', mm);
        mm.dom.className = 'ext-el-mask-msg ' + me.msgCls;
        mm.dom.firstChild.innerHTML = me.msg;
        mm.setDisplayed(true);
        mm.center(me.el);
        if (this.setTop) {
            //mm.setTop(this.top);
        }

    }

});
