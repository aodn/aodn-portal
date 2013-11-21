
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<tr class="prop">
    <td valign="top" class="name">
        <label for="uri"><g:message code="server.uri.label" default="Uri" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'uri', 'errors')}">
        <g:textField name="uri" value="${serverInstance?.uri}" />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="shortAcron"><g:message code="server.shortAcron.label" default="Short Acron" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'shortAcron', 'errors')}">
        <g:textField name="shortAcron" maxlength="16" value="${serverInstance?.shortAcron}" />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="type"><g:message code="server.type.label" default="Type" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'type', 'errors')}">
        <g:select name="type" from="${serverInstance.constraints.type.inList}" value="${serverInstance?.type}" valueMessagePrefix="server.type"  /><font class="hint" >Changing the server version without reloading layers, will result in BBOX being incorrect</font>
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="name"><g:message code="server.name.label" default="Name" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'name', 'errors')}">
        <g:textField name="name" value="${serverInstance?.name}" />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="disable"><g:message code="server.disable.label" default="Disable" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'disable', 'errors')}">
        <g:checkBox name="disable" value="${serverInstance?.disable}" />
    </td>
</tr>
<tr class="prop">
    <td valign="top" class="name">
        <label for="allowDiscoveries"><g:message code="server.allowDiscoveries.label" default="Allow Discoveries" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'allowDiscoveries', 'errors')}">

        <g:checkBox name="allowDiscoveries" value="${serverInstance?.allowDiscoveries}" /> <font class="hint" >Hide from menus. Layers are still discovered and added to database</font>
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="opacity"><g:message code="server.opacity.label" default="Opacity" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean:serverInstance, field: 'opacity', 'errors')}">
        <g:select name="opacity" from="${[30,50,75,100]}" value="${serverInstance?.opacity ?: 100}"  />
    </td>
</tr>


<tr class="prop">
    <td valign="top" class="name">
        <label for="imageFormat"><g:message code="server.imageFormat.label" default="Image Format" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'imageFormat', 'errors')}">
        <g:select name="imageFormat" from="${serverInstance.constraints.imageFormat.inList}" value="${serverInstance?.imageFormat}" valueMessagePrefix="server.imageFormat"  />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="infoFormat"><g:message code="server.infoFormat.label" default="getFeatureInfo request Format" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'infoFormat', 'errors')}">
        <g:select name="infoFormat" from="${serverInstance.constraints.infoFormat.inList}" value="${serverInstance?.infoFormat}" valueMessagePrefix="server.infoFormat"  />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="comments"><g:message code="server.comments.label" default="Comments" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'comments', 'errors')}">
        <g:textField name="comments" value="${serverInstance?.comments}" />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="scanFrequency"><g:message code="server.scanFrequency.label" default="Scan Frequency" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'scanFrequency', 'errors')}">
        <g:textField name="scanFrequency" value="${serverInstance?.scanFrequency}" /><font class="hint">in minutes</font>
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="username"><g:message code="server.username.label" default="Username for protected server" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'username', 'errors')}">
        <g:textField name="username" value="${serverInstance?.username}" />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="password"><g:message code="server.password.label" default="Password for protected server" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'password', 'errors')}">
        <g:textField name="password" value="${serverInstance?.password}" />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="owners"><g:message code="server.password.label" default="Set server owner" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'owners', 'errors')}">
        <g:select name="owners"
                  from="${allOwners}"
                  value="${serverInstance?.owners}"
                  optionKey="id"
                  multiple="true" />
    </td>
</tr>

<tr class="prop"><td valign="top" class="name" colspan="2">&nbsp;</td></tr>

<tr class="prop">
    <th valign="top" class="name" colspan="2">
        URL List Download
    </th>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="urlListDownloadPrefixToRemove"><g:message code="layer.urlListDownloadPrefixToRemove.label" default="URL list download prefix to remove" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'urlListDownloadPrefixToRemove', 'errors')}">
        <g:textField name="urlListDownloadPrefixToRemove" value="${serverInstance?.urlListDownloadPrefixToRemove}" />
    </td>
</tr>

<tr class="prop">
    <td valign="top" class="name">
        <label for="urlListDownloadPrefixToSubstitue"><g:message code="layer.urlListDownloadPrefixToSubstitue.label" default="URL list download prefix to substitute in" /></label>
    </td>
    <td valign="top" class="value ${hasErrors(bean: serverInstance, field: 'urlListDownloadPrefixToSubstitue', 'errors')}">
        <g:textField name="urlListDownloadPrefixToSubstitue" value="${serverInstance?.urlListDownloadPrefixToSubstitue}" />
    </td>
</tr>
