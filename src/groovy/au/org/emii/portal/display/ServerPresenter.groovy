
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.display

class ServerPresenter {

    def id
    def name

    ServerPresenter(domainServer) {
        id = domainServer.id
        name = domainServer.name
    }
}
