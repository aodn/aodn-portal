includeTargets << grailsScript( "Init" )

target( main: "Collects project build info from environment variables and injects it into the Portal" ) {
    
    println "-- Generate Project Build Info script running --"

    println "Reading environment variables"
    
    def buildDate = new Date().format( "dd/MM/yyyy hh:mm" )
    def svnRevision = System.getenv( "SVN_REVISION" ) ?: "Unk."
    def buildNumber = System.getenv( "BUILD_NUMBER" ) ?: "Unk."

    def replacementString = """\
<b>Portal project build info</b>
Build date: $buildDate
Subversion revision: $svnRevision
Build: $buildNumber
App version: <g:meta name=\"app.version\"/>\
"""
    
    println "replacementString: $replacementString"

    def outputFile = new File( "grails-app/views/_projectInfo.gsp" )

    if ( outputFile ) {

        outputFile.text = replacementString.replace( "\n", "<br />\n" )
    }
    else {
        
        println "Could not find output file. No changes made."
    }

    println "-- Generate Project Build Info script complete --"
}

setDefaultTarget( main )