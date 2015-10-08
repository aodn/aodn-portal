
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

import grails.util.Environment
import net.sf.json.JSONNull

// Place your Spring DSL code here
beans = {

    hostVerifier(au.org.emii.portal.HostVerifier) { bean ->
        grailsApplication = ref('grailsApplication')
    }

    portalBranding(au.org.emii.portal.PortalBranding) { bean ->
        grailsApplication = ref('grailsApplication')
    }

    grails.converters.JSON.registerObjectMarshaller(JSONNull, { return "" })
}
