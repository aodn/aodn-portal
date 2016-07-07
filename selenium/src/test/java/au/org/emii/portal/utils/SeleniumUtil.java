package au.org.emii.portal.utils;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContexts;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import javax.net.ssl.SSLContext;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

public class SeleniumUtil {

    private static Logger log = Logger.getLogger(SeleniumUtil.class.getName());

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

    //Find Broken / Invalid Images on a Page
    public static int validateInvalidImages(WebDriver driver) {
        int invalidImageCount = 0;
        List<WebElement> imagesList = driver.findElements(By.tagName("img"));
        List<String> uniqueSrcList = new ArrayList<>();
        log.info("Total no. of images are " + imagesList.size());
        for (WebElement imgElement : imagesList) {
            if (imgElement != null && imgElement.getAttribute("src") != null && !uniqueSrcList.contains(imgElement.getAttribute("src"))) {
                uniqueSrcList.add(imgElement.getAttribute("src"));
                invalidImageCount = verifyURLStatus(imgElement.getAttribute("src"), invalidImageCount);
            }
        }
        log.info("Total no. of invalid images are " + invalidImageCount);
        return invalidImageCount;
    }

    //Find out broken links on website
    public static int validateInvalidLinks(WebDriver driver) {

        int invalidLinksCount = 0;
        List<WebElement> anchorTagsList = driver.findElements(By
                .tagName("a"));
        List<String> uniqueAnchorList = new ArrayList<>();
        log.info("Total no. of links are "
                + anchorTagsList.size());

        for (int i = 0; i < anchorTagsList.size(); i++) {
            WebElement anchorTag = anchorTagsList.get(i);
            String url = anchorTag.getAttribute("href");
            if (anchorTag != null && url != null && !uniqueAnchorList.contains(url)) {
                uniqueAnchorList.add(url);
                if (!url.contains("javascript")) {
                    invalidLinksCount = verifyURLStatus(url, invalidLinksCount);
                } else {
                    log.error("Invalid link " + url);
                    invalidLinksCount++;
                }
            }
        }

        log.info("Total no. of invalid links are "
                + invalidLinksCount);
        return invalidLinksCount;
    }

    public static int verifyURLStatus(String URL, int invalidLinksCount) {
        log.info("Validating URL " + URL);
        //Validating the contact us email
        if (URL.startsWith("mailto:info@aodn.org.au?subject=")) {
            return invalidLinksCount;
        }
        try {
            SSLContext sslContext = SSLContexts.custom()
                    .loadTrustMaterial(null, new TrustStrategy() {

                        @Override
                        public boolean isTrusted(final X509Certificate[] chain, final String authType) throws CertificateException {
                            return true;
                        }
                    })
                    .useTLS()
                    .build();
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext);
            CloseableHttpClient client = HttpClientBuilder.create().setSSLSocketFactory(sslsf).build();
            HttpGet request = new HttpGet(URL);
            HttpResponse response = client.execute(request);
            // verifying response code and The HttpStatus should be 200 if not,
            // increment invalid link count
            ////We can also check for 404 status code like response.getStatusLine().getStatusCode() == 404
            if (response.getStatusLine().getStatusCode() != 200)
                invalidLinksCount++;
        } catch (Exception e) {
            log.error("Unable to verify status of url " + URL, e);
            invalidLinksCount++;
        }
        return invalidLinksCount;
    }
}

