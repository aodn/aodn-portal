/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.config

import au.org.emii.portal.Config
import au.org.emii.portal.User
import au.org.emii.portal.display.PresenterJsonMarshaller
import au.org.emii.portal.display.SnapshotLayerJsonMarshaller
import grails.converters.JSON

class JsonMarshallingRegistrar {

    static final String SNAPSHOT_LAYERS_MARSHALLING_CONFIG = "snapshotlayers"
    static final String MENU_PRESENTER_MARSHALLING_CONFIG = "menupresenter"

    static void registerJsonMarshallers() {
        _registerConfig()
        _registerUser()
        _registerSnapshotLayer()
        _registerMenuPresenters()
    }

    static void _registerConfig() {

        JSON.registerObjectMarshaller(Config) { cfg ->

            def result = [:]
            result['name'] = cfg.name
            result['proxy'] = cfg.proxy
            result['proxyPort'] = cfg.proxyPort
            result['catalogUrl'] = cfg.catalogUrl
            result['searchUsingBboxByDefault'] = cfg.searchUsingBboxByDefault

            // Map behaviour
            result['initialBbox'] = cfg.initialBbox
            result['autoZoom'] = cfg.autoZoom
            result['enableDefaultDatelineZoom'] = cfg.enableDefaultDatelineZoom
            result['defaultDatelineZoomBbox'] = cfg.defaultDatelineZoomBbox

            // Menus
            result['baselayerMenu'] = cfg.baselayerMenu
            result['defaultMenu'] = cfg.defaultMenu
            result['contributorMenu'] = cfg.contributorMenu
            result['regionMenu'] = cfg.regionMenu

            result['footerContent'] = cfg.footerContent
            result['footerContentWidth'] = cfg.footerContentWidth

            // heights and widths
            result['popupWidth'] = cfg.popupWidth
            result['popupHeight'] = cfg.popupHeight
            result['westWidth'] = cfg.westWidth
            result['headerHeight'] = cfg.headerHeight
            result['footerHeight'] = cfg.footerHeight
            result['activeLayersHeight'] = cfg.activeLayersHeight

            result['downloadCartMaxNumFiles'] = cfg.downloadCartMaxNumFiles
            result['downloadCartDownloadableProtocols'] = cfg.downloadCartDownloadableProtocols
            result['downloadCartConfirmationWindowContent'] = cfg.downloadCartConfirmationWindowContent

            result['metadataLinkProtocols'] = cfg.metadataLinkProtocols
            result['metadataLayerProtocols'] = cfg.metadataLayerProtocols
            result['mapGetFeatureInfoBuffer'] = cfg.mapGetFeatureInfoBuffer

            return result
        }
    }

    static void _registerUser() {
        JSON.registerObjectMarshaller(User) { user ->
            def result = [:]
            result['id'] = user.id
            result['emailAddress'] = user.emailAddress
            result['fullName'] = user.fullName
            return result
        }
    }

    static void _registerSnapshotLayer() {
        JSON.createNamedConfig(SNAPSHOT_LAYERS_MARSHALLING_CONFIG) {
            it.registerObjectMarshaller(new SnapshotLayerJsonMarshaller())
        }
    }

    static void _registerMenuPresenters() {
        JSON.createNamedConfig(MENU_PRESENTER_MARSHALLING_CONFIG) {
            it.registerObjectMarshaller(new PresenterJsonMarshaller())
        }
    }
}
