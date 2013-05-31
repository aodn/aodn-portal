/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.MessageBox.alert = function () {
};

//overwrite Ext.Ajax.request so it doesn't try to make requests.
Ext.Ajax.request = function(options) {
}