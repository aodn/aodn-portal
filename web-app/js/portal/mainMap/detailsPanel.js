var selectedLayer;
var dimensionPanel;

// The details panel may be in the right panel or in the detailsPanel popup
// simply hide the panel leaving it to the next updateDetailsPanel to reset things
function closeNHideDetailsPanel() {
    rightPanel = Ext.getCmp('rightDetailsPanel');

    if (Portal.app.config.hideLayerOptions === true) {
        if(rightPanel.getEl() != undefined){
            rightPanel.collapse(true);
        }
    }
    else {
        if(rightPanel.getEl() != undefined){
            rightPanel.expand(true);
        }
    }
}

function makeCombo(type) {
    
    var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>';
    var fields;
    
    if (type == "styles") {
        tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p><img  src="{displayImage}" /></div></tpl>'
        fields = [
        {
            name: 'myId'
        },

        {
            name: 'displayText'
        },

        {
            name: 'displayImage'
        }
        ];
    }
    else {
        fields = [
        {
            name: 'myId'
        },

        {
            name: 'displayText'
        }
        ];
    }
    
    var valueStore  = new Ext.data.ArrayStore({
        autoDestroy: true,
        itemId: type,
        name: type,
        fields: fields
    });

    var combo = new Ext.form.ComboBox({
        fieldLabel: type,
        triggerAction: 'all',
        editable : false,
        lazyRender:true,
        mode: 'local',
        store: valueStore,
        emptyText: OpenLayers.i18n('pickAStyle'),
        valueField: 'myId',
        displayField: 'displayText',     
        tpl: tpl,
        style: {
           // marginTop: '10px'
        },
        listeners:{
            select: function(cbbox, record, index){
                if(cbbox.fieldLabel == 'styles')
                {    
                    setChosenStyle(selectedLayer,record); 
                }
                else if(cbbox.fieldLabel == 'time')
                {
                    selectedLayer.mergeNewParams({
                        time : record.get('myId')
                    });
                }
                else if(cbbox.fieldLabel == 'elevation')
                {
                    selectedLayer.mergeNewParams({
                        elevation : record.get('myId')
                    });
                }
            }
        }
    });
    
    return combo;
}

// for static time and elevation
// TODO

// Until this is refactored have single global point of return for the details panel
function getDetailsPanel() {
	return Ext.getCmp('rightDetailsPanel');
}
