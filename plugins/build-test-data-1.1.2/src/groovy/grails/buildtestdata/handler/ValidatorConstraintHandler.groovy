package grails.buildtestdata.handler

import grails.buildtestdata.MockErrors
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.validation.Constraint
import org.codehaus.groovy.grails.validation.ConstrainedProperty

public class ValidatorConstraintHandler implements ConstraintHandler {
    public void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        // validate isn't supported, if the value we've got in there isn't valid by this point, throw an error letting
        // the user know why we're not passing
        if ( !constrainedProperty?.validate(domain, domain."$propertyName", new MockErrors(this)) ) {
            String error = "Validator constraint support not implemented in build-test-data, attempted value (${domain."$propertyName"}) does not pass validation: property $propertyName of ${domain.class.name}"
            throw new ConstraintHandlerException(error)
        }
    }

}
