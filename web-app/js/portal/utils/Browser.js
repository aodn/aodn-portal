/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.utils.Browser');

Portal.utils.Browser.majorVersion = $.browser.version.split('.')[0];

Portal.utils.Browser.imgSrcReload = $.browser.mozilla != true || (Portal.utils.Browser.majorVersion != 27 && Portal.utils.Browser.majorVersion != 28);

