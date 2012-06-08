Ext.namespace('Portal.ui');

Portal.ui.AodaacAggregatorJobListWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

//        // Content
//        this.contentPanel = new Ext.Panel({
//            html: "Retrieving info...",
//            width: 450,
//            resizable: false
//        });

        // Controls
        var clearFinishedButton = {
            text: "Clear finished", // Todo - DN: i18n
            onClick: function() { alert( 'Not implemented yet' ); }
        };

        var closeButton = {
            text: "Close", // Todo - DN: i18n
            listeners: {
                scope: this,
                click: this.onClose
            }
        };

        // Grid panel
        var aodaacJobStore = new Ext.data.JsonStore({
            // store configs
            autoLoad: true,
            autoDestroy: true,
            url: 'http://localhost:8080/Portal2/aodaac/userJobInfo',
            storeId: 'aodaacJobStore',
            // reader configs
//            root: '',
            idProperty: 'jobId',
            fields: ['jobId', 'url', 'jobParams.outputFormat', 'jobParams.productId', {name:'dateCreated', type:'date'}]
        });

        var gridPanel = new Ext.grid.GridPanel({
            header: false,
            store: aodaacJobStore,
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    width: 80,
                    sortable: false
                },
                columns: [
                    {header: 'Job Id', id: 'jobId', width: 200, dataIndex: 'jobId'},
                    {header: 'Output format', dataIndex: 'jobParams.outputFormat'},
                    {header: 'Product Id', dataIndex: 'jobParams.productId'},
                    // instead of specifying renderer: Ext.util.Format.dateRenderer('m/d/Y') use xtype
                    {
                        header: 'Date Created', width: 135, dataIndex: 'dateCreated',
                        xtype: 'datecolumn', format: 'd/M/Y'
                    }
                ]
            }),
            viewConfig: {
                forceFit: true,

                // Return CSS class to apply to rows depending upon data values
                getRowClass: function(record, index) {

                    return 'cool_class';

//                    var c = index % 2 == 0;
//                    if (c < 0) {
//                        return 'price-fall';
//                    } else if (c > 0) {
//                        return 'price-rise';
//                    }
                }
            },
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            width: '100%',
            height: 300,
            frame: true,
            bbar: [clearFinishedButton, '-', closeButton]
        });

        Ext.apply(this, {
            title: "AODAAC Jobs", // Todo - DN: i18n
            modal: true,
            padding: 0,
            width: 450,
            layout: 'fit',
            items: {
                autoHeight: true,
                autoWidth: true,
                padding: 0,
                items: [gridPanel]
            },
            listeners: {
                show: this.onShow,
                scope: this
            }
        });

        Portal.ui.AodaacAggregatorJobListWindow.superclass.initComponent.apply(this, arguments);
    },

    onClose: function() {
        this.close();
    }
});