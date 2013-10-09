
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

Portal.common.LoadMask = Ext.extend(Ext.LoadMask, {


    showAtTop: function() {

        this.show();

        if (this.setTopPixels) {
            var msg = Ext.get(this.el.dom).down('.ext-el-mask-msg');
            if (msg.getBox().y > (this.setTopPixels * 4)) {
                msg.setTop(this.setTopPixels);
            }
        }
    }

});