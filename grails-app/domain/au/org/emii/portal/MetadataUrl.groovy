package au.org.emii.portal

class MetadataUrl {

    String type
    String format

    OnlineResource onlineResource

    static embedded = [ "onlineResource" ]

    static belongsTo = [ layer: Layer ]

    static constraints = {}

    MetadataUrl() { /* Empty constructor for Hibernate */ }

    MetadataUrl( layer ) {

        this.layer = layer

        onlineResource = new OnlineResource()
    }

    @Override
    public String toString() {
        return "MetadataUrl{type: '$type'; format: '$format'; OnlineResource{type: '$onlineResource.type'; href: '$onlineResource.href'}}";
    }
}

class OnlineResource {

    String type
    String href
}