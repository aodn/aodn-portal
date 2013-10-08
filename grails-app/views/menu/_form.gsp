
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="au.org.emii.portal.Menu" %>



<div class="fieldcontain ${hasErrors(bean: menuInstance, field: 'title', 'error')} ">
    <label for="title">
        <g:message code="menu.title.label" default="Title" />
        
    </label>
    <g:textField name="title" value="${menuInstance?.title}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: menuInstance, field: 'active', 'error')} ">
    <label for="active">
        <g:message code="menu.active.label" default="Active" />
        
    </label>
    <g:checkBox name="active" value="${menuInstance?.active}" />
</div>

<div class="fieldcontain ${hasErrors(bean: menuInstance, field: 'editDate', 'error')} required">
    <label for="editDate">
        <g:message code="menu.editDate.label" default="Edit Date" />
        <span class="required-indicator">*</span>
    </label>
    <g:datePicker name="editDate" precision="day" value="${menuInstance?.editDate}"  />
</div>

<div class="fieldcontain ${hasErrors(bean: menuInstance, field: 'json', 'error')} ">
    <label for="json">
        <g:message code="menu.json.label" default="Json" />
        
    </label>
    <g:textField name="json" value="${menuInstance?.json}"/>
</div>

