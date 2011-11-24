package au.org.emii.portal

class Server {

    String uri
    String shortAcron
    String name
    String type // no need for another class
    Date parseDate
    String parseFrequency 
    Boolean disable
    Boolean allowDiscoveries // hide from menus
    String comments

    static mapping = {
        sort "shortAcron"
    }
    
    static constraints = {
        uri(unique:true)
        shortAcron(unique:true,size:0..16)
        // dont change only add. 
        // getFeatureInfo request code will need to be written to use new versions
        // Openlayers should handle getMap
        type(inList:[//"WMS-1.0.0",  // to old
                       //"WMS-1.0.7", // to weird
                       //"WMS-1.1.0", // mmm
                       "WMS-1.1.1",
                       "WMS-1.3.0",
                       "NCWMS-1.1.1",
                       "NCWMS-1.3.0", // dont support until issues resolved http://www.resc.rdg.ac.uk/trac/ncWMS/ticket/187
                       "THREDDS",
                       "GEORSS",
                       "KML",
                       "RAMADDA",
                       "AUTO" 
        ])
        name(unique:true)
        disable()
        comments(nullable:true)
    }
    String toIdString() {
        return "${shortAcron}"
    }
    String toString() {
        return "${shortAcron}"
    }
}
