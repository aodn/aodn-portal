includeTargets << grailsScript( "Init" )

target( main: "Collects project build info from environment variables and injects it into the Portal" ) {

    println "-- Generate Project Build Info script running --"

    println "Gathering data"

    def buildDate = new Date().format( "dd/MM/yyyy HH:mm" )
    def svnRevision = System.getenv( "SVN_REVISION" ) ?: "unk."
    def buildNumber = System.getenv( "BUILD_NUMBER" ) ?: "unk."

    println "Compiling template"

    def templateText = """\
<%@ page import=\"grails.util.Environment\" %>
<b>Portal project build info</b><br />
Instance name: \${ grailsApplication.config.instanceName ?: "<i>None supplied</i>" }<br />
Environment: \${ Environment.current }<br />
Build date: $buildDate<br />
Subversion revision: #$svnRevision<br />
Build: #$buildNumber<br />
App version: <g:meta name=\"app.version\"/>\
"""

    println "..... Template ${ "." * 61 }"
    println templateText
    println "." * 76
    
    def outputFile = new File( "grails-app/views/_projectInfo.gsp" )

    if ( outputFile.canWrite() ) {

        outputFile.text = templateText
        println "Template saved to $outputFile"
    }
    else {

        println "Could not write to output file. No changes made."
    }

    println "-- Generate Project Build Info script complete --"
}

setDefaultTarget( main )