<%@ page import="au.org.emii.portal.Layer" %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'layer.label', default: 'Layer')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="content scaffold-list">
            <h1><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="dialog">
                <table>
                    <tbody>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.id.label" default="Id" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "id")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.name.label" default="Name" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "name")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.disabled.label" default="Disabled" /></td>
                            
                            <td valign="top" class="value"><g:formatBoolean boolean="${layerInstance?.disabled}" /></td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.source.label" default="Source" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "source")}</td>
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.currentlyActive.label" default="Currently Active" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "currentlyActive")}</td>
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.description.label" default="Description" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "description")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.server.label" default="Server" /></td>
                            
                            <td valign="top" class="value"><g:link controller="server" action="show" id="${layerInstance?.server?.id}">${layerInstance?.server?.encodeAsHTML()}</g:link></td>
                            
                        </tr>
                    
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.cache.label" default="Cache" /></td>
                            
                            <td valign="top" class="value"><g:formatBoolean boolean="${layerInstance?.cache}" /></td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.cql.label" default="Cql" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "cql")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.style.label" default="Style" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "style")}</td>
                            
                        </tr>
                    
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.parent.label" default="Parent" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "parent")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.layers.label" default="Layers" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "layers")}</td>
                            
                        </tr>
                        
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.bbox.label" default="Bounding Box" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "bbox")}</td>
                            
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.metaUrl.label" default="Metadata Url" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: layerInstance, field: "metaUrl")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="layer.queryable.label" default="Queryable" /></td>
                            
                            <td valign="top" class="value"><g:formatBoolean boolean="${layerInstance?.queryable}" /></td>
                            
                        </tr>
                    
                    </tbody>
                </table>
            </div>
            <div class="buttons">
                <g:form>
                    <g:hiddenField name="id" value="${layerInstance?.id}" />
                    <span class="button"><g:actionSubmit class="edit" action="edit" value="${message(code: 'default.button.edit.label', default: 'Edit')}" /></span>
                    <span class="button"><g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" /></span>
                </g:form>
            </div>
        </div>
    </body>
</html>
