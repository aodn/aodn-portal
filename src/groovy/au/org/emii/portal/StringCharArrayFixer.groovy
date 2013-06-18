
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class StringCharArrayFixer {

    static void run(toExecute) {

        // NoSuchFieldException getting thrown is a known problem with grails 1.3.7
        // it's caused by the use of a grails hack which trys to access no existent String properties
        // Therefore disable the hack beforehand and reenable after.
        // see http://stackoverflow.com/questions/14510805/grails-1-3-7-java-7-compatibility
        // and http://grails.org/doc/1.1.1/api/org/codehaus/groovy/grails/web/util/StringCharArrayAccessor.html

        System.setProperty("stringchararrayaccessor.disabled", "true")

        toExecute()

        System.setProperty("stringchararrayaccessor.disabled", "false")
    }
}
