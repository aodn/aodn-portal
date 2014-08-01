/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.utils');
Ext.namespace('Portal.utils.Proxy');

Portal.utils.Proxy.proxyURL = "proxy?url=";

Portal.utils.Proxy.proxy = function(url) {
    if (Portal.app.appConfig.proxyWmsRequests) {
        return this.proxyURL + encodeURIComponent(url);
    }
    else {
        return url;
    }
};
