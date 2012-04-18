import au.org.emii.portal.User
import grails.converters.JSON

class BootStrap {

    def init = { servletContext ->
		JSON.registerObjectMarshaller(au.org.emii.portal.Config) { cfg ->
			def result = [:]
			result['name'] = cfg.name
			result['proxy'] = cfg.proxy
			result['proxyPort'] = cfg.proxyPort
			result['catalogUrl'] = cfg.catalogUrl
			// Map behaviour
			result['initialBbox'] = cfg.initialBbox
			result['autoZoom'] = cfg.autoZoom
			
			// Menus
			result['baselayerMenu'] = cfg.baselayerMenu
			result['defaultMenu'] = cfg.defaultMenu
			result['contributorMenu'] = cfg.contributorMenu
			result['regionMenu'] = cfg.regionMenu

			result['footerContent'] = cfg.footerContent
			result['footerContentWidth'] = cfg.footerContentWidth
			
			// Depth service settings
			result['useDepthService'] = cfg.useDepthService
			
			// heights and widths
			result['popupWidth'] = cfg.popupWidth
			result['popupHeight'] = cfg.popupHeight
			result['westWidth'] = cfg.westWidth
			result['headerHeight'] = cfg.headerHeight
			result['footerHeight'] = cfg.footerHeight
			result['activeLayersHeight'] = cfg.activeLayersHeight
			
			result['downloadCartMaxNumFiles'] = cfg.downloadCartMaxNumFiles
			result['downloadCartDownloadableProtocols'] = cfg.downloadCartDownloadableProtocols
			
			result['metadataLinkProtocols'] = cfg.metadataLinkProtocols
			result['metadataLayerProtocols'] = cfg.metadataLayerProtocols
			result['mapGetFeatureInfoBuffer'] = cfg.mapGetFeatureInfoBuffer
			
			return result
		}
		
		JSON.registerObjectMarshaller(User) { user ->
			def result = [:]
			result['id'] = user.id
			result['emailAddress'] = user.emailAddress
			result['firstName'] = user.firstName
			result['lastName'] = user.lastName
			return result
		}
    }
	
    def destroy = {
    }
}
