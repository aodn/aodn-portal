/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

final class HtmlCharacterEntityReferences {

    /**
     * Taken from Spring source code
     * https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/util/HtmlCharacterEntityReferences.java#L132
     */

    /**
     * Return the reference mapped to the given character or {@code null}.
     * @since 4.1.2
     */
    public String convertToReference(char character, String encoding) {
        if (encoding.startsWith("UTF")){
            switch (character){
                case '<':
                    return "&lt;";
                case '>':
                    return "&gt;";
                case '"':
                    return "&quot;";
                case '&':
                    return "&amp;";
                case '\'':
                    return "&#39;";
            }
        }
        else if (character < 1000 || (character >= 8000 && character < 10000)) {
            int index = (character < 1000 ? character : character - 7000);
            String entityReference = this.characterToEntityReferenceMap[index];
            if (entityReference != null) {
                return entityReference;
            }
        }
        return null;
    }
}
