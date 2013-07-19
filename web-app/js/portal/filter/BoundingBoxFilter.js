
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.BoundingBoxFilter = Ext.extend(Portal.filter.BaseFilter, {
	initComponent: function() {
		this.CQL = "";
		Portal.filter.FilterPanel.superclass.initComponent.call(this);
	},

	_createField: function(){
		this.bbox = new Portal.search.field.BoundingBox({
			width: 250
		});
		this.add(this.bbox);
		this.bbox.bboxHint.setVisible(false);

		//this.mon(this.northBL, 'change', this.onCoordChange, this);
		this.mon(this.bbox, 'bboxchange', this._onCoordChange, this);
	},

	handleRemoveFilter: function(){
		this.CQL = "";
		this._setDefaultBounds();
	},

    setLayerAndFilter: function(layer, filter)
    {
        Portal.filter.BaseFilter.prototype.setLayerAndFilter.apply(this, arguments);

        layer.map.events.register("move", this, function(e) {

        	if (this.items.length != 0) {
	            var extent = layer.map.getExtent();
	
	            this.bbox.setBox({
	                northBL:extent.top,
	                westBL: extent.left,
	                eastBL: extent.right,
	                southBL: extent.bottom
	            });
        	}
        });
    },

    _setExistingFilters: function(){
		this.re = new RegExp("BBOX\\(" + this.filter.name + ",(.*)\\)");

		if(this.layer.params.CQL_FILTER != undefined){
			var m = this.re.exec(this.layer.params.CQL_FILTER);

			if (m != null && m.length == 2) {
				this.CQL = "BBOX(" + this.filter.name + ", " + m[1] + ")";
				var coords = m[1].split(",");
				this.bbox.setBox({
				   northBL: coords[3],
				   westBL: coords[0],
				   eastBL: coords[2],
				   southBL: coords[1]
				});
			}
			else{
				this._setDefaultBounds();
			}
		}
		else{
			this._setDefaultBounds();
		}
	},

	_setDefaultBounds: function(){
		bounds = this.layer.getExtent();

		this.bbox.setBox({
		   northBL: bounds.top,
		   westBL: bounds.left,
		   eastBL: bounds.right,
		   southBL: bounds.bottom
		});
	},

	_onCoordChange: function(bounds){

		if((bounds.westBL != null) && (bounds.southBL != "") && (bounds.eastBL != "") && (bounds.northBL != "")){
			this.CQL = "BBOX(" + this.filter.name + "," + bounds.westBL + "," + bounds.southBL + "," + bounds.eastBL + ","
										+ bounds.northBL+ ")";
			this._fireAddEvent();
		}


	}
});
