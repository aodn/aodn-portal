/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal
import au.org.emii.portal.TimedEvictingQueue

import grails.test.GrailsUnitTestCase

class TimedEvictingQueueTests extends GrailsUnitTestCase {

    TimedEvictingQueue<String> queue

    protected void setUp() {
        super.setUp()

        queue = new TimedEvictingQueue<String>()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testQueue() {
        //assertTrue false
        queue.add("test item1")
        queue.add("test item2")

        assertEquals 2, queue.size()
    }

    void testSizeCallsEvict() {
        boolean evictCalled = false

        queue.metaClass.evict = {
            evictCalled = true
        }

        queue.size()

        assertTrue evictCalled
    }

    void testEvict() {
        queue.backlogIntervalMilli = 0
        queue.add("test item1")
        queue.add("test item2")
        // Will be 0 as evict should remove them instantly
        assertEquals 0, queue.size()

        // Set to 10 milli
        queue.backlogIntervalMilli = 10
        queue.add("test item3")
        queue.add("test item4")
        assertEquals 2, queue.size()

        // After sleeping for 20 milli, queue should evict everything
        Thread.sleep(20)
        assertEquals 0, queue.size()
    }

}
