
import java.text.SimpleDateFormat

import org.tmatesoft.svn.core.SVNException
import org.tmatesoft.svn.core.internal.io.dav.DAVRepositoryFactory
import org.tmatesoft.svn.core.internal.io.fs.FSRepositoryFactory
import org.tmatesoft.svn.core.internal.io.svn.SVNRepositoryFactoryImpl
import org.tmatesoft.svn.core.wc.SVNClientManager
import org.tmatesoft.svn.core.wc.SVNInfo
import org.tmatesoft.svn.core.wc.SVNRevision
import org.tmatesoft.svn.core.wc.SVNWCClient

eventCreateWarStart = { warname, stagingDir ->
	ant.delete(file: "${stagingDir}/WEB-INF/lib/postgresql-9.0-801.jdbc3.jar")
	if (grailsEnv == 'production') {
		ant.delete(file: "${stagingDir}/WEB-INF/grails-app/views/robots.gsp")
	}
	
	includeTargets << new File("${basedir}/scripts/CollatePortalJavaScriptSource.groovy")
	collatePortalJavaScriptFiles()
}

eventCompileStart = { kind ->

    if ( grailsEnv == 'development' || grailsEnv == 'test' ) {

        println "Skipped gathering metadata as environment is 'development' or 'test'"
    }
    else {

        println "Gathering metadata..."

        // Get build info
        metadata.'app.build.number' = System.getenv('BUILD_NUMBER') ?: 'Not Jenkins build'
        metadata.'app.build.date' = new SimpleDateFormat( "dd/MM/yyyy HH:mm" ).format(new Date())

        // Get subvsersion revision number
        try {
            DAVRepositoryFactory.setup()
            SVNRepositoryFactoryImpl.setup()
            FSRepositoryFactory.setup()
            SVNClientManager clientManager = SVNClientManager.newInstance()
            SVNWCClient wcClient = clientManager.getWCClient()
            File baseFile = new File(basedir as String)
            SVNInfo svninfo = wcClient.doInfo(baseFile, SVNRevision.WORKING)

            metadata.'app.svn.revision' = svninfo.revision.toString()
            metadata.'app.svn.url' = svninfo.URL.toString()
        }
        catch (SVNException ex) {
            println "**************** SVN exception **************"
            println ex.getMessage()
        }

        metadata.persist()

        println "App metadata:"
        metadata.collect { k, v -> println "$k: '$v'" }
    }
}

eventConfigureTomcat = { tomcat ->

    try {
		def clazz = loadDependencyClass("org.apache.catalina.connector.Connector")
        def connector = clazz.getConstructor(String.class).newInstance("org.apache.coyote.http11.Http11Protocol")
        connector.port = System.getProperty("server.port", "8080").toInteger()
        connector.redirectPort = 8443
        connector.protocol = "HTTP/1.1"
        connector.maxPostSize = 1073741824

        tomcat.connector = connector
        tomcat.service.addConnector connector
    }
    catch(Throwable t) {
        println t
    }

}

loadDependencyClass = { name ->
	def doLoad = { -> classLoader.loadClass(name) }
	try {
		doLoad()
	}
	catch (ClassNotFoundException e) {
		includeTargets << grailsScript("_GrailsCompile")
		compile()
		doLoad()
	}
}
