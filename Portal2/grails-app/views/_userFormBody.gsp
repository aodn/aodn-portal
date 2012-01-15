<div class="auth">
  <table >
      <tbody>
          <tr class="prop">
              <td valign="top" class="name">
                  <label for="emailAddress"><g:message code="user.emailAddress.label" default="Email Address" /></label>
                  <span class="required-indicator">*</span>
              </td>
              <td valign="top"  align="right" class="value ${hasErrors(bean: userAccountCmd, field: 'emailAddress', 'errors')}">
                  <g:textField name="emailAddress" value="${userAccountCmd?.emailAddress}" /><g:if test="${!userAccountCmd?.passwordRequired}"><br /><span class="authentication-hints">Changing your password will cause you to be logged-out.</span></g:if>
                  <g:hiddenField name="previousEmailAddress" value="${userAccountCmd?.previousEmailAddress}" />
              </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="firstName"><g:message code="user.firstName.label" default="First Name" /></label>
                <span class="required-indicator">*</span>
            </td>
            <td valign="top"  align="right" class="value ${hasErrors(bean: userAccountCmd, field: 'firstName', 'errors')}">
                <g:textField name="firstName" value="${userAccountCmd?.firstName}" />
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="lastName"><g:message code="user.lastName.label" default="Last Name" /></label>
                <span class="required-indicator">*</span>      
            </td>
            <td valign="top"  align="right" class="value ${hasErrors(bean: userAccountCmd, field: 'lastName', 'errors')}">
                <g:textField name="lastName" value="${userAccountCmd?.lastName}" />
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="password"><g:message code="user.password.label" default="Password" /></label>
                <g:if test="${userAccountCmd?.passwordRequired}"><span class="required-indicator">*</span></g:if>
            </td>
            <td valign="top"  align="right"  class="value ${hasErrors(bean: userAccountCmd, field: 'password', 'errors')}">
              <g:passwordField name="password" value="${userAccountCmd?.password}" /><g:if test="${!userAccountCmd?.passwordRequired}"><br /><span class="authentication-hints">Leave blank to keep existing password.</span></g:if>
              <g:hiddenField name="passwordRequired" value="${userAccountCmd?.passwordRequired}" />
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="passwordConfirmation"><g:message code="user.password.label" default="Confirm Password" /></label>
                <g:if test="${userAccountCmd?.passwordRequired}"><span class="required-indicator">*</span></g:if>
            </td>
            <td valign="top"  align="right" class="value ${hasErrors(bean: userAccountCmd, field: 'passwordConfirmation', 'errors')}">
                <g:passwordField name="passwordConfirmation" />
            </td>
          </tr>

          <tr class="prop">
            <td colspan="2">
                &nbsp;
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="address"><g:message code="user.address.label" default="Address" /></label>
            </td>
            <td valign="top"  align="right" class="value ${hasErrors(bean: userAccountCmd, field: 'address', 'errors')}">
                <g:textField name="address" value="${userAccountCmd?.address}" />
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="state"><g:message code="user.state.label" default="State" /></label>
            </td>
            <td valign="top"  align="right" class="value ${hasErrors(bean: userAccountCmd, field: 'state', 'errors')}">
                <g:textField name="state" value="${userAccountCmd?.state}" />
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="postcode"><g:message code="user.postcode.label" default="Postcode" /></label>
            </td>
            <td valign="top"  align="right" class="value ${hasErrors(bean: userAccountCmd, field: 'postcode', 'errors')}">
                <g:textField name="postcode" value="${userAccountCmd?.postcode}" />
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="country"><g:message code="user.country.label" default="Country" /></label>
            </td>
            <td valign="top"  align="right"  class="value ${hasErrors(bean: userAccountCmd, field: 'country', 'errors')}">
                <g:textField name="country" value="${userAccountCmd?.country}" />
            </td>
          </tr>

          <tr class="prop">
            <td colspan="2">
                &nbsp;
            </td>
          </tr>

          <tr class="prop">
            <td valign="top" class="name">
                <label for="organisation"><g:message code="user.organisation.label" default="Organisation" /></label>
            </td>
            <td valign="top"  align="right"  class="value ${hasErrors(bean: userAccountCmd, field: 'organisation', 'errors')}">
                <g:textField name="organisation" value="${userAccountCmd?.organisation}" />
            </td>
          </tr>

          <tr class="prop">
              <td valign="top" class="name">
                <label for="orgType"><g:message code="user.orgType.label" default="Organisation Type" /></label>
              </td>
              <td valign="top"  align="right"  class="value ${hasErrors(bean: userAccountCmd, field: 'orgType', 'errors')}">
                  <g:select name="orgType.id" from="${au.org.emii.portal.OrganisationType.list()}" optionKey="id" value="${userAccountCmd?.orgType?.id}" noSelection="['null': '']" />
              </td>
          </tr>
          <tr class="prop">
              <td valign="top" class="name">
                &nbsp;                
              </td>
              <td valign="top" align="right" >
                 <div class="buttons">
                    <span class="button"><input type="button" name="cancel" value="Cancel" onClick="window.location='${createLinkTo(dir:'/')}'" /></span>
                    <span class="button"><g:submitButton name="action" class="save" value="${actionButtonLabel}" /></span>
                </div>
              </td>
          </tr>
        </tbody>
    </table>
</div>