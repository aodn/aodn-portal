Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotButtonGroup = Ext.extend(Ext.ButtonGroup,
{
	constructor: function(config)
	{
		config = Ext.apply(
		{
			items:
			[
				new Ext.Button(
			    {
			        text: 'Load Map...',
			        cls: "floatLeft buttonPad",   
			        tooltip: "Load a saved map",
			        listeners:
			        {
			            click: this.loadClicked
			        }
			    }),
				new Ext.Button(
			    {
			        text: 'Save Map...',
			        cls: "floatLeft buttonPad",   
			        tooltip: "Save the current state of the map",
			        listeners:
			        {
			            click: this.saveClicked
			        }
			    })
			]			
		}, config);
		
		Portal.snapshot.SnapshotButtonGroup.superclass.constructor.apply(this, arguments);
	},

	loadClicked: function(button, event)
    {
		button.ownerCt.showLoadDialog();
    },
	
	saveClicked: function(button, event)
    {
		button.ownerCt.showSaveDialog();
    },
    
    showLoadDialog : function()
    {
    	console.log("showLoadDialog");
    },
    
    showSaveDialog : function()
    {
    	new Ext.Window({title: 'Save Snapshot', modal: true}).show();
    }
});
