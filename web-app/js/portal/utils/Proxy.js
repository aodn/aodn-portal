Ext.namespace('Portal.utils');
Ext.namespace('Portal.utils.Proxy');

Portal.utils.Proxy.proxyURL = "proxy?url=";

Portal.utils.Proxy.proxy = function(url) {
    return this.proxyURL + encodeURIComponent(url);
};
