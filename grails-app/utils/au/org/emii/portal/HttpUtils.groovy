/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

final class HttpUtils {
    static String buildAttachmentHeaderValueWithFilename(String filename) {
        // Make sure the filename is encoded, see:
        // http://stackoverflow.com/questions/7967079/special-characters-in-content-disposition-filename
        return "attachment; filename*=UTF-8''${URLEncoder.encode(filename, 'UTF-8')}"
    }
}
