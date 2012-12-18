/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class Style {

    String name
    String title
    String abstractText // 'abstract' is a reserved word

    static mapping = {
		abstractText type: 'text'
    }

    static constraints = {
        title(nullable: true)
        abstractText(nullable: true)
    }
}