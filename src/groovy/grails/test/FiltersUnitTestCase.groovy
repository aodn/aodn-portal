/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package grails.test

import org.codehaus.groovy.grails.plugins.web.filters.DefaultGrailsFiltersClass
import org.codehaus.groovy.grails.plugins.web.filters.FilterConfig

/**
 * Support class for writing unit tests for filters. Its main job
 * is to mock the various properties and methods that Grails injects
 * into filters. By default it determines what filters to mock
 * based on the name of the test, but this can be overridden by one
 * of the constructors.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class FiltersUnitTestCase extends MvcUnitTestCase {

    protected filters
    protected List<FilterConfig> configs
    protected Map<String, FilterConfig> configMap

    /**
     * Creates a new test case in the same package as the filters being tested
     * and with the same prefix before 'Filters' in its name.
     * For example, if the class name of the test were
     * <code>org.example.TestFiltersTests</code>, this constructor
     * would mock <code>org.example.TestFilters</code>.
     */
    FiltersUnitTestCase() {
        super('Filters')
    }

    /**
     * Creates a new test case for the given filters class.
     */
    FiltersUnitTestCase(Class filtersClass) {
        super(filtersClass)
    }

    /**
     * {@inheritDoc}
     * @see junit.framework.TestCase#setUp()
     */
    @Override
    protected void setUp() {
        super.setUp()

        mockFilters()
        filters = newInstance()

        configs = new DefaultGrailsFiltersClass(testClass).getConfigs(filters)

        configMap = [:]
        configs.each { config -> configMap[config.name] = config }
    }

    /**
     * TODO  move to GrailsUnitTestCase.
     */
    protected void mockFilters() {
        registerMetaClass FilterConfig
        MockUtils_mockFilters()
    }

    // TODO  move to MockUtils as mockFilters()
    protected void MockUtils_mockFilters() {
        MockUtils.mockLogging FilterConfig
        MockUtils.addCommonWebProperties FilterConfig

        Map redirectArgs = [:]
        FilterConfig.metaClass.getRedirectArgs = { -> redirectArgs }
        FilterConfig.metaClass.redirect = { Map map -> redirectArgs.putAll(map) }

        Map renderArgs = [:]
        FilterConfig.metaClass.getRenderArgs = { -> renderArgs }
        // TODO  implement render() variants
    }

    protected newInstance() {
        return testClass.newInstance()
    }

    protected Class getFiltersClass() {
        return testClass
    }

    /**
     * Find the named filter.
	 * @param name  the filter name
     * @return the filter
     */
    protected FilterConfig getFilter(String name) {
        return configMap[name]
    }

    /**
     * Get the named filter and lookup mock objects for it. Typically the
     * first method call in a test class, e.g.
     * <code>
     * def filter = initFilter('foo')
     * </code>
     */
    protected FilterConfig initFilter(String name) {

        FilterConfig filter = getFilter(name)

        redirectArgs = filter.redirectArgs
        renderArgs = filter.renderArgs

        mockRequest = filter.request
        mockResponse = filter.response
        mockSession = filter.session
        mockParams = filter.params
        mockFlash = filter.flash

        return filter
    }

    /**
     * Assertion for the scope of a filter (e.g. "[controller: '*', action: '*']").
	 * @param expectedScope  the expected scope
	 * @param name  the filter name
     */
    protected void assertScope(expectedScope, String name) {
        assertEquals expectedScope, getFilter(name).scope
    }

    /**
     * Assertion that there is a 'before' closure for the named filter.
	 * @param name  the filter name
     */
    protected void assertExistsBefore(String name) {
        assertNotNull getFilter(name).before
    }

    /**
     * Assertion that there is no 'before' closure for the named filter.
	 * @param name  the filter name
     */
    protected void assertNotExistsBefore(String name) {
        assertNull getFilter(name).before
    }

    /**
     * Assertion that there is an 'after' closure for the named filter.
	 * @param name  the filter name
     */
    protected void assertExistsAfter(String name) {
        assertNotNull getFilter(name).after
    }

    /**
     * Assertion that there is no 'after' closure for the named filter.
	 * @param name  the filter name
     */
    protected void assertNotExistsAfter(String name) {
        assertNull getFilter(name).after
    }

    /**
     * Assertion that there is an 'afterView' closure for the named filter.
	 * @param name  the filter name
     */
    protected void assertExistsAfterView(String name) {
        assertNotNull getFilter(name).afterView
    }

    /**
     * Assertion that there is no 'afterView' closure for the named filter.
	 * @param name  the filter name
     */
    protected void assertNotExistsAfterView(String name) {
        assertNull getFilter(name).afterView
    }

    /**
     * Assertion for the number of filters.
	 * @param expected  the expected number
     */
    protected void assertFilterCount(int expected) {
        assertEquals expected, configs.size()
    }

    /**
     * Set the 'controllerName' property.
	 * @param name  the controller name
     */
    protected void setControllerName(String name) {
        FilterConfig.metaClass.getControllerName = { -> name }
    }

    /**
     * Set the 'actionName' property.
	 * @param name  the action name
     */
    protected void setActionName(String name) {
        FilterConfig.metaClass.getActionName = { -> name }
    }
}
