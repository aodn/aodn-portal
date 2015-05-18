/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 * This file HtmlUtils.groovy is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package au.org.emii.portal

final class HtmlUtils {

    /**
     * Sourced from the source code of the Spring Framework, licensed under the Apache License, Version 2.0
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

        if (input == null || encoding == null) {
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
