
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search.data');

Portal.search.data.LinkStore = Ext.extend(Ext.data.JsonStore, {
	constructor : function(cfg) {
		cfg = cfg || {};

		var config = Ext.apply({
			root : 'links',
			fields : [ {
				name : 'url',
				mapping : 'href'
			}, {
				name : 'name'
			}, {
				name : 'protocol'
			}, {
				name : 'title',
				convert : this._getTitle
			}, {
				name : 'type'
			} ]
		}, cfg);

		Portal.search.data.LinkStore.superclass.constructor.call(this, config);
	},

	filterByProtocols : function(values) {
	  var protocols = Ext.isString(values)?values.split('\n'):values;
		this.filterBy(function(record, id) {
			for (var i = 0; i < protocols.length; i++) {
				if (record.get('protocol') == protocols[i].trim())
					return true;
			}
			return false;
		});
	},

	getLayerLink : function(index) {
		var linkRec = this.getAt(index);

		if (linkRec === undefined) {
			return undefined;
		}

		return {
			title : linkRec.get('title'),
			server : {
				uri : linkRec.get('url'),
				type : this.getServerTypeFromProtocol(linkRec.get('protocol'))
			},
			name : linkRec.get('name'),
			protocol : linkRec.get('protocol')
		};
	},

	getServerTypeFromProtocol: function(protocol) {
		if (protocol) {
			var match = protocol.match(/^(OGC:)((NC)*WMS-\d\.\d\.\d)/);
			if (match) {
				return match[2];
			}
		}
		return 'WMS';
	},

	_getTitle: function(title, rec) {
		// Set title to name if there is no title
		if (title.trim() == '') {
			return rec.name?rec.name:'';
		} else {
			return title;
		}
	}
});
