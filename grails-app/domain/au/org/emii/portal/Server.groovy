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
        type(inList:["WMS-1.0.0", // code will be written to handle these strings
                       "WMS-1.1.0",
                       "WMS-1.1.1",
                       "WMS-1.3.0",
                       "NCWMS-1.1.1",
                       "NCWMS-1.3.0",
                       "THREDDS",
                       "GEORSS",
                       "KML",
                       "RAMADDA",
                       "AUTO" ])
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
