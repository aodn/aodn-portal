/*
 * Copyright 2011 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import org.grails.plugin.config.DefaultConfigHelper

class PluginConfigGrailsPlugin {
    // the plugin version
    def version = '0.1.5'
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = '1.2.0 > *'
    // the other plugins this plugin depends on
    def dependsOn = ['core': '* > 1.0']

    def loadBefore = ['logging']
    def loadAfter = ['core']

    // resources that are excluded from plugin packaging
    def pluginExcludes = [
        "grails-app/views/error.gsp",
        'scripts/**/Eclipse.groovy',
        'grails-app/conf/**/FiltersDefaultConfig.groovy',
        'test-plugins/**/*'
    ]

    // TODO Fill in these fields
    def author = "Daniel Henrique Alves Lima"
    def authorEmail = "email_daniel_h@yahoo.com.br"
    def title = 'Grails Plugin Config Plugin'
    def description = '''\\
Plugin to simplify plugin configuration tasks.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/plugin-config"

    // register the artefact handler
    //def artefacts = [DefaultConfigArtefactHandler]

    // watch for any changes in these directories
    def watchedResources = [
        "file:./grails-app/config/**/*DefaultConfig.groovy",
        "file:../../plugins/**/grails-app/config/**/*DefaultConfig.groovy"
    ]
    
    private DefaultConfigHelper configHelper = new DefaultConfigHelper()
    
    //def defaultConfig = PluginConfigDefaultConfig

    def doWithWebDescriptor = { xml ->
        // TODO Implement additions to web.xml (optional), this event occurs before
        //println "${this.class}.doWithWebDescriptor()"
        enhanceClasses(manager)
    }

    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
        //println "${this.class}.doWithSpring()"
        enhanceClasses(manager)
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
        //println "${this.class}.doWithDynamicMethod()"
        enhanceClasses(manager)
    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
        //println "${this.class}.doWithApplicationContext()"
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
        configHelper.notifyConfigChange()
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
        configHelper.notifyConfigChange()
    }
    
    
    private def enhanceClasses = {pluginManager ->
        configHelper.defaultPluginManager = pluginManager
        configHelper.enhanceClasses()
    }
}
