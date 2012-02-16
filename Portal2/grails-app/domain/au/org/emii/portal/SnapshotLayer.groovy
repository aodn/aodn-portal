package au.org.emii.portal

class SnapshotLayer {
    
    static belongsTo = [snapshot: Snapshot]
    
    // Configured layer
    Layer layer

    // Layer added from search     
    String serviceUrl
    String name
    String title
    
    Boolean isBaseLayer = false
    Boolean hidden = false
    Float opacity
    String styles

    static constraints = {
        layer(nullable: true)
        serviceUrl(url: true, nullable: true, validator: { val, obj -> 
            obj.layer == null && val == null ? 'nullable' : true
        })
        name(blank: false, nullable: true, validator: { val, obj ->
            obj.layer == null && val == null ? 'nullable' : true
        })
        title(blank: false, nullable: true, validator: { val, obj ->
            obj.layer == null && val == null ? 'nullable' : true
        })
        isBaseLayer()
        hidden()
        opacity(nullable:true)
        styles(nullable: true)
        
    }
}
