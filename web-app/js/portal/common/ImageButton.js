
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

Portal.common.ImageButton = Ext.extend(Ext.Button, {
  initComponent: function() {
        Portal.common.ImageButton.superclass.initComponent.apply(this, arguments);

        if (!this.template) {
            if (!Portal.common.ImageButton.buttonTemplate) {
                Portal.common.ImageButton.buttonTemplate = new Ext.Template(
                    '<table id="{4}" cellspacing="0" class="x-btn {3}"><tbody class="{1}">',
                    '<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
                    '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><em class="{2}" unselectable="on"><button type="{0}"></button></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
                    '<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
                    '</tbody></table>');
                Portal.common.ImageButton.buttonTemplate.compile();
            }
            this.template = Portal.common.ImageButton.buttonTemplate;
        }
    }
});

