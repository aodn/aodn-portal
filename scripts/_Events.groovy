/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

import java.text.SimpleDateFormat

eventCreateWarStart = { warname, stagingDir ->
    if (grailsEnv == 'production') {
        ant.delete(file: "${stagingDir}/WEB-INF/grails-app/views/robots.gsp")
    }

    includeTargets << new File("${basedir}/scripts/CollatePortalJavaScriptSource.groovy")
    collatePortalJavaScriptFiles()
}

eventCompileStart = { kind ->

    if (grailsEnv == 'development' || grailsEnv == 'test') {

        println "Skipped gathering metadata as environment is 'development' or 'test'"
    }
    else {
        if (System.getProperty("aodn.app.version")) {
            metadata.'app.version' = System.getProperty("aodn.app.version");
        }

        println "Gathering metadata..."

        // Get build info
        metadata.'app.build.date' = new SimpleDateFormat("dd/MM/yyyy HH:mm").format(new Date())
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
    catch (Throwable t) {
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
