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
package org.grails.plugin.config;

import grails.util.Environment;
import grails.util.Metadata;
import groovy.lang.Closure;
import groovy.lang.GroovyClassLoader;
import groovy.lang.GroovyObject;
import groovy.util.ConfigObject;
import groovy.util.ConfigSlurper;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.groovy.grails.commons.GrailsApplication;
import org.codehaus.groovy.grails.commons.GrailsClassUtils;
import org.codehaus.groovy.grails.commons.cfg.ConfigurationHelper;
import org.codehaus.groovy.grails.plugins.GrailsPlugin;
import org.codehaus.groovy.grails.plugins.GrailsPluginManager;
import org.springframework.context.ApplicationContext;
import org.springframework.util.Assert;

/**
 * 
 * @author Daniel Henrique Alves Lima
 * 
 */
public abstract class AbstractConfigHelper  {

    private static final String GRAILS_PLUGIN_SUFFIX = "GrailsPlugin";
    private static final String DEFAULT_CONFIG_SUFFIX = "DefaultConfig";

    protected final Log log = LogFactory.getLog(getClass());
    private GrailsPluginManager defaultPluginManager;

   
    public void setDefaultPluginManager(GrailsPluginManager defaultPluginManager) {
        if (log.isDebugEnabled()) {
            log.debug("setPluginManager(): " + defaultPluginManager);
        }
        this.defaultPluginManager = defaultPluginManager;
    }

    public abstract void enhanceClasses();

    public abstract void notifyConfigChange();

    protected ConfigObject buildMergedConfig(GrailsPluginManager pluginManager,
            GrailsApplication grailsApplication) {
        if (log.isDebugEnabled()) {
            log.debug("getMergedConfigImpl()");
        }

        Assert.notNull(pluginManager);
        Assert.notNull(grailsApplication);
        
        Metadata applicationMetaData = (Metadata) grailsApplication.getMetadata();
        String applicationName = applicationMetaData.getApplicationName();

        List<Class<?>> defaultConfigClasses = new ArrayList<Class<?>>();

        /*
         * Search for all the default configurations using the plugin manager
         * processing order.
         */
        List<Closure> afterConfigMergeClosures = new ArrayList<Closure>();
        boolean classesLoaded = false;
        if (grailsApplication.isInitialised()) {
            Class<?>[] classes = grailsApplication.getAllClasses();
            if (classes != null && classes.length > 0) {
                classesLoaded = true;
            }
        }
        for (GrailsPlugin plugin : pluginManager.getAllPlugins()) {
            if (plugin.isEnabled()) {
                Class<?> defaultConfigClass = null;

                Class<?> pluginClass = plugin.getPluginClass();
                org.codehaus.groovy.grails.plugins.metadata.GrailsPlugin pluginClassMetadata = null;
                org.codehaus.groovy.grails.plugins.metadata.GrailsPlugin defaultConfigClassMetadata = null;

                String configName = pluginClass.getSimpleName();
                if (configName.endsWith(GRAILS_PLUGIN_SUFFIX)) {
                    configName = configName.replace(GRAILS_PLUGIN_SUFFIX,
                            DEFAULT_CONFIG_SUFFIX);
                } else {
                    configName = configName + DEFAULT_CONFIG_SUFFIX;
                }
                if (log.isDebugEnabled()) {
                    log.debug("getMergedConfigImpl(): configName " + configName);
                }

                if (classesLoaded) {
                    defaultConfigClass = grailsApplication
                            .getClassForName(configName);
                } else {
                    /*
                     * When called from doWithWebDescriptor, classes aren't
                     * loaded yet.
                     */
                    try {
                        defaultConfigClass = grailsApplication.getClassLoader()
                                .loadClass(configName);
                        // defaultConfigClass = null;
                    } catch (ClassNotFoundException e) {
                    }
                }

                if (defaultConfigClass != null) {
                    /* The class is inside one grails-app subdirectory. */
                    pluginClassMetadata = pluginClass
                            .getAnnotation(org.codehaus.groovy.grails.plugins.metadata.GrailsPlugin.class);

                    defaultConfigClassMetadata = defaultConfigClass
                            .getAnnotation(org.codehaus.groovy.grails.plugins.metadata.GrailsPlugin.class);

                    if (log.isDebugEnabled()) {
                        log.debug("getMergedConfigImpl(): pluginClassMetadata "
                                + pluginClassMetadata);
                        log.debug("getMergedConfigImpl(): defaultConfigClassMetadata "
                                + defaultConfigClassMetadata);
                    }

                    if (pluginClassMetadata == null
                            && defaultConfigClassMetadata == null
                            || pluginClassMetadata != null
                            && defaultConfigClassMetadata != null
                            && pluginClassMetadata.name().equals(
                                    defaultConfigClassMetadata.name())
                            || /* Workaround when building this as a Grails 2.0.0 plugin. */ 
                            applicationName != null
                            && applicationName.equals(plugin.getFileSystemShortName())) {
                        /* The default config belongs to this plugin. */
                        log.debug("getMergedConfigImpl(): default config found");
                    } else {
                        if (log.isWarnEnabled()) {
                            log.warn("getMergedConfigImpl(): "
                                    + defaultConfigClass
                                    + " doesn't belong to " + plugin.getName());
                        }
                        defaultConfigClass = null;
                    }

                }

                if (defaultConfigClass != null) {
                    defaultConfigClasses.add(defaultConfigClass);
                }

                GroovyObject pluginInstance = plugin.getInstance();
                Object o = GrailsClassUtils
                        .getPropertyOrStaticPropertyOrFieldValue(
                                pluginInstance, "afterConfigMerge");
                if (o != null) {
                    Closure c = null;
                    if (o instanceof Closure) {
                        c = (Closure) o;
                        if (c.getMaximumNumberOfParameters() > 0) {
                            afterConfigMergeClosures.add(c);
                            //c.setDelegate(plugin);
                        } else {
                            c = null;
                        }
                    }

                    if (c == null) {
                        if (log.isWarnEnabled()) {
                            log.warn("getMergedConfigImpl(): Invalid afterConfigMerge closure "
                                    + o);
                        }
                    }
                }
            }
        }

        if (log.isDebugEnabled()) {
            log.debug("getMergedConfigImpl(): defaultConfigClasses "
                    + defaultConfigClasses);
        }

        GroovyClassLoader classLoader = null;

        {
            ClassLoader parentClassLoader = grailsApplication.getClassLoader();
            if (parentClassLoader == null) {
                parentClassLoader = Thread.currentThread()
                        .getContextClassLoader();
                if (parentClassLoader == null) {
                    parentClassLoader = this.getClass().getClassLoader();
                }
            }

            if (parentClassLoader instanceof GroovyClassLoader) {
                classLoader = (GroovyClassLoader) parentClassLoader;
            } else {
                classLoader = new GroovyClassLoader(parentClassLoader);
            }
        }

        ConfigObject config = new ConfigObject();
        mergeInDefaultConfigs(config, defaultConfigClasses, classLoader);

        ConfigurationHelper.initConfig(config, null, classLoader);
        config.merge(grailsApplication.getConfig());
        if (log.isDebugEnabled()) {
            log.debug("getMergedConfigImpl(): config " + config);
        }

        /*
         * Executed the collected closures. It's the last chance of influencing
         * the merged config.
         */
        {
            Map<String, Object> ctx = new LinkedHashMap<String, Object>();
            ctx.put("appConfig", grailsApplication.getConfig());
            ctx = Collections.unmodifiableMap(ctx);

            Object arg = config;
            Object [] args = new Object[] { config, ctx };

            for (Closure closure : afterConfigMergeClosures) {
                try {
                    if (closure.getMaximumNumberOfParameters() == 1) {
                        closure.call(arg);
                    } else {
                        closure.call(args);
                    }
                } catch (RuntimeException e) {
                    log.error(
                            "getMergedConfigImpl(): error executing afterConfigClosure",
                            e);
                }
            }
        }

        return config;
    }

