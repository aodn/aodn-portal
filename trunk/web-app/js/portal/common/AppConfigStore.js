var appConfigStore = new Ext.data.JsonStore({
    url: 'home/config',
    storeId: 'appConfigStore',
    // reader configs
    root: 'grailsConfig',
    idProperty: 'name',
    fields: ['name', 'value']
});
