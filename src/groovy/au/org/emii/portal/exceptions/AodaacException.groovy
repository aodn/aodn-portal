
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.exceptions

class AodaacException extends RuntimeException {

    AodaacException(String message) {

        super(message)
    }

    AodaacException(String message, Throwable cause) {

        super(message, cause)
    }
}
