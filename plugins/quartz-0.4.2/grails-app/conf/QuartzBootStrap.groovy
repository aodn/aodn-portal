/*
 * Copyright 2004-2005 the original author or authors.
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

import org.codehaus.groovy.grails.commons.ApplicationAttributes
import org.codehaus.groovy.grails.commons.ConfigurationHolder

/**
 * Bootstrap class which turns on scheduler if autoStartup config parameter is set to true.
 *
 * @author Sergey Nebolsin
 *
 * @since 0.3
 */
class QuartzBootStrap {
    def quartzScheduler

    def init = {servletContext ->
        if(ConfigurationHolder.config?.quartz?.autoStartup) quartzScheduler.start()
    }
    def destroy = {}
}
