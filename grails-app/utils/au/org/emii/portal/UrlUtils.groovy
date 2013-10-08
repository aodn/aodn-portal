
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

final class UrlUtils {

    static String ensureTrailingSlash(url) {

        url.endsWith("/") ? url : "$url/"
    }

    static String urlWithQueryString(url, queryString) {

        def symbol = url.contains("?") ? "&" : "?"

        return url + symbol + queryString
    }

    static String urlWithQueryString(url, Map queryStringValues) {

        def queryString = queryStringValues.collect{
            k, v ->

            k + "=" + URLEncoder.encode(v.toString(), "UTF-8")
        }.join("&")

        return urlWithQueryString(url, queryString)
    }
}
