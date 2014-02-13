/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class MessageOfTheDayTagLib {

    static namespace = "portal"

    def motdPopup = { attrs, body ->

        def cfg = Config.activeInstance()

        if (cfg.hasCurrentMotd()) {
            out << """// MOTD
            Ext.onReady(function() {
                Ext.Msg.show({
                    title: "<h2>${cfg.motd.motdTitle.encodeAsJavaScript()}</h2>",
                    msg: "${cfg.motd.motd.encodeAsJavaScript()}",
                    buttons: Ext.Msg.OK,
                    cls: 'motd',
                    width: 600
                });
            });"""
        }
    }
}
