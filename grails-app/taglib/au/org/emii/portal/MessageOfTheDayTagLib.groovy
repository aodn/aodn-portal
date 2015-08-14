/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class MessageOfTheDayTagLib {

    def grailsApplication

    static namespace = "portal"

    static final lineSeparator = System.getProperty("line.separator")

    def motdPopup = { attrs, body ->

        def motd = getMotd()

        if (motd) {
            out << """// MOTD
            Ext.onReady(function() {
                Ext.Msg.show({
                    title: "<h2>${motd.title.encodeAsJavaScript()}</h2>",
                    msg: "${motd.msg.encodeAsJavaScript()}",
                    buttons: Ext.Msg.OK,
                    cls: 'motd',
                    width: 600
                });
            });"""
        }
    }

    def toMotdMap(motd) {
        if (motd && motd.size() > 0) {
            def motdLines = motd.split(lineSeparator)

            def motdMap = [:]
            if (motdLines.size() > 1) {
                // First line is the title, rest is the msg
                motdMap.title = motdLines[0]
                motdMap.msg = motdLines[1..-1].join(lineSeparator)
            }
            else {
                motdMap.title = motd
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

        if (grailsApplication.config.portal.motdUrl) {
            try {
                motd = new URL(grailsApplication.config.portal.motdUrl).text
            }
            catch (Exception e) {
                log.debug "Failed getting motd ", e
            }
        }

        return toMotdMap(motd)
    }
}
