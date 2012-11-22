
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.display

import grails.converters.JSON
import org.codehaus.groovy.grails.web.converters.exceptions.ConverterException
import org.codehaus.groovy.grails.web.converters.marshaller.json.GroovyBeanMarshaller
import org.codehaus.groovy.grails.web.json.JSONWriter
import org.springframework.beans.BeanUtils

import java.lang.reflect.Modifier

class PresenterJsonMarshaller extends GroovyBeanMarshaller {

	static PRESENTER_JSON_EXCLUDES = [
		"class",
		"metaClass",
		"itemFilter",
		"serverIds"
	]

	@Override
	public boolean supports(Object object) {
		return object instanceof MenuItemPresenter || object instanceof MenuPresenter
	}

	@Override
	public void marshalObject(Object o, JSON json) throws ConverterException {
		JSONWriter writer = json.getWriter()
		try {
			writer.object()
			BeanUtils.getPropertyDescriptors(o.getClass()).each { property ->
				def name = property.getName()
				def readMethod = property.getReadMethod()
				if (readMethod != null && !PRESENTER_JSON_EXCLUDES.contains(name)) {
					def value = readMethod.invoke(o, (Object[]) null)
					writer.key(name)
					json.convertAnother(value)
				}
			}
			o.getClass().getDeclaredFields().each { field ->
				def modifiers = field.getModifiers()
				if (Modifier.isPublic(modifiers) && !(Modifier.isStatic(modifiers) || Modifier.isTransient(modifiers))) {
					writer.key(field.getName())
					json.convertAnother(field.get(o))
				}
			}
			writer.endObject()
		}
		catch (ConverterException ce) {
			throw ce
		}
		catch (Exception e) {
			throw new ConverterException("Error converting Bean with class " + o.getClass().getName(), e)
		}
	}
}
