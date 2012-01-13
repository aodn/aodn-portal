<%@ page contentType="text/html;charset=UTF-8" %>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="layout" content="main" />
    <title>WMS Scanner Controls</title>
  </head>
  <body>
    <div class="content">
      <h2>WMS Scanner Controls</h2>
      <div>WMS Scanner located @ ${ configInstance.wmsScannerBaseUrl }<br /><br /></div>
      
      <g:if test="${flash.message}">
        <div class="message">${flash.message}</div>
      </g:if>
           
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
                  <th>${message(code: 'server.shortAcron.label', default: 'Short Acron')}</th>
                  <th>${message(code: 'server.type.label', default: 'Type')}</th>
                  <th>${message(code: 'server.uri.label', default: 'Uri')}</th>
                  <th>${message(code: 'server.disable.label', default: 'Disable')}</th>
                  <th>${message(code: 'server.allowDiscoveries.label', default: 'Allow Discoveries')}</th>
                  <th></th>
                </tr>
            </thead>
            <tbody>
            <g:each in="${serversToList}" status="i" var="serverInstance">
                <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                    <td>${fieldValue(bean: serverInstance, field: "name")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "shortAcron")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "type")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "uri")}</td>
                    <td><g:formatBoolean boolean="${serverInstance.disable}" /></td>
                    <td><g:formatBoolean boolean="${serverInstance.allowDiscoveries}" /></td>
                    <td><g:link action="callRegister" id="${serverInstance.id}">${message(code: 'server.createScanJob.label', default: 'Create Scan Job')}</g:link></td>
                </tr>
            </g:each>
            </tbody>
        </table>
      </div>
    </div>
  </body>
</html>