package au.org.emii.portal.utils;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

public class SeleniumUtil {

    private static Logger log = Logger.getLogger(SeleniumUtil.class.getName());
    private WebDriver driver;

    public SeleniumUtil(WebDriver driver) {
        this.driver = driver;
    }

    //Find Broken / Invalid Images on a Page
    public int validateInvalidImages() {
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
    public int validateInvalidLinks() {

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

    public int verifyURLStatus(String URL, int invalidLinksCount) {
        log.info("Validating URL " + URL);
        //Validating the contact us email
        if (URL.startsWith("mailto:info@aodn.org.au?subject=")) {
            return invalidLinksCount;
        }
        try {

            HttpGet request = new HttpGet(URL);
            HttpResponse response = getHttpclient().execute(request);
            // verifying response code and The HttpStatus should be 200 if not,
            // increment invalid link count
            ////We can also check for 404 status code like response.getStatusLine().getStatusCode() == 404
            if (response.getStatusLine().getStatusCode() != 200) {
                invalidLinksCount++;
                log.error("Invalid URL " + URL);
            }

        } catch (Exception e) {
            log.error("Unable to verify status of url " + URL, e);
            invalidLinksCount++;
        }
        return invalidLinksCount;
    }

    private CloseableHttpClient getHttpclient() throws KeyManagementException, NoSuchAlgorithmException {
        // Create a context that doesn't check certificates.
        SSLContext sslContext = SSLContext.getInstance("TLS");
        TrustManager[ ] trust_mgr = get_trust_mgr();
        sslContext.init(null,                // key manager
                trust_mgr,           // trust manager
                new SecureRandom()); // random number generator

        SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext);
        CloseableHttpClient client = HttpClientBuilder.create().setSSLSocketFactory(sslsf).build();
        return client;
    }

    private TrustManager[ ] get_trust_mgr() {
        TrustManager[ ] certs = new TrustManager[ ] {
                new X509TrustManager() {
                    public X509Certificate[ ] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(X509Certificate[ ] certs, String t) { }
                    public void checkServerTrusted(X509Certificate[ ] certs, String t) { }
                }
        };
        return certs;
    }
}

