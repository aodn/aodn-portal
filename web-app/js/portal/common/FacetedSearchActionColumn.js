Ext.namespace('Portal.common');

Portal.common.FacetedSearchActionColumn = Ext.extend(Ext.grid.ActionColumn, {

    // override ActionColumn constructor with one that does the same but allows tooltips to be
    // set on a row by row basis per item using a GetTooltip configuration function as an alternative to
    // specifying a static tooltip per item
    constructor: function(cfg) {
        var me = this;
        var items = cfg.items || (me.items = [me]);
        var l = items.length;
        var i;
        var item;

        Ext.grid.ActionColumn.superclass.constructor.call(me, cfg);

//      Renderer closure iterates through items creating an <img> element for each and tagging with an identifying
//      class name x-action-col-{n}
        me.renderer = function(v, meta, r) {
//          Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
            v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments)||'' : '';

            var rec = r.data;

            var titleMarkup = "<div style=\"white-space:normal !important;\" title=\"" + rec.abstract + "\"><p>" + rec.title + "</p></div>";

            v += '<table style="border: 0; width: 100%;">\n<tr><td>' + titleMarkup + '</td></tr>\n';
            v += '<tr><td align="right">\n';

            meta.css += ' x-action-col-cell';
            for (i = 0; i < l; i++) {
                item = items[i];
                v += '<img alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                    '" width="30px" height="16px"' +
                    ' class="x-action-col-icon x-action-col-' + String(i) + ' ' + (item.iconCls || '') +
                    ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope||this.scope||this, arguments) : '') + '"' +
                    ((item.tooltip) ? ' ext:qtip="' + item.tooltip + '"' : '') +
                    (Ext.isFunction(item.getTooltip) ? ' ext:qtip="' + item.getTooltip.apply(item.scope||this.scope||this, arguments) + '"' : '') + ' />';
            }

            v += '</td></tr></table>';

            return v;
        };
    }

});

//Register column xtype

Ext.grid.Column.types['portal.common.facetedsearchactioncolumn'] = Portal.common.FacetedSearchActionColumn;
