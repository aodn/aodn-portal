import org.tmatesoft.svn.core.SVNException
import org.tmatesoft.svn.core.internal.io.dav.DAVRepositoryFactory
import org.tmatesoft.svn.core.internal.io.fs.FSRepositoryFactory
import org.tmatesoft.svn.core.internal.io.svn.SVNRepositoryFactoryImpl
import org.tmatesoft.svn.core.wc.SVNClientManager
import org.tmatesoft.svn.core.wc.SVNInfo
import org.tmatesoft.svn.core.wc.SVNRevision
import org.tmatesoft.svn.core.wc.SVNWCClient

eventCreateWarStart = { warname, stagingDir ->
	Ant.delete(file: "${stagingDir}/WEB-INF/lib/postgresql-9.0-801.jdbc3.jar")
}

eventCompileStart = { kind ->

    if ( grailsEnv == 'development' || grailsEnv == 'test' ) {

        println "Skipped gathering metadata as environment is 'development'"
    }
    else {

        println "Gathering metadata..."

        // Get build info
        metadata.'app.build.number' = System.getenv('BUILD_NUMBER') ?: 'Not Jenkins build'
        metadata.'app.build.date' = new Date().format( "dd/MM/yyyy HH:mm" )

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

