import org.tmatesoft.svn.core.wc.SVNClientManager
import org.tmatesoft.svn.core.wc.SVNWCClient
import org.tmatesoft.svn.core.wc.SVNInfo
import org.tmatesoft.svn.core.SVNException
import org.tmatesoft.svn.core.internal.io.dav.DAVRepositoryFactory
import org.tmatesoft.svn.core.internal.io.svn.SVNRepositoryFactoryImpl
import  org.tmatesoft.svn.core.internal.io.fs.FSRepositoryFactory
import org.tmatesoft.svn.core.wc.SVNRevision

eventCreateWarStart = { warname, stagingDir ->
	Ant.delete(file: "${stagingDir}/WEB-INF/lib/postgresql-9.0-801.jdbc3.jar")
}


eventCompileStart = { kind ->
	
	// Get Jenkins build number
	def buildNumber = System.getenv('BUILD_NUMBER')
	if(buildNumber) {
		metadata.'app.buildNumber' = buildNumber
	} else {
		metadata.'app.buildNumber' = "jenkinsless"
	}

	// Get date and build profile
	def formatter = new java.text.SimpleDateFormat("MMM dd, yyyy")
	def buildDate = formatter.format(new Date(System.currentTimeMillis()))
	metadata.'app.buildDate' = buildDate
	metadata.'app.buildProfile' = grailsEnv

	// Get subvsersion revision number
	try {
		DAVRepositoryFactory.setup()
		SVNRepositoryFactoryImpl.setup()
		FSRepositoryFactory.setup()
		SVNClientManager clientManager = SVNClientManager.newInstance()
		SVNWCClient wcClient = clientManager.getWCClient()
		File baseFile = new File(basedir)
		SVNInfo svninfo = wcClient.doInfo(baseFile, SVNRevision.WORKING)
		def revision = svninfo.getRevision() 
		println "SVN revision: #${revision}"
		metadata.'app.revision' = "${revision}".toString()
	}
	catch (SVNException ex) {
		println "**************** SVN exception **************"
		println ex.getMessage()
	}

	metadata.persist()

	println "Jenkins Build: #${buildNumber}"
}

