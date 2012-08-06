package au.org.emii.portal

class AodaacProductLink {

    Server server
    String layerName
    Integer productId

    static belongsTo = [ server: Server ]

    static constraints = {
        layerName blank: false
        productId unique:  ['server', 'layerName']
    }

    @Override
    String toString() {
        return "AodaacProductLink[ProductId: $productId, layerName: '$layerName', server: $server]"
    }
}