Ext.namespace('Ext.ux');

Ext.ux.Ajax = Ext.Ajax;

Ext.ux.Ajax.proxyUrl = 'proxy?url=';

Ext.ux.Ajax.setContentType = function(params, contentType) {
    if (!params.headers) {
        params.headers = {};
    }
    params.headers['Content-Type'] = contentType;
    return params;
};

Ext.ux.Ajax.proxyRequest = function(params) {
    params.url = Ext.ux.Ajax.constructProxyUrl(params.url);
    Ext.Ajax.request(params);
};

Ext.ux.Ajax.proxyRequestXML = function(params) {
    params = Ext.ux.Ajax.setContentType(params, 'application/xml');
    Ext.ux.Ajax.proxyRequest(params);
};

Ext.ux.Ajax.proxyRequestJSON = function(params) {
    params = Ext.ux.Ajax.setContentType(params, 'application/json');
    Ext.ux.Ajax.proxyRequest(params);
};

Ext.ux.Ajax.constructProxyUrl = function(url) {
    return Ext.ux.Ajax.proxyUrl + encodeURIComponent(url);
};
