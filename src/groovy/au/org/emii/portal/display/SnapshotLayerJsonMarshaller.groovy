
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.display

import au.org.emii.portal.Snapshot
import au.org.emii.portal.SnapshotLayer
import grails.converters.JSON
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.web.converters.ConverterUtil
import org.codehaus.groovy.grails.web.converters.exceptions.ConverterException
import org.codehaus.groovy.grails.web.converters.marshaller.json.DomainClassMarshaller
import org.codehaus.groovy.grails.web.json.JSONWriter
import org.hibernate.Hibernate
import org.hibernate.collection.AbstractPersistentCollection
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.BeanWrapper
import org.springframework.beans.BeanWrapperImpl

class SnapshotLayerJsonMarshaller extends DomainClassMarshaller {
	
	static Logger log = LoggerFactory.getLogger(SnapshotLayerJsonMarshaller.class)
	
	static SNAPSHOT_LAYER_EXCLUDES = [
		"class",
        "metaClass",
        "metadataUrls",
        "hasMany",
        "handler",
        "belongsTo",
        "layers",
        "parent",
        "hibernateLazyInitializer"
	]
	
	SnapshotLayerJsonMarshaller() {
		super(false)
	}

	@Override
	public boolean supports(Object o) {
		return (ConverterUtil.isDomainClass(o.getClass()) && _isSupportedInstance(o))
	}
	
	@Override
	public void marshalObject(Object value, JSON json) throws ConverterException {
		JSONWriter writer = json.getWriter()

		GrailsDomainClass domainClass = ConverterUtil.getDomainClass(value.getClass().getName())
		BeanWrapper beanWrapper = new BeanWrapperImpl(value)

		writer.object()

		json.property("id", extractValue(value, domainClass.getIdentifier()))

		domainClass.getPersistentProperties().each { property ->
			log.debug("Processing property ${property.getName()}")
			if (_include(value, property.getName())) {
				log.debug("Including property ${property.getName()}")
				writer.key(property.getName())
				if (!property.isAssociation()) {
					// Write non-relation property
					Object val = beanWrapper.getPropertyValue(property.getName())
					json.convertAnother(val)
				}
				else {
					Object referenceObject = beanWrapper.getPropertyValue(property.getName())
					if (referenceObject == null) {
						writer.value(null)
					}
					else {
						referenceObject = _initialise(referenceObject)
						json.convertAnother(referenceObject)
					}
				}
			}
		}
		writer.endObject()
	}
	
	def _isSupportedInstance(o) {
		return _isSnapshot(o) || _isLayer(o)
	}
	
	def _isSnapshot(o) {
		return (o instanceof Snapshot)
	}
	
	def _isLayer(o) {
		return (o instanceof SnapshotLayer)
	}
	
	def _include(o, property) {
		return _isSnapshot(o) || _includeForLayer(o, property)
	}
	
	def _includeForLayer(o, property) {
		return _isLayer(o) && !SNAPSHOT_LAYER_EXCLUDES.contains(property)
	}
	
	def _initialise(referenceObject) {
		def result = referenceObject
		if (result instanceof AbstractPersistentCollection) {
			// Force initialisation and get a non-persistent Collection Type
			AbstractPersistentCollection acol = (AbstractPersistentCollection) result
			acol.forceInitialization()
			if (result instanceof SortedMap) {
				result = new TreeMap((SortedMap) result)
			}
			else if (result instanceof SortedSet) {
				result = new TreeSet((SortedSet) result)
			}
			else if (result instanceof Set) {
				result = new HashSet((Set) result)
			}
			else if (result instanceof Map) {
				result = new HashMap((Map) result)
			}
			else {
				result = new ArrayList((Collection) result)
			}
		}
		else if(!Hibernate.isInitialized(result)) {
			Hibernate.initialize(result)
		}
		return result
	}
}
