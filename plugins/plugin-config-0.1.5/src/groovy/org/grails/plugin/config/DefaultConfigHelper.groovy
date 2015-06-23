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
package org.grails.plugin.config

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.plugins.GrailsPluginManager
import org.springframework.util.Assert

/**
 * 
 * @author Daniel Henrique Alves Lima
 *
 */
class DefaultConfigHelper extends AbstractConfigHelper {    

    @Override
    public void enhanceClasses() {
        enhanceGrailsApplicationClass()
        enhanceConfigObjectClass()
    }


    @Override
    public void notifyConfigChange() {
        if (log.isDebugEnabled()) {
            log.debug("Notifying config change for ${GrailsApplication}")
        }

        //MetaClass mc = GrailsApplication.metaClass
        //if (mc.respondsTo(GrailsApplication, '_notifyConfigChange')) {
            GrailsApplication._notifyConfigChange()
        //}                 
    }

    
    protected void enhanceGrailsApplicationClass() {
        if (log.isDebugEnabled()) {
            log.debug("Enhancing ${GrailsApplication}")
        }

        def outerThis = this
        MetaClass mc = GrailsApplication.metaClass
        if (!mc.respondsTo(GrailsApplication, 'getMergedConfig')) {
            log.debug('Adding getMergedConfig()')

            Map appsWitCachedConfig = new IdentityHashMap()
            mc._mergedConfig = null
            mc.'static'._appsWitCachedConfig = appsWitCachedConfig
            
            mc.getMergedConfig = {boolean reload = false ->

                if (log.isDebugEnabled()) {
                    log.debug("delegate ${delegate}")
                }
                GrailsApplication app = (GrailsApplication) delegate
                GrailsPluginManager pluginManager = super.getPluginManager(app)
                if (log.isDebugEnabled()) {
                    log.debug("delegate._mergedConfig ${delegate._mergedConfig?'[...]': 'null'}")
                }
                if (delegate._mergedConfig == null || reload) {
                    delegate._mergedConfig = super.buildMergedConfig(
                            pluginManager, app);
                    appsWitCachedConfig.put(app, app)
                    /*if (log.isDebugEnabled()) {
                        log.debug("0 appsWitCachedConfig ${appsWitCachedConfig}")
                    }*/
                }

                return delegate._mergedConfig
            }
            
            mc.'static'._notifyConfigChange = {
                /*if (log.isDebugEnabled()) {
                    log.debug("1 appsWitCachedConfig ${appsWitCachedConfig}")
                }*/
                for (app in appsWitCachedConfig.keySet()) {
                    GrailsApplication grailsApplication = (GrailsApplication) app                    
                    log.debug("Clearing _mergedConfig for ${grailsApplication}")
                    grailsApplication._mergedConfig = null                    
                }
                appsWitCachedConfig.clear()
            }
        }

        Assert.notEmpty mc.respondsTo(GrailsApplication, 'getMergedConfig')
    }

        
    protected void enhanceConfigObjectClass() {
        if (log.isDebugEnabled()) {
            log.debug("Enhancing ${ConfigObject}")
        }
        
        MetaClass mc = ConfigObject.metaClass
        if (!mc.respondsTo(ConfigObject, 'asMap')) {
            mc.asMap = {boolean checked = false ->
                ConfigObject delegate = (ConfigObject) delegate
                return AbstractConfigHelper.ConfigObjectProxy.newInstance(delegate, checked) 
            }           
            
            Assert.notEmpty mc.respondsTo(ConfigObject, 'asMap')
        }
    }
}
