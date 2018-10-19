package au.org.emii.portal

import au.org.emii.portal.proxying.ExternalRequest

final class UrlUtils {

    static String ensureTrailingSlash(url) {

        url.endsWith("/") ? url : "$url/"
    }

    static String urlWithQueryString(url, queryString) {
        def symbol = url.contains("?") ? "&" : "?"

        def returnUrl = url + symbol + queryString

        if (returnUrl.endsWith("&")) {
            returnUrl = returnUrl.substring(0, returnUrl.length() - 1)
        }

        return returnUrl
    }

    static String urlWithQueryString(url, Map queryStringValues) {

        def queryString = queryStringValues.collect{
            k, v ->

            k + "=" + URLEncoder.encode(v.toString(), "UTF-8")
        }.join("&")

        return urlWithQueryString(url, queryString)
    }

    static String load(url) {
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, url.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

}
