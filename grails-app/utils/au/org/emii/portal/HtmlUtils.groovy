/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.spockframework.util.Assert

final class HtmlUtils {

    /**
     * Taken from Spring source code
     * https://github.com/spring-projects/spring-framework/blob/bccd59e6c8845c6521d3b325bea89bcbcbe4d833/spring-web/src/main/java/org/springframework/web/util/HtmlUtils.java#L82
     */

    /**
     * Turn special characters into HTML character references.
     * Handles complete character set defined in HTML 4.01 recommendation.
     * <p>Escapes all special characters to their corresponding
     * entity reference (e.g. {@code &lt;}) at least as required by the
     * specified encoding. In other words, if a special character does
     * not have to be escaped for the given encoding, it may not be.
     * <p>Reference:
     * <a href="http://www.w3.org/TR/html4/sgml/entities.html">
     * http://www.w3.org/TR/html4/sgml/entities.html
     * </a>
     * @param input the (unescaped) input string
     * @param encoding The name of a supported {@link java.nio.charset.Charset charset}
     * @return the escaped string
     * @since 4.1.2
     */
    public static String htmlEscape(String input, String encoding) {
        def characterEntityReferences = new HtmlCharacterEntityReferences();
        Assert.notNull(encoding, "Encoding is required");
        if (input == null) {
            return null;
        }
        StringBuilder escaped = new StringBuilder(input.length() * 2);
        for (int i = 0; i < input.length(); i++) {
            char character = input.charAt(i);
            String reference = characterEntityReferences.convertToReference(character, encoding);
            if (reference != null) {
                escaped.append(reference);
            } else {
                escaped.append(character);
            }
        }
        return escaped.toString();
    }
}
