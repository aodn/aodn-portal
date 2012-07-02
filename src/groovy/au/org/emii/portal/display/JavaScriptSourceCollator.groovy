package au.org.emii.portal.display

class JavaScriptSourceCollator {

	def stagingDir
	def viewDir
	
	JavaScriptSourceCollator(stagingDir) {
		this.stagingDir = stagingDir
	}
	
	def collate() {
		def resultFile = new File(_buildPath([stagingDir.absolutePath, 'js', 'portal-all.js']))
		if (resultFile.exists()) {
			if (!resultFile.delete()) {
				throw new Exception("Cannot complete JavaScript concatenation, I cannot the delete old file")
			}
		}
		getPortalJsFiles().each { filename ->
			resultFile << new File(_buildPath([stagingDir.absolutePath, 'js', filename])).text
			resultFile << System.properties["line.separator"]
		}
	}
	
	def getViewDir() {
		if (!viewDir) {
			viewDir = new File(_buildPath([stagingDir.absolutePath, 'WEB-INF', 'grails-app', 'views']))
		}
		return viewDir
	}
	
	def getPortalJsFiles() {
		return _parseIndexGsp()
	}
	
	def _parseIndexGsp() {
		// file:'portal/prototypes/OpenLayers.js?'
		def includes = []
		new File(_buildPath([getViewDir().absolutePath, "home", "index.gsp"])).eachLine { line ->
			def matcher = line =~ /file:'(portal\/.+)\?'/
			if (matcher.find()) {
				includes << matcher.group(1)
			}
		}
		return includes
	}
	
	def _buildPath(hierarchy) {
		return hierarchy.join(File.separator)
	}
}
