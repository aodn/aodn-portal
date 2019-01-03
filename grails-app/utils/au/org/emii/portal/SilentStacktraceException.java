package au.org.emii.portal;

public class SilentStacktraceException extends Exception {


    public SilentStacktraceException() {
        super("This exception is silent", null, true, false);
    }

    public SilentStacktraceException(String message) {
        super(message, null, true, false);
    }

    public SilentStacktraceException(String message, Boolean show) {
        super(message, null, show, !show);
    }

    @Override
    public String toString() {
        return "";
    }
}
