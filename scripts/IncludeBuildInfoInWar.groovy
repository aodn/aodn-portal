/*
 * Credit: http://akeffalas.github.io/blog/2014/04/jenkins-build-info-grails-war.html
 */
includeTargets << grailsScript("_GrailsInit")

target(main: "Includes build info in war") {
    includeBuildInfoInWar()
}

target(includeBuildInfoInWar: "Includes build info in war") {

    def unknownValue = 'UNKNOWN'
    def buildNumberEnvironment = 'BUILD_NUMBER'
    def scmRevisionEnvironment = 'GIT_COMMIT'
    def buildNumberProperty = 'build.number'
    def scmRevisionProperty = 'build.revision'

    def buildNumber = System.getenv(buildNumberEnvironment)
    if(!buildNumber) {
        buildNumber = System.getProperty(buildNumberProperty, unknownValue)
    }

    def scmRevision = System.getenv(scmRevisionEnvironment)
    if(!scmRevision) {
        scmRevision = System.getProperty(scmRevisionProperty, unknownValue)
    }

    def buildDate = new Date()

    ant.propertyfile(file:"${buildSettings.projectWarExplodedDir}/WEB-INF/classes/application.properties") {
        entry(key:'app.build.number', value: buildNumber)
        entry(key:'app.build.date', value: buildDate)
        entry(key:'app.build.scmRevision', value: scmRevision)
    }

    ant.manifest(file: "${buildSettings.projectWarExplodedDir}/META-INF/MANIFEST.MF", mode: "update") {
        attribute(name: "Build-Time", value: buildDate)
        section(name: "Grails Application") {
            attribute(name: "Implementation-Build-Number", value: buildNumber)
            attribute(name: "Implementation-SCM-Revision", value: scmRevision)
        }
    }
}
