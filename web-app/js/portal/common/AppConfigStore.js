
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

var appConfigStore = new Ext.data.JsonStore({
    url: 'home/config',
    storeId: 'appConfigStore',
    // reader configs
    root: 'grailsConfig',
    idProperty: 'name',
    fields: ['name', 'value']
});
