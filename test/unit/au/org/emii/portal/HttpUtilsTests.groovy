/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

import static au.org.emii.portal.HttpUtils.buildAttachmentHeaderValueWithFilename

class HttpUtilsTests extends GrailsUnitTestCase {

    void testBuildAttachmentHeaderValueWithFilename() {
        assertEquals(
            "attachment; filename*=UTF-8''thefilename",
            buildAttachmentHeaderValueWithFilename('thefilename')
        )

        assertEquals(
            "attachment; filename*=UTF-8''the%28filename%29",
            buildAttachmentHeaderValueWithFilename('the(filename)')
        )
    }
}
