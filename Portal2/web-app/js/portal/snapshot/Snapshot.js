Ext.namespace('Portal.snapshot');

Portal.snapshot.Snapshot = function(properties)
{
  this.layers = [];
  
  Ext.apply(this, properties);
  
	this.addLayer = function(properties)
	{
	    this.layers.push(Ext.apply({}, properties));
	};
	
	this.save = function(successCallback, failureCallback)
	{
	    Ext.Ajax.request({
	        url: 'snapshot/save',
	        jsonData: this,
	        success: this.onSuccessfulSave,
	        failure: this.onFailedSave,
	        scope: this,
	        successCallback: successCallback,
	        failureCallback: failureCallback
	    });
	};
	
	this.onSuccessfulSave = function(response, options) {
	  if (options.successCallback) {
	    options.successCallback(response, options);
	  }
	};
	
  this.onFailedSave = function(response, options) {
    this.errors = Ext.decode(response.responseText).errors;
    
    var errorMessages = Portal.snapshot.Snapshot.getMessages(this.errors);
    
    if (options.failureCallback) {
      options.failureCallback(response, options, errorMessages);
    }
  };
  
};

Portal.snapshot.Snapshot.get = function(id, successCallback, failureCallback) {
  Ext.Ajax.request({
    url: 'snapshot/show',
    params: {
      id: id,
      type: 'JSON'
     },
    success: Portal.snapshot.Snapshot.onSuccessfulGet,
    failure: Portal.snapshot.Snapshot.onFailedGet,
    successCallback: successCallback,
    failureCallback: failureCallback
  });
};

Portal.snapshot.Snapshot.onSuccessfulGet = function(response, options) {
  var json = Ext.decode(response.responseText);
  
  var snapshot = new Portal.snapshot.Snapshot(json);
  
  if (options.successCallback) {
    options.successCallback(snapshot);
  }
};

Portal.snapshot.Snapshot.onFailedGet = function(response, options) {
  errors = Ext.decode(response.responseText).errors;
  
  var errorMessages = Portal.snapshot.Snapshot.getMessages(errors);

  if (options.failureCallback) {
    options.failureCallback(response, options, errorMessages);
  }
};

Portal.snapshot.Snapshot.remove = function(id, successCallback, failureCallback) {
  Ext.Ajax.request({
    url: 'snapshot/delete',
    params: {
      id: id,
      type: 'JSON'
     },
    success: Portal.snapshot.Snapshot.onSuccessfulDelete,
    failure: Portal.snapshot.Snapshot.onFailedDelete,
    successCallback: successCallback,
    failureCallback: failureCallback
  });
};

Portal.snapshot.Snapshot.onSuccessfulDelete = function(response, options) {
  if (options.successCallback) {
    options.successCallback(response, options);
  }
};

Portal.snapshot.Snapshot.onFailedDelete = function(response, options) {
  errors = Ext.decode(response.responseText).errors;
  
  var errorMessages = Portal.snapshot.Snapshot.getMessages(errors);

  if (options.failureCallback) {
    options.failureCallback(response, options, errorMessages);
  }
};

Portal.snapshot.Snapshot.getMessages = function(errors) {
  var errorMessages = '';

  for (var i=0; i < errors.length; i++) {
    errorMessages += errors[i].message;
    if (i < errors.length-1) {
      errorMessages += '</br>';
    }
  }

  return errorMessages;
};




