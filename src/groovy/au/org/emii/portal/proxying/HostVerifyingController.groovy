package au.org.emii.portal.proxying

import static au.org.emii.portal.HttpUtils.Status.HTTP_400_BAD_REQUEST
import static au.org.emii.portal.HttpUtils.Status.HTTP_403_FORBIDDEN

abstract class HostVerifyingController {
    def hostVerifier

    def ifAllowed = { url, closure ->

        if (!url) {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: HTTP_400_BAD_REQUEST
        }
        else if (!hostVerifier.allowedHost(url)) {
            log.info "Requests to the url '$url' are not allowed"
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: HTTP_403_FORBIDDEN
        }
        else {
            closure()
        }
    }
}
