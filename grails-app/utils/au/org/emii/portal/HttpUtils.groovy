package au.org.emii.portal

final class HttpUtils {

    class Status {
        static final HTTP_200_OK = 200
        static final HTTP_400_BAD_REQUEST = 400
        static final HTTP_401_UNAUTHORISED = 401
        static final HTTP_403_FORBIDDEN = 403
        static final HTTP_404_NOT_FOUND = 404
        static final HTTP_500_INTERNAL_SERVER_ERROR = 500
        static final HTTP_502_BAD_GATEWAY = 502
    }

    static String buildAttachmentHeaderValueWithFilename(String filename) {
        // Make sure the filename is encoded, see:
        // http://stackoverflow.com/questions/7967079/special-characters-in-content-disposition-filename
        return "attachment; filename*=UTF-8''${URLEncoder.encode(filename, 'UTF-8')}"
    }
}
