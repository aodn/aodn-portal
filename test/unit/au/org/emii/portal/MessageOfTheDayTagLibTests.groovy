package au.org.emii.portal

import grails.test.TagLibUnitTestCase
import org.codehaus.groovy.grails.plugins.codecs.JavaScriptCodec

class MessageOfTheDayTagLibTests extends TagLibUnitTestCase {

    def testMotd = [
        motdTitle: 'The " <u>Title</u>',
        motd: 'The <b>body</b>, yo " > '
    ]

    void setUp() {

        super.setUp()

        loadCodec JavaScriptCodec

        Config.metaClass.static.activeInstance = { ->
            [motd: testMotd] as Config
        }
    }

    void tearDown() {

        Config.metaClass = null

        super.tearDown()
    }

    void testMotdPopupNoCurrentMotd() {

        Config.metaClass.hasCurrentMotd = { -> false }

        tagLib.motdPopup([/* no attributes */]){ /* no body */ }

        assertEquals "", tagLib.out.toString()
    }

    void testMotdPopupContentUsedAndEncoded() {

        Config.metaClass.hasCurrentMotd = { -> true }

        tagLib.motdPopup([/* no attributes */]){ /* no body */ }

        def result =  tagLib.out.toString()
        assertTrue result.indexOf('<h2>The \\" <u>Title<\\/u></h2>') > -1
        assertTrue result.indexOf('The <b>body<\\/b>, yo \\" > ') > -1
    }
}
