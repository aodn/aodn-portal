
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.commons.lang.builder.EqualsBuilder

class Layer {

    String name
    String namespace
    String title
    String abstractTrimmed
    Server server
    Boolean cache
    String cql
    String bboxMinX
    String bboxMinY
    String bboxMaxX
    String bboxMaxY
    String projection
    Boolean queryable
    Boolean isBaseLayer
    Boolean available   //used by CheckLayerAvailabilityService

    // Extra info
    String dataSource
    Boolean activeInLastScan
    Boolean blacklisted
    Date lastUpdated

    String layerHierarchyPath
    String overrideMetadataUrl

	/**
	 * This was previously a belongsTo relationship - but in fact, root layers do not have a parent.
	 * The result was that it was not possible to create a valid layer hierarchy in code, since it's
	 * not possible to have a null parent with GORM.
	 */
	Layer parent

     /* <tns:name>Argo Oxygen Floats</tns:name>
        <tns:disabled>false</tns:disabled>
        <tns:description>Oxygen enabled Argo Floats in the Australian region</tns:description>
        <tns:uriIdRef>web-maps-0</tns:uriIdRef>
        <tns:type>WMS-LAYER-1.1.1</tns:type>
        <tns:cache>false</tns:cache>
        <tns:cql>oxygen_sensor eq true</tns:cql>
        <tns:style>argo_oxygen</tns:style>
        <tns:opacity>1.0</tns:opacity>
        <tns:layers>argo_float</tns:layers>
        <tns:imageFormat>image/png</tns:imageFormat>
        <tns:queryable>true</tns:queryable>

     */
    static mapping = {
        // Sorting
        sort "server"

        // Column types
        layerHierarchyPath type: "text"
        dimensions cascade: 'all-delete-orphan'
        metadataUrls cascade: 'all-delete-orphan'
        filters cascade: 'all-delete-orphan'
    }

    static hasMany = [metadataUrls: MetadataUrl, dimensions: WMSDimension, filters: Filter, styles: Styles]
    static constraints = {
		parent(nullable: true)
		name( nullable: true, size:1..225 )
        namespace( nullable: true )
        title( nullable: true )
        blacklisted()
        abstractTrimmed(size:0..455, nullable:true)
        server()
        cache()
        cql(nullable:true)
        styles(nullable:true)
        bboxMinX(nullable:true)
        bboxMinY(nullable:true)
        bboxMaxX(nullable:true)
        bboxMaxY(nullable:true)
        projection(nullable: true)
        overrideMetadataUrl(nullable:  true)
        queryable()

        isBaseLayer()

        dataSource(blank:false)
        activeInLastScan()
        lastUpdated(nullable:true)
        layerHierarchyPath(nullable: true)
        available(nullable: false)
    }

	static transients = ['layers']

    Layer() {

        // Empty relationships
        metadataUrls = []
        dimensions = []
        filters = []
        styles = []

        // Defaults
        abstractTrimmed = ""
        blacklisted = false
        cache = false
        queryable = false
        isBaseLayer = false
        activeInLastScan = true
        available = true
    }

	boolean equals(other){
        if(is(other)){
            return true
        }
        if(!(other instanceof Layer)) {
            return false
        }
        return new EqualsBuilder()
            .append(id, other.id)
            .isEquals()
    }

    String toString() {
        return "${server?.shortAcron} - ${name}"
    }

    String getOverrideMetadataUrl(){
        if((this.overrideMetadataUrl == null) && (this.getParent() != null)){
            return this.getParent().getOverrideMetadataUrl();
        }
        return this.overrideMetadataUrl;
    }

    void printTree(int depth = 0) {

        if ( depth == 0 ) {
            log.info ""
            log.info "-- Layer Tree --"
        }

        def spaces = ( "   " * depth )
        log.info "$spaces$name [$id] (parent: '$parent' [${parent?.id}]; layers: '${layers.size()}'; active: '$activeInLastScan';)"

        layers.each{

            it.printTree (depth + 1)
        }
    }

    void deleteDefaultLayersInConfig(){
        Config.withNewSession{
            def configInstance = Config.activeInstance()

            configInstance.defaultLayers.remove(this)
            configInstance.save()
        }
    }

    void deleteLayerMenuItems(){
        MenuItem.withNewSession{
            def dels = MenuItem.findAllByLayer(this)
            dels*.delete()
        }
    }

	void deleteSnapshotLayers() {

		Layer.withNewSession {
			SnapshotLayer.findAllByLayer(this).each {
				it.snapshot.removeFromLayers(it)
				it.delete()
			}
		}
	}

	void deleteChildLayers() {

		Layer.withNewSession {
			// Cascade delete child layers.
			layers.each {
				it.delete()
			}
        }
    }

    void beforeDelete(){
        //find all layers related to this server
        deleteDefaultLayersInConfig()
        deleteLayerMenuItems()
		deleteSnapshotLayers()
		deleteChildLayers()
    }

	/**
	 * Mimic belongsTo relationship.
	 */
	List<Layer> getLayers()	{

		if(this.id)
		{
			return Layer.findAllByParent(this, [sort: 'title', order: 'asc', cache: true])
		}
		else
		{
			return []
		}
	}

	void addToLayers(Layer child) {
		child.parent = this
	}

	void removeFromLayers(Layer child) {
		child.parent = null
	}

    def getAllStyles() {
        return this.styles
    }
}
