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
    abstract def getConnection(params)
    abstract def getBody(params)

    String registerJob(params) throws HttpResponseException {
        getConnection(params).request(POST) { req ->
            body = getBody(params)
            response.success = onResponseSuccess
        }
    }
}
