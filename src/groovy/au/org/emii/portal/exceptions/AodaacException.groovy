package au.org.emii.portal.exceptions

class AodaacException extends RuntimeException {

    AodaacException(String message) {

        super(message)
    }

    AodaacException(String message, Throwable cause) {

        super(message, cause)
    }
}
