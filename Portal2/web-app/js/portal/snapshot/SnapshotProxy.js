Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotProxy = function()
{
  this.save = function(snapshot, successCallback, failureCallback)
	{
	    Ext.Ajax.request({
	        url: 'snapshot/save',
	        jsonData: snapshot,
	        success: this.onSuccessfulSave,
	        failure: this.onFailure,
	        scope: this,
	        snapshot: snapshot,
	        successCallback: successCallback,
	        failureCallback: failureCallback
	    });
	};
	
	this.onSuccessfulSave = function(response, options) {
	  var json = Ext.decode(response.responseText);
	  
	  var snapshot = Ext.apply(options.snapshot, json);
	  
	  if (options.successCallback) {
	    options.successCallback(snapshot);
	  }
	};
	
	this.get = function(id, successCallback, failureCallback) {
	  Ext.Ajax.request({
	    url: 'snapshot/show',
	    params: {
	      id: id,
	      type: 'JSON'
	     },
	    success: this.onSuccessfulGet,
	    failure: this.onFailure,
	    successCallback: successCallback,
	    failureCallback: failureCallback
	  });
	};

	this.onSuccessfulGet = function(response, options) {
	  var snapshot = Ext.decode(response.responseText);
	  
	  if (options.successCallback) {
	    options.successCallback(snapshot);
	  }
	};

	this.remove = function(id, successCallback, failureCallback) {
	  Ext.Ajax.request({
	    url: 'snapshot/delete',
	    params: {
	      id: id,
	      type: 'JSON'
	     },
	    success: this.onSuccessfulDelete,
	    failure: this.onFailure,
	    successCallback: successCallback,
	    failureCallback: failureCallback
	  });
	};

	this.onSuccessfulDelete = function(response, options) {
	  if (options.successCallback) {
	    options.successCallback();
	  }
	};

	this.onFailure = function(response, options) {
	  errors = Ext.decode(response.responseText).errors;
	  
	  var errorMessages = this.getMessages(errors);

	  if (options.failureCallback) {
	    options.failureCallback(errorMessages);
	  }
	};

	this.getMessages = function(errors) {
	  var errorMessages = '';

	  for (var i=0; i < errors.length; i++) {
	    errorMessages += errors[i].message;
	    if (i < errors.length-1) {
	      errorMessages += '</br>';
	    }
	  }

	  return errorMessages;
	};
};