    protected void mergeInDefaultConfigs(ConfigObject config,
            List<Class<?>> defaultConfigClasses, GroovyClassLoader classLoader) {
        ConfigSlurper configSlurper = new ConfigSlurper(Environment
                .getCurrent().getName());
        configSlurper.setClassLoader(classLoader);
        for (Class<?> defaultConfigClass : defaultConfigClasses) {
            try {
                configSlurper.setBinding(config);
                ConfigObject newConfig = configSlurper
                        .parse(defaultConfigClass);
                if (log.isDebugEnabled()) {
                    log.debug("mergeInDefaultConfigs(): newConfig " + newConfig);
                }
                config.merge(newConfig);
            } catch (RuntimeException e) {
                log.error("mergeInDefaultConfigs(): Error merging "
                        + defaultConfigClass, e);
            }
        }

        if (log.isDebugEnabled()) {
            log.debug("mergeInDefaultConfigs(): config " + config);
        }
    }

    protected GrailsPluginManager getPluginManager(
            GrailsApplication grailsApplication) {
        GrailsPluginManager pluginManager = null;

        {
            ApplicationContext mainContext = grailsApplication.getMainContext();
            if (mainContext != null) {
                pluginManager = (GrailsPluginManager) mainContext
                        .getBean("pluginManager");

            }
        }

        if (pluginManager == null) {
            ApplicationContext mainContext = grailsApplication
                    .getParentContext();
            if (mainContext != null) {
                try {
                    pluginManager = (GrailsPluginManager) mainContext
                        .getBean("pluginManager");
                } catch (org.springframework.beans.factory.NoSuchBeanDefinitionException e) {
                    /* Workaround for Grails 2.0.0. */
                    log.warn("getPluginManager()", e);
                }
            }
        }

        if (pluginManager == null) {
            pluginManager = this.defaultPluginManager;
        }

        Assert.notNull(pluginManager);

        return pluginManager;
    }

    protected static class ConfigObjectProxy implements InvocationHandler {

        private static final Log LOG = LogFactory
                .getLog(ConfigObjectProxy.class);

        private boolean isCheckedMap;
        private Map<Object, Object> config;

        public static Object newInstance(Map<Object, Object> config,
                boolean isCheckedMap) {
            ClassLoader cl = config.getClass().getClassLoader();

            Class<?>[] configInterfaces = config.getClass().getInterfaces();
            Set<Class<?>> interfaces = new LinkedHashSet<Class<?>>(
                    Arrays.asList(configInterfaces));
            interfaces.add(Map.class);
            Assert.isTrue(interfaces.remove(GroovyObject.class));

            @SuppressWarnings("unchecked")
            Map<Object, Object> result = (Map<Object, Object>) java.lang.reflect.Proxy
                    .newProxyInstance(
                            cl,
                            interfaces.toArray(new Class<?>[interfaces.size()]),
                            new ConfigObjectProxy(config, isCheckedMap));

            return result;
        }

        private ConfigObjectProxy(Map<Object, Object> config,
                boolean isCheckedMap) {
            this.config = config;
            this.isCheckedMap = isCheckedMap;
        }

        @SuppressWarnings({ "unchecked" })
        public Object invoke(Object proxy, Method m, Object[] args)
                throws Throwable {
            Object result = null;
            try {
                if (LOG.isDebugEnabled()) {
                    LOG.debug("before method " + m.getName());
                }

                if (m.getDeclaringClass().equals(Map.class)
                        && m.getName().equals("get")) {
                    boolean containsKey = config.containsKey(args[0]);

                    if (!containsKey) {
                        result = null;

                        if (isCheckedMap) {
                            throw new IllegalArgumentException(
                                    "Inexistent key " + args[0]);
                        }
                    }
                }

                if (result == null) {
                    result = m.invoke(config, args);
                }

                if (result != null && result instanceof ConfigObject) {
                    result = newInstance((Map<Object, Object>) result,
                            isCheckedMap);
                }
                /*
                 * } catch (Exception e) { throw new
                 * RuntimeException("unexpected invocation exception: " +
                 * e.getMessage());
                 */
            } finally {
                if (LOG.isDebugEnabled()) {
                    LOG.debug("after method " + m.getName());
                }
            }
            return result;
        }
    }

}
