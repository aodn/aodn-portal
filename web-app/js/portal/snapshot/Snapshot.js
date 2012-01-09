Ext.namespace('Portal.snapshot');

Portal.snapshot.Snapshot = function(ownerId, name)
{
	this.ownerId = ownerId;
	this.name = name;
	
	this.save = function(successCallback, failureCallback)
	{
	    Ext.Ajax.request({

	        url: 'snapshot/save',
	        success: successCallback,
	        failure: failureCallback
	    });
	};
};
