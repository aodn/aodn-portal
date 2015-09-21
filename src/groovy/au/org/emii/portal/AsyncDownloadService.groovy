/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import groovyx.net.http.HttpResponseException

import static groovyx.net.http.Method.POST

abstract class AsyncDownloadService {
    abstract def getConnection()
    abstract def getBody(params)

    String registerJob(params) throws HttpResponseException {
        connection.request(POST) { req ->
            body = getBody(params)
            response.success = onResponseSuccess
            // TODO: failure
        }
    }
}
