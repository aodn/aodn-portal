package au.org.emii.portal
import groovy.sql.Sql
import org.postgresql.Driver

/**
 *
 * @author pmbohm
 */
class DepthService {

    static transactional = false 

    def getNearestDepth(params) { 
        
        def depth = null        
        
        if (params?.config?.useDepthService) {
            def db = [
                url:'jdbc:postgresql://'+ params.config.depthUrl +'?ssl=true&tcpKeepAlive=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
                user: params.config.depthUser, 
                password: params.config.depthPassword, 
                driver:'org.postgresql.Driver'
            ]
            def sql = Sql.newInstance(db.url, db.user, db.password, db.driver)        

            def res = sql.firstRow("SELECT depth FROM "+ params.config.depthSchema + "." + params.config.depthTable +" WHERE ST_DWithin(geom, GeomFromText('POINT(" + params.lon 
                                        + " " + params.lat +  ")', 4326), 0.1) ORDER BY distance(geom, GeomFromText('POINT(" 
                                        + params.lon + " " + params.lat +  ")', 4326)) LIMIT 1;")
            if (res) {
                depth = res.depth
            }
        }                        
        
        def xmltext = "<?xml version=\"1.0\"?>\n" +
            "<root>\n" +
            "  <latitude>" + params.lat +"</latitude>\n" +
            "  <longitude>" + params.lon +"</longitude>\n" +
            "  <depth>" + depth + "</depth>\n</root>" 
        
        return xmltext

    } 

}