package au.org.emii.portal

class MessageOfTheDayTagLib {

    def grailsApplication
    def portalBranding

    static namespace = "portal"

    static final lineSeparator = System.getProperty("line.separator")

    def motdPopup = { attrs, body ->

        def motd = getMotd()

        if (motd) {
            out << """// MOTD
            \$(document).ready(function() {
                \$('#motd #motdTitle').html("${motd.title.encodeAsJavaScript()}");
                \$('#motd #motdBody').html("${motd.msg.encodeAsJavaScript()}");
                \$('#motd').modal();
            });"""
        }
    }

    def toMotdMap(motd) {

        if (motd && motd.trim().size() > 0) {
            def motdLines = motd.trim().split(lineSeparator)

            def motdMap = [:]
            if (motdLines.size() > 1) {
                // First line is the title, rest is the msg
                motdMap.title = motdLines[0]
                motdMap.msg = motdLines[1..-1].join(lineSeparator)
            }
            else {
                motdMap.title = "Notice"
                motdMap.msg = motd
            }
            return motdMap
         }
         else {
             return null
         }
    }

    def getMotd() {
        def motd = null

        def motdUrl = portalBranding.getMotdUrl()

        if (motdUrl) {
            try {
                motd = new URL(motdUrl).text
            }
            catch (Exception e) {
                log.debug "Failed getting motd ", e
            }
        }

        return toMotdMap(motd)
    }
}
