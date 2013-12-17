
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

includeTargets << grailsScript("Init")

target(main: "Collates all the custom portal JS code into a single portal-all.js file") {
    collatePortalJavaScriptFiles()
}

target(collatePortalJavaScriptFiles: "Collates all the custom portal JS code into a single portal-all.js file") {

    def resultFile = new File(_buildPath([stagingDir, 'js', 'portal-all.js']))
    println "[collateportaljavascriptfiles] Collating to ${resultFile.absolutePath}"

    if (resultFile.exists()) {
        println "[collateportaljavascriptfiles] Collated file already exists attempt to delete"
        if (!resultFile.delete()) {
            throw new Exception("Cannot complete JavaScript concatenation, I cannot the delete old file")
        }
        println "[collateportaljavascriptfiles] Collated file deleted"
    }

    getPortalJsFiles(stagingDir).each { filename ->
        println "[collateportaljavascriptfiles] Appending $filename"
        resultFile << new File(_buildPath([stagingDir, 'js', filename])).text
        resultFile << System.properties["line.separator"]
    }
}

def getPortalJsFiles(stagingDir) {

    def includes = []
    new File(_buildPath([stagingDir, 'WEB-INF', 'grails-app', 'views', "_js_includes.gsp"])).eachLine { line ->
        // We want to match lines like file:'portal/prototypes/OpenLayers.js?'
        def matcher = line =~ /file:\s*'(portal\/.+)'/
        if (matcher.find()) {
            println "[collateportaljavascriptfiles] Adding ${matcher.group(1)} to files to be collated"
            includes << matcher.group(1)
        }
    }

    return includes
}

def _buildPath(hierarchy) {
    return hierarchy.join(File.separator)
}

setDefaultTarget(main)
