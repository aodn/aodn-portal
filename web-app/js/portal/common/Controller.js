Ext.namespace('Portal.common');

// Common code for controllers

Portal.common.Controller = Ext.extend(Ext.util.Observable, {
	
	// Generic handler for grails error responses
	// Log the errors and call any passed failure callback with decoded errors

	_logAndReturnErrors: function(response, options) {
		console.log(response);
		errors = Ext.decode(response.responseText).errors;
		this._callFailureCallback(options.requestCallbacks, [errors]);
	},
	
	// Private method used to call any success callback specified for a request usually after 
	// the controller has processed the request itself

	_callSuccessCallback: function(requestCallbacks, args) {
		if (requestCallbacks.success) {
			requestCallbacks.success.apply(requestCallbacks.scope || this || window, args);
		}
	},
	
	// Private method used to call any failure callback specified for a request usually after 
	// the controller has processed the request itself

	_callFailureCallback: function(requestCallbacks, args) {
		if (requestCallbacks.failure) {
			requestCallbacks.failure.apply(requestCallbacks.scope || this || window, args);
		}
	},
	
		
});