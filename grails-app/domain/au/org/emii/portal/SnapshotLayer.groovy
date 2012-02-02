package au.org.emii.portal

class SnapshotLayer {
    
    static expose = 'snapshotlayer' 

    static belongsTo = [snapshot: Snapshot]
    
    // Configured layer
    Layer layer

    // Layer added from search or by user     
    String serviceUrl
    String name
    
    Boolean isBaseLayer = false
    Boolean hidden = false
    
    static constraints = {
        layer(nullable: true)
        serviceUrl(url: true, nullable: true, validator: { val, obj -> 
            obj.layer == null && val == null ? 'nullable' : true
        })
        name(blank: false, nullable: true, validator: { val, obj ->
            obj.layer == null && val == null ? 'nullable' : true
        })
        isBaseLayer()
        hidden()
    }
}
