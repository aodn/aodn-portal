/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class Motd {

    String motd         //message of the day
    String motdTitle

    static mapping = {
        sort "motdTitle"
        motd type: 'text'
    }


    static constraints = {
    }

    String toString() {
        return "${motdTitle}"
    }
}
