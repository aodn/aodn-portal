package au.org.emii.portal

class Server {

    String uri
    String shortAcron
    String name
    String type  // type and wmsVersionshould be moved out into another class ?
    String wmsVersion
    Boolean disable
    String comments
    
    static constraints = {
        uri(unique:true)
        shortAcron(unique:true,size:0..16)
        wmsVersion(inList:["", "1.0.0", "1.1.0","1.1.1", "1.3.0"])
        type(inList:["WMS-1.0.0"
                 ,      "WMS-LAYER-1.0.0"
                 ,      "WMS-1.1.0"
                 ,      "WMS-LAYER-1.1.0"
                 ,      "WMS-1.1.1"
                 ,      "WMS-LAYER-1.1.1"
                 ,      "WMS-1.3.0"
                 ,      "WMS-LAYER-1.3.0"
                 ,      "NCWMS"
                 ,      "THREDDS"
                 ,      "GEORSS"
                 ,      "KML"
                 ,      "RAMADDA"
                 ,      "AUTO" ])
        name(unique:true)
        disable()
        comments(nullable:true)
    }
    String toIdString() {
        return "${shortAcron}"
    }
    String toString() {
        return " ${uri} - ${shortAcron}"
    }
}
