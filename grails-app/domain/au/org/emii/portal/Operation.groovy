package au.org.emii.portal

class Operation {
    
    String name
    String formats
    String getUrl
    String postUrl

    static constraints = {
        name()
        formats()
        getUrl()
        postUrl( nullable:  true )
    }
    
    static mapping = {
        formats type:'text'
    }

    @Override
    String toString() {
        return "Operation[name: $name, formats: $formats, getUrl: $getUrl, postUrl: $postUrl]"
    }
}
