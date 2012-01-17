<%@ page contentType="text/html;charset=UTF-8" %>

<html>
  <head>
    <meta name="layout" content="main">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="layout" content="main" />
    <meta http-equiv="refresh" content="300">
    
		<g:set var="entityName" value="${message(code: 'wmsScanner.label', default: 'WMS Scanner')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>  
  </head>
  <body>
  	<div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div id="list-menu" class="list" role="main">
                
                <g:if test="${flash.message}">
                    <div class="message" role="status">${flash.message}</div>

                </g:if>
            <div id="ajaxStatus" class="message" style="display:none" ></div>
            
            
    <div class="content">
      <h2>WMS Scanner Controls</h2>
      <div>WMS Scanner located @ <a href="${ configInstance.wmsScannerBaseUrl }" target="_blank">${ configInstance.wmsScannerBaseUrl }</a><br /><br /></div>
      

           
      <h3>Current scan jobs (${scanJobList?.size()})</h3>
      <g:if test="${scanJobList != '[]'}">
        <div class="list">
          <table>
              <thead>
                <tr>
                  <th>${message(code: 'scanJob.name.label', default: 'Name')}</th> 
                  <th>${message(code: 'scanJob.status.label', default: 'Status')}</th>
                  <th>Errors</th>
                  <th>${message(code: 'scanJob.jobType.label', default: 'Type')}</th>
                  <th>${message(code: 'scanJob.version.label', default: 'Version')}</th>
                  <th>${message(code: 'scanJob.uri.label', default: 'URI')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              <g:each in="${scanJobList}" status="i" var="scanJobInstance">
                <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                  <td>${scanJobInstance.name}</td>
                  <td>${ statusText[scanJobInstance.status] }</td>
                  <td>${message(code: 'scanJob.numErrors.label', default: '# errors')}: ${ scanJobInstance.numErrors }
                      <g:if test="${ scanJobInstance.numErrors != 0 }"><br />${message(code: 'scanJob.lastError.label', default: 'Last error')}: ${ scanJobInstance.lastError }</g:if></td>
                  <td>${scanJobInstance.jobType}</td>
                  <td>${scanJobInstance.wmsVersion}</td>
                  <td>${scanJobInstance.uri}</td>
                  <td><g:link action="callDeleteById" id="${scanJobInstance.id}">${message(code: 'scanJob.delete.label', default: 'Delete')}</g:link></td>
                </tr>
              </g:each>
              </tbody>
          </table>
        </div>
      </g:if>
      <br />
      <br />
      <h3>Applicable Servers (${serversToList?.size()})</h3>
      <div class="list">
        <table>
            <thead>
                <tr>
                  <th>${message(code: 'server.name.label', default: 'Name')}</th>  
                  <th>${message(code: 'server.type.label', default: 'Type')}</th>
                  <th>${message(code: 'server.uri.label', default: 'Uri')}</th>
                  <th>${message(code: 'server.parseFrequency.label', default: 'Scan Frequency')}</th>
                  <th>${message(code: 'server.parseDate.label', default: 'Last scan date')}</th>
                  <th></th>
                </tr>
            </thead>
            <tbody>
            <g:each in="${serversToList}" status="i" var="serverInstance">
                <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                    <td><g:link controller="server" action="show" id="${serverInstance.id}">${fieldValue(bean: serverInstance, field: "name")}</g:link></td>
                    <td>${fieldValue(bean: serverInstance, field: "type")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "uri")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "parseFrequency")} min</td>
                    <td><g:if test="${serverInstance.parseDate}"><g:formatDate format="dd/MM/yy HH:mm" date="${fieldValue(bean: serverInstance, field: "parseDate")}"/></g:if></td>
                    <td><g:link action="callRegister" id="${serverInstance.id}">${message(code: 'server.createScanJob.label', default: 'Create Scan Job')}</g:link></td>
                </tr>
            </g:each>
            </tbody>
        </table>
      </div>
    </div>
    </div>
  </body>
</html>