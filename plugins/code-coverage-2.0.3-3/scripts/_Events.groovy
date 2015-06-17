import groovy.xml.MarkupBuilder
import org.apache.tools.ant.types.Path
import org.codehaus.groovy.grails.commons.GrailsClassUtils

dataFile = System.properties["net.sourceforge.cobertura.datafile"] ?: "${basedir}/cobertura.ser"

forkedJVMDebugPort = 0//'5005'

codeCoverageExclusionList = [
        "**/*BootStrap*",
        "Config*",
        "BuildConfig*",
        "**/*DataSource*",
        "**/*resources*",
        "**/*UrlMappings*",
        "**/*Tests*",
        "**/grails/test/**",
        "**/org/codehaus/groovy/grails/**",
        "**/PreInit*",
        "*GrailsPlugin*"]


eventCreateWarStart = { warName, stagingDir ->
    ant.delete(includeemptydirs: true) {
        fileset(dir: "$stagingDir") {
            include(name: '**/code-coverage*/**')
            include(name: '**/code-coverage*')
            if (new File("$stagingDir/WEB-INF/classes/application.properties").text.indexOf('code-coverage') == -1) {
                include(name: '**/CodeCoverageGrailsPlugin*')
            }
        }
    }
}

eventTestPhasesStart = {
    if (isCoverageEnabled()) {
        event("StatusUpdate", ["Instrumenting classes for coverage"])

        if (isAppendCoverageResultsEnabled() && new File("${dataFile}").exists()) {
            println "Appending coverage results to existing Cobertura ser file ${dataFile}."
        } else {
            ant.delete(file: "${dataFile}")
        }

        if (buildConfig.coverage.exclusionListOverride) {
            codeCoverageExclusionList = buildConfig.coverage.exclusionListOverride
        }

        if (buildConfig.coverage.exclusions) {
            codeCoverageExclusionList += buildConfig.coverage.exclusions
        }

        defineCoberturaPathAndTasks()
        instrumentClasses()
    }
}

eventTestPhasesEnd = {
    if (isCoverageEnabled()) {
        defineCoberturaPathAndTasks()
        flushReportData()
        createCoverageReports()
        replaceClosureNamesInReports()

        //clear out the instrumented classes
        cleanCompiledSources()

        event("StatusFinal", ["Cobertura Code Coverage Complete (view reports in: ${coverageReportDir})"])
    }
}

def createCoverageReports() {
    coverageReportDir = "${config.grails.testing.reports.destDir ?: testReportsDir}/cobertura"

    ant.mkdir(dir: "${coverageReportDir}")

    coverageReportFormats = ['html']
    if (argsMap.xml || buildConfig.coverage.xml) {
        coverageReportFormats << 'xml'
    }

    coverageReportFormats.each { reportFormat ->
        ant.'cobertura-report'(destDir: "${coverageReportDir}", datafile: "${dataFile}", format: reportFormat) {
            //load all these dirs independently so the dir structure is flattened,
            //otherwise the source isn't found for the reports
            fileset(dir: "${basedir}/grails-app/controllers", erroronmissingdir: false)
            fileset(dir: "${basedir}/grails-app/domain", erroronmissingdir: false)
            fileset(dir: "${basedir}/grails-app/services", erroronmissingdir: false)
            fileset(dir: "${basedir}/grails-app/taglib", erroronmissingdir: false)
            fileset(dir: "${basedir}/grails-app/utils", erroronmissingdir: false)
            fileset(dir: "${basedir}/src/groovy", erroronmissingdir: false)
            fileset(dir: "${basedir}/src/java", erroronmissingdir: false)
            if (buildConfig.coverage?.sourceInclusions) {
                buildConfig.coverage.sourceInclusions.each {
                    fileset(dir: "${basedir}/${it}")
                }
            }
        }
    }
}

def defineCoberturaPathAndTasks() {
    ant.taskdef(classpathRef: 'grails.test.classpath', resource: "tasks.properties")
}

def replaceClosureNamesInReports() {
    if (!argsMap.nopost || !buildConfig.coverage.noPost) {
        def startTime = new Date().time

        def hasGrailsApp = hasProperty('grailsApp')

        replaceClosureNames(hasGrailsApp ? grailsApp?.controllerClasses : null)
        replaceClosureNamesInXmlReports(hasGrailsApp ? grailsApp?.controllerClasses : null)
        def endTime = new Date().time
        println "Done with post processing reports in ${endTime - startTime}ms"
    }
}

def replaceClosureNames(artefacts) {
    artefacts?.each { artefact ->
        artefact.reference.propertyDescriptors.findAll { descriptor ->
            GrailsClassUtils.isGroovyAssignableFrom(Closure, descriptor.propertyType)
        }.each { propertyDescriptor ->
            def closureClassName = artefact.getPropertyOrStaticPropertyOrFieldValue(propertyDescriptor.name, Closure)?.class?.name
            if (closureClassName) {
                // the name in the reports is sans package; subtract the package name
                def nameToReplace = closureClassName - "${artefact.packageName}."

                ant.replace(dir: "${coverageReportDir}",
                        token: ">${nameToReplace}<",
                        value: ">${artefact.shortName}.${propertyDescriptor.name}<") {
                    include(name: "**/*${artefact.fullName}.html")
                    include(name: "frame-summary*.html")
                }
            }
        }
    }
}

def replaceClosureNamesInXmlReports(artefacts) {
    def xml = new File("${coverageReportDir}/coverage.xml")
    if (xml.exists()) {
        def p = new XmlParser()
        p.setFeature("http://apache.org/xml/features/disallow-doctype-decl", false);
        p.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        def parser = p.parse(xml)

        artefacts?.each { artefact ->
            artefact.reference.propertyDescriptors.findAll { descriptor ->
                GrailsClassUtils.isGroovyAssignableFrom(Closure, descriptor.propertyType)
            }.each { propertyDescriptor ->
                def closureClassName = artefact.getPropertyOrStaticPropertyOrFieldValue(propertyDescriptor.name, Closure)?.class?.name
                if (closureClassName) {
                    def node = parser['packages']['package']['classes']['class'].find { it.@name == closureClassName }
                    if (node) {
                        node.@name = "${artefact.fullName}.${propertyDescriptor.name}"
                    }
                }
            }
        }

        xml.withPrintWriter { writer ->
            new XmlNodePrinter(writer).print(parser)
        }
    }
}

def instrumentClasses() {
    String coverageClasspath = createCoverageClasspath()

    String antBuildfileContent = new AntInstrumentationBuildfileBuilder()
            .setDataFile(dataFile)
            .setForkedJVMDebugPort(forkedJVMDebugPort)
            .setCoverageClasspath(coverageClasspath)
            .setClassesDir(classesDir)
            .setCodeCoverageExclusionList(codeCoverageExclusionList)
            .build()

    File instrumentBuildFile = File.createTempFile('instrument-build-', '.xml')

    instrumentBuildFile.withWriter('UTF-8') { Writer writer ->
        writer.write(antBuildfileContent)
    }

    try {
        ant.java(fork: 'true', classname: 'org.apache.tools.ant.launch.Launcher', classpath: "${coverageClasspath}") {
            arg(value: '-buildfile')
            arg(file: "${instrumentBuildFile.canonicalPath}")
        }
    } catch (Exception e) {
        event("StatusFinal", ["Error instrumenting classes: ${e.message}"])
        exit(1)
    } finally {
        if (instrumentBuildFile) {
            instrumentBuildFile.delete()
        }
    }
}

boolean isCoverageEnabled() {
    if (argsMap.containsKey('nocoverage')) {
        return false
    } else if (argsMap.containsKey('coverage')) {
        return true
    } else {
        return buildConfig.coverage.enabledByDefault
    }
}

boolean isAppendCoverageResultsEnabled() {
    if (argsMap.containsKey('noappend')) {
        return false
    } else if (argsMap.containsKey('append')) {
        return true
    } else {
        return buildConfig.coverage.appendCoverageResults
    }
}

def flushReportData() {
    try {
        net.sourceforge.cobertura.coveragedata.ProjectData.saveGlobalProjectData()
    } catch (Exception e) {
        event("StatusError", ["""
--------------------------------------------
***********WARNING*************
Unable to flush code coverage data.
This usually happens when tests don't actually test anything;
e.g. none of the instrumented classes were exercised by tests!
--------------------------------------------
"""])
    }
}

/**
 * @return Grails test classpath with ASM 3.Y.X removed
 */
String createCoverageClasspath() {
    String pathSeparator = System.getProperty('path.separator')
    String fileSeparator = System.getProperty('file.separator')
    String separator = "\\${fileSeparator}"
    String pattern = "^.*?${separator}asm${separator}asm-?.*${separator}3\\..*?${separator}asm-?.*-3\\..*?\\.jar\$"
    String includedJarPattern = "^.*?${separator}asm${separator}asm-?.*${separator}jars${separator}asm-?.*-3\\..*?\\.jar\$"

    List<String> classpathEntries = []

    Path grailsTestClasspath = ant.path(id: 'coverage.classpath') {
        ant.path(refid: 'grails.test.classpath')
    }

    grailsTestClasspath.toString().split(pathSeparator).each { String classpathEntry ->
//        event("StatusUpdate", ["Checking classpathEntry $classpathEntry for ASM"])
        if (classpathEntry ==~ pattern || classpathEntry ==~ includedJarPattern ) {
            println """INFO: Found ASM 3: ${classpathEntry}.
      Possibly because grails-core (grails-plugin-databinding) uses it.
      Removing from instrumentation classpath!"""
        } else {
            classpathEntries << classpathEntry
        }
    }

    return classpathEntries.join(pathSeparator)
}

/**
 * This is a simple builder for creating an Ant build file for Instrumentation.
 * It has to be a separate class, otherwise the StreamingMarkupBuilder
 * (or the MarkupBuilder) will not add the 'target' element to the build file,
 * as target is a valid method call in a Gant script (as it is also an Ant build file).
 */
class AntInstrumentationBuildfileBuilder {

    String dataFile

    int forkedJVMDebugPort

    String coverageClasspath

    File classesDir

    List<String> codeCoverageExclusionList

    public AntInstrumentationBuildfileBuilder setDataFile(String dataFile) {
        this.dataFile = dataFile

        return this
    }

    public AntInstrumentationBuildfileBuilder setForkedJVMDebugPort(int forkedJVMDebugPort) {
        this.forkedJVMDebugPort = forkedJVMDebugPort

        return this
    }

    public AntInstrumentationBuildfileBuilder setCoverageClasspath(String coverageClasspath) {
        this.coverageClasspath = coverageClasspath

        return this
    }

    public AntInstrumentationBuildfileBuilder setClassesDir(File classesDir) {
        this.classesDir = classesDir

        return this
    }

    public AntInstrumentationBuildfileBuilder setCodeCoverageExclusionList(codeCoverageExclusionList) {
        this.codeCoverageExclusionList = codeCoverageExclusionList

        return this
    }

    public String build() {
        StringWriter writer = new StringWriter()
        MarkupBuilder builder = new MarkupBuilder(writer)
        builder.useDoubleQuotes = true

        String pathSeparator = System.getProperty('path.separator')

        Map<String, String> instrumentArguments = [:]

        instrumentArguments['datafile'] = "${dataFile}"

        if (forkedJVMDebugPort > 0) {
            instrumentArguments['forkedJVMDebugPort'] = "${forkedJVMDebugPort}"
        }

        builder.'project'(basedir: '.', default: 'instrument', name: 'instrument') {
            'path'(id: 'instrument.path') {
                coverageClasspath.split(pathSeparator).each { String library ->
                    'pathelement'(location: "${library}")
                }
            }
            'taskdef'(classpathRef: 'instrument.path', resource: 'tasks.properties')
            'target'(name: 'instrument') {
                'cobertura-instrument'(instrumentArguments) {
                    'fileset'(dir: "${classesDir.absolutePath}") {
                        'include'(name: "**/*.class")
                        codeCoverageExclusionList.each { pattern ->
                            'exclude'(name: "${pattern}")
                        }
                    }
                }
            }
        }

        return writer.toString()
    }
}
