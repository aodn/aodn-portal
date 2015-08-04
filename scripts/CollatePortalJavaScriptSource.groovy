

includeTargets << grailsScript("_GrailsInit")

target(main: "Collates all the custom portal JS code into a single portal-all.js file") {
    collatePortalJavaScriptFiles()
}

target(collatePortalJavaScriptFiles: "Collates all the custom portal JS code into a single portal-all.js file") {

    def resultFile = new File(_buildPath([buildSettings.projectWarExplodedDir, 'js', 'portal-all.js']))
    println "[collateportaljavascriptfiles] Collating to ${resultFile.absolutePath}"

    if (resultFile.exists()) {
        println "[collateportaljavascriptfiles] Collated file already exists attempt to delete"
        if (!resultFile.delete()) {
            throw new Exception("Cannot complete JavaScript concatenation, I cannot the delete old file")
        }
        println "[collateportaljavascriptfiles] Collated file deleted"
    }

    def portalJsFiles = getPortalJsFiles(buildSettings.projectWarExplodedDir)

    if (portalJsFiles.isEmpty()) {
        throw new Exception("No Javascript files to collate.")
    }

    portalJsFiles.each { filename ->
        println "[collateportaljavascriptfiles] Appending $filename"
        resultFile << new File(_buildPath([buildSettings.projectWarExplodedDir, filename])).text
        resultFile << System.properties["line.separator"]
    }
}

def getPortalJsFiles(stagingDir) {
    def includes = []

    new File(_buildPath([stagingDir, 'WEB-INF', 'grails-app', 'views', "_js_includes.gsp"])).eachLine { line ->
        // We want to match lines like file:'portal/prototypes/OpenLayers.js?'
        def matcher = line =~ /dir:\s*'(js\\/portal.*)',\s*file:\s*'(.+)'/
        if (matcher.find()) {
            def filePath = _buildPath([matcher.group(1), matcher.group(2)])

            println "[collateportaljavascriptfiles] Adding $filePath to files to be collated"

            includes << filePath
        }
    }

    return includes
}

def _buildPath(hierarchy) {
    return hierarchy.join(File.separator)
}

setDefaultTarget(main)
