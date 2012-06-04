Ext.namespace('Portal.details');

Portal.details.AodaacPanel = Ext.extend(Ext.Panel, {
    id: 'aodaacPanel',
    title: 'AODAAC Partition',
    style: {margin: 5},
    height: 400,
    enableTabScroll: true,

    initComponent: function(){

        var descriptionText = new Ext.Container({
            autoEl: 'div',
            cls: 'aodaacTab',
            html: "<p>This tool can be used to partition gridded datasets spatially and temporally, and then aggregate the results.</p>"
        });

        this.items = [ descriptionText ];

        this.addSpatialControls();

        this.items.push( new Ext.Spacer({height: 5}) );

        this.addTemporalControls();

        this.items.push( new Ext.Spacer({height: 5}) );

        this.addProcessingControls();

        Portal.details.AodaacPanel.superclass.initComponent.call(this);
    },

    addSpatialControls: function() {

        var spatialExtentText = new Ext.Container({
            autoEl: 'div',
            cls: 'aodaacTab',
            html: "<p><b>Spatial Extent</b></p>"
        });

//        var useDataExtent = new Ext.Button({ text: "Use data extent", enableToggle: true, toggleGroup: "spatialExtent" });

//        var useMapExtentButton = new Ext.Button({ text: "Use map extent", enableToggle: true, toggleGroup: "spatialExtent" });

//        var useCustomExtent = new Ext.Button({ text: "Use custom extent", enableToggle: true, toggleGroup: "spatialExtent" });

//        useDataExtent.toggle( true );
//
//        var spatialExtentButtonConatiner = {
//            xtype: 'container',
//            layout: {
//                type: 'hbox',
//                pack:'center',
//                align: 'middle'
//            },
//            width: 300,
//            items: [
//                useDataExtent,
////                new Ext.Spacer({width: 7}),
////                useMapExtentButton,
//                new Ext.Spacer({width: 7}),
//                useCustomExtent
//            ]
//        };

        var bboxControl = [ // Todo - DN: Refactor to use Portal.search.filter.BoundingBox... ?
            {
                xtype: 'spacer',
                height: 5
            },{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack:'center',
                    align: 'middle'
                },
                width: 300,
                items: [{
                    xtype: 'label',
                    text: OpenLayers.i18n('northBL'),
                    width: 15
                },{
                    xtype: 'numberfield',
                    ref: '../northBL',
                    name: 'northBL',
                    decimalPrecision: 2,
                    width: 50,
                    readOnly: true
                }]
            },{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                width: 300,
                items: [
                    {
                        xtype: 'label',
                        text: OpenLayers.i18n('westBL'),
                        width: 15
                    },{
                        xtype: 'numberfield',
                        name: 'westBL',
                        ref: '../westBL',
                        decimalPrecision: 2,
                        width: 50,
                        readOnly: true
                    },{
                        xtype: 'label',
                        text: ' ',
                        flex: 1
                    },{
                        xtype: 'numberfield',
                        name: 'eastBL',
                        ref: '../eastBL',
                        decimalPrecision: 2,
                        width: 50,
                        readOnly: true
                    },{
                        xtype: 'label',
                        text: OpenLayers.i18n('eastBL'),
                        margins: '0 0 0 5',
                        width: 15
                    }
                ]
            },{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'middle'
                },
                width: 300,
                items: [{
                    xtype: 'label',
                    text: OpenLayers.i18n('southBL'),
                    width: 15
                },{
                    xtype: 'numberfield',
                    name: 'southBL',
                    ref: '../southBL',
                    decimalPrecision: 2,
                    width: 50,
                    readOnly: true
                }]
            }
        ];

        this.items.push( spatialExtentText, spatialExtentButtonConatiner, bboxControl );
    },

    addTemporalControls: function() {

        var temporalExtentText = new Ext.Container({
            autoEl: 'div',
            cls: 'aodaacTab',
            html: "<p><b>Temporal Extent</b></p>"
        });

        var startDatePicker = {
            xtype: 'container',
            layout: 'form',
            width: 300,
            items: [
                {
                    fieldLabel: 'Date from',
                    labelSeparator: '',
                    xtype: 'datefield',
                    format: 'd/m/Y',
                    anchor: '100%',
                    showToday: false
                }
            ]
        };

        var endDatePicker = {
            xtype: 'container',
            layout: 'form',
            width: 300,
            items: [
                {
                    fieldLabel: 'Date to',
                    labelSeparator: '',
                    xtype: 'datefield',
                    format: 'd/m/Y',
                    anchor: '100%',
                    showToday: false
                }
            ]
        };

        var timeRangeSlider = new Ext.slider.MultiSlider({
            id: "timeExtentSlider",
            width: 200,
            minValue: 0,
            maxValue: 96, // (24 hours worth of 15 minute increments)
            values: [0, 96],
            fieldLabel: "Time of day",

            plugins: new Ext.slider.Tip({
                getText: function(thumb){

                    // Get controls
                    var slider = thumb.slider;
                    var startThumb = slider.thumbs[0];
                    var endThumb = slider.thumbs[1];

                    // Format value for reading
                    var timeRangeStart = Portal.details.AodaacPanel.hoursFromThumb( startThumb );
                    var timeRangeEnd = Portal.details.AodaacPanel.hoursFromThumb( endThumb );

                    // Whole day message
                    var wholeDayMessage = "";
                    if ( timeRangeStart == "0:00" && timeRangeEnd == "23:59" ) wholeDayMessage = "<br />(Whole day)";

                    // Emphasise value being modified
                    if ( thumb == startThumb ) timeRangeStart = "<span style=\"font-size: 1.4em;\">" + timeRangeStart + "</span>";
                    if ( thumb == endThumb ) timeRangeEnd = "<span style=\"font-size: 1.4em;\">" + timeRangeEnd + "</span>";

                    return String.format( '{0}&nbsp;-&nbsp;{1}{2}', timeRangeStart, timeRangeEnd, wholeDayMessage );
                }
            })
        });

        var timeRangeSliderContainer = new Ext.Panel({
            height: 'auto',
            layout: 'column',
            items: [
                {
                    xtype: 'label',
                    text: "0:00",
                    style: "margin: 4px 8px 16px 32px;"
                },
                timeRangeSlider,
                {
                    xtype: 'label',
                    text: "23:59",
                    style: "margin: 4px 8px 16px 32px;"
                }



                /*,
                new Ext.form.Label({
                    fieldLabel: "",
                    html: "0:00 - 23:59"
                })*/
            ]
        });

        this.items.push( temporalExtentText, startDatePicker, endDatePicker, new Ext.Spacer({ height: 5 }), timeRangeSliderContainer );
    },

    addProcessingControls: function() {

        var processingControlsText = new Ext.Container({
            autoEl: 'div',
            cls: 'aodaacTab',
            html: "<p><b>Output</b></p>"
        });

        var outputSelector = new Ext.form.ComboBox({
            id: 'outputSelector',
            fieldLabel: 'Output format',
            mode: 'local',
            store: new Ext.data.ArrayStore({
                fields: [ 'code', 'name' ],
                data: [['hdf', 'HDF file'], ['nc', 'NetCDF file'], ['txt', 'ASCII text'], ['urls', 'List of OPeNDAP URLs']],
                autoDestroy: true
            }),
            value: 'hdf', // Default selection
            valueField: 'code',
            displayField: 'name',
            triggerAction: 'all',
            editable: false
        });

        var startProcessingButton = new Ext.Button({
            text: "Start processing job&nbsp;",
            scale: "medium",
            icon: "images/start.png",
            handler: this.startProcessing
        });

        this.items.push( processingControlsText, outputSelector, new Ext.Spacer({ height: 5 }), startProcessingButton );
    },

    startProcessing: function() {

        new Portal.ui.AodaacAggregatorJobListWindow().show();
    }
});

Portal.details.AodaacPanel.hoursFromThumb = function( thumb ) {

    var value = thumb.value;

    var fullHours = Math.floor(value / 4);
    var partHours = value % 4;

    var quarterHours = ["00", "15", "30", "45"];

    var returnValue = String.format( "{0}:{1}", fullHours, quarterHours[partHours] );

    // Tweak not to show 24:00
    if ( returnValue == "24:00" ) returnValue = "23:59";

    return returnValue;
};
