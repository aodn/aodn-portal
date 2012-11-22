
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search.data');

/**
 * api: (define) module = Portal.search.data class = RefinementList
 */
/**
 * api: method[RefinementList]
 * 
 * Class used to maintain a list of refinements
 * 
 */

Portal.search.data.RefinementList = function() {
	this.refinements = {};
};

Portal.search.data.RefinementList.prototype = {
	add : function(facet, value) {
		if (!this.refinements[facet]) {
			this.refinements[facet] = {};
		}
		this.refinements[facet][value] = null;
	},
	
	remove : function(facet, value) {
		if (!this.refinements[facet])
			return;
		delete this.refinements[facet][value];
		if (this.isEmptyObject(this.refinements[facet])) {
			delete this.refinements[facet];
		}
	},

	clear : function() {
		this.refinements = {};
	},

	contains : function(facet, value) {
		return this.refinements.hasOwnProperty(facet)
				&& this.refinements[facet].hasOwnProperty(value);
	},

	getJson : function() {
		var jsonData = [];
		for (var facet in this.refinements) {
			var values = this.refinements[facet];
			var jsonValues = [];
			for (var value in values) {
				jsonValues.push({
							value : value
						});
			}
			jsonData.push({
						name : facet,
						values : jsonValues
					});
		}
		return jsonData;
	},

	getArray : function() {
		var arrayData = [];
		for (var facet in this.refinements) {
			var values = this.refinements[facet];
			for (var value in values) {
				arrayData.push({
							name : facet,
							value : value
						});
			}
		}
		return arrayData;
	},

	isEmptyObject : function(obj) {
		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				return false;
			}
		}
		return true;
	}

};
