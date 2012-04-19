Ext.namespace('Portal.data');

Portal.data.CatalogResultsStore = function(){

    function getTitle(v, record){
        if (record.title && record.title) {
            return record.title[0].value;
        } else {
            return '';
        }
    }
    
    function getLinks(v, record){
        var links = [];
    	if (record.link) {
        	Ext.each(record.link, function(link, index, all) {
        		var elements = link.value.split('|');
        		links.push({
        			href: elements[2],
        			name: elements[0],
        			protocol: elements[3],
        			title: elements[1],
        			type: elements[4]
        		});
        	}, this);	
        }
        return links;
    }
    
    /**
     * Some convert function to face empty geonet_info parameters
     * BUG in GeoNetwork when retrieving iso19115 record through CSW
     */
    function getSource(v, record){
        if (record.geonet_info && record.geonet_info.source) {
            return record.geonet_info.source[0].value;
        } else {
            return '';
        }
    }
    
    function getAbstract(v, record){
        if (record['abstract']) {
            return record['abstract'][0].value;
        } else {
            return '';
        }
    }
    
    return new Ext.data.JsonStore({
        totalProperty: 'summary.count',
        root: 'records',
        fields: [{
            name: 'title',
            convert: getTitle
        }, {
            name: 'abstract',
            convert: getAbstract
        }, {
            name: 'uuid',
            mapping: 'geonet_info.uuid[0].value',
            defaultValue: ''
        }, {
            name: 'links',
            convert: getLinks
        }, {
            name: 'source',
            convert: getSource
        }, {
            name: 'bbox',
            mapping: 'BoundingBox',
            defaultValue: ''
        }]
    });
};
