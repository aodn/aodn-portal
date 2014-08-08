/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Ext.ux');

Ext.ux.Ajax = Ext.Ajax;

Ext.ux.Ajax.proxyUrl = 'proxy?url=';

Ext.ux.Ajax.proxyRequest = function(params) {
    params.url = Ext.ux.Ajax.constructProxyUrl(params.url);
    Ext.Ajax.request(params);
};

Ext.ux.Ajax.constructProxyUrl = function(url) {
    return Ext.ux.Ajax.proxyUrl + encodeURIComponent(url);
}
