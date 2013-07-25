
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.*

class SnapshotLayerTests extends GrailsUnitTestCase {

    static final String VALID_SERVER_URL = "http://www.google.com"
    static final String INVALID_SERVER_URL = "http://localhost:/geoserver/wms"

    static final String VALID_LAYER_NAME = "topp:seabirds"
    static final String VALID_TITLE = "Seabirds"

    Snapshot snapshot
    Layer layer

    protected void setUp() {
        super.setUp()

        snapshot = new Snapshot()
        mockDomain(Snapshot, [snapshot])

        layer = new Layer()
        mockDomain(Layer, [layer])

        mockDomain(SnapshotLayer)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testValidSnapshotLayerUsingLayerReference() {
        SnapshotLayer snapshotLayer = new SnapshotLayer(snapshot: snapshot, layer: layer)
        snapshotLayer.save()

        assertFalse(snapshotLayer.hasErrors())
    }

    void testValidSnapshotLayerUsingServiceReference() {
        SnapshotLayer snapshotLayer = new SnapshotLayer(snapshot: snapshot, serviceUrl: VALID_SERVER_URL, name: VALID_LAYER_NAME, title: VALID_TITLE)
        snapshotLayer.save()

        assertFalse(snapshotLayer.hasErrors())
    }

    void testInvalidServerUrl() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(snapshot: snapshot, serviceUrl: INVALID_SERVER_URL, name: VALID_LAYER_NAME)
        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
        assertEquals("url.invalid", invalidSnapshotLayer.errors.getFieldError("serviceUrl").getCode())
    }

    void testBlankName() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(snapshot: snapshot, serviceUrl: VALID_SERVER_URL, name: "")
        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
        assertEquals("nullable", invalidSnapshotLayer.errors.getFieldError("name").getCode())
    }

    void testNullSnapshot() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer()
        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
        assertEquals("nullable", invalidSnapshotLayer.errors.getFieldError("snapshot").getCode())
    }

    void testNullBaseLayer() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(snapshot: snapshot, layer: layer, isBaseLayer: null)
        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
        assertEquals("nullable", invalidSnapshotLayer.errors.getFieldError("isBaseLayer").getCode())
    }

    void testNullHidden() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(snapshot: snapshot, layer: layer, hidden: null)
        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
        assertEquals("nullable", invalidSnapshotLayer.errors.getFieldError("hidden").getCode())
    }

    void testNullLayerAndService() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(snapshot: snapshot)
        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
        assertEquals("nullable", invalidSnapshotLayer.errors.getFieldError("serviceUrl").getCode())
        assertEquals("nullable", invalidSnapshotLayer.errors.getFieldError("name").getCode())
    }

    void testParameterMaxButNoMin() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(
            snapshot: snapshot,
            layer: layer,
            ncwmsParamMax: 23
        )

        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
    }

    void testParameterMinButNoMax() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(
            snapshot: snapshot,
            layer: layer,
            ncwmsParamMin: 23
        )

        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
    }

    void testParameterMaxAndMin() {
        SnapshotLayer snapshotLayer = new SnapshotLayer(
            snapshot: snapshot,
            layer: layer,
            ncwmsParamMin: 5,
            ncwmsParamMax: 23
        )

        snapshotLayer.save()

        assertFalse(snapshotLayer.hasErrors())
    }

    void testParameterMaxLessThanMin() {
        SnapshotLayer invalidSnapshotLayer = new SnapshotLayer(
            snapshot: snapshot,
            layer: layer,
            ncwmsParamMin: 23,
            ncwmsParamMax: 10
        )

        invalidSnapshotLayer.save()

        assertTrue(invalidSnapshotLayer.hasErrors())
    }

    void testParameterNeitherMaxOrMin() {
        SnapshotLayer snapshotLayer = new SnapshotLayer(snapshot: snapshot, layer: layer)
        snapshotLayer.save()

        assertNull(snapshotLayer.ncwmsParamMin)
        assertNull(snapshotLayer.ncwmsParamMax)
    }
}
