package au.org.emii.portal.utils;

import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class BrowserStackUtil {

    private static Logger log = Logger.getLogger(BrowserStackUtil.class.getName());

    public static String executeCurl(String command) {
        Process curlProc;
        String curlResponse = null;
        try {
            curlProc = Runtime.getRuntime().exec(command);

            DataInputStream curlIn = new DataInputStream(
                    curlProc.getInputStream());

            // read the output from the command
            BufferedReader stdInput = new BufferedReader(new
                    InputStreamReader(curlProc.getInputStream()));
            while ((curlResponse = stdInput.readLine()) != null) {
                System.out.println(curlResponse);
            }

            // read any errors from the attempted command
            BufferedReader stdError = new BufferedReader(new
                    InputStreamReader(curlProc.getErrorStream()));
            while ((curlResponse = stdError.readLine()) != null) {
                System.out.println(curlResponse);
            }
        } catch (IOException e) {
            log.error("Unable to execute curl command", e);
        }
        return curlResponse;
    }
}
