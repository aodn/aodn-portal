/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Ext4.ux');

Ext4.ux.Ajax = Ext4.Ajax;

Ext4.ux.Ajax.proxyUrl = 'proxy?url=';

Ext4.ux.Ajax.setContentType = function(params, contentType) {
    if (!params.headers) {
        params.headers = {};
    }
    params.headers['Content-Type'] = contentType;
    return params;
};

Ext4.ux.Ajax.proxyRequest = function(params) {
    params.url = Ext4.ux.Ajax.constructProxyUrl(params.url);
    Ext4.Ajax.request(params);
};

Ext4.ux.Ajax.proxyRequestXML = function(params) {
    params = Ext4.ux.Ajax.setContentType(params, 'application/xml');
    Ext4.ux.Ajax.proxyRequest(params);
};

Ext4.ux.Ajax.proxyRequestJSON = function(params) {
    params = Ext4.ux.Ajax.setContentType(params, 'application/json');
    Ext4.ux.Ajax.proxyRequest(params);
};

Ext4.ux.Ajax.constructProxyUrl = function(url) {
    return Ext4.ux.Ajax.proxyUrl + encodeURIComponent(url);
};
