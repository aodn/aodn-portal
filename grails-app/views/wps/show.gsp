<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
        <g:if test="${grailsApplication.config.portal.localThemeCss}"><link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: grailsApplication.config.portal.localThemeCss)}?v=${resourceVersionNumber}"/></g:if>
        <g:if test="${grailsApplication.config.portal.externalThemeCss}"><link rel="stylesheet" type="text/css" href="${grailsApplication.config.portal.externalThemeCss}?v=${resourceVersionNumber}"/></g:if>
        <title >${job.downloadTitle}</title>
    </head>
    <body>
        <div class="portalheader">
            <div class="container">
                <a class="btn" role="button" href="${createLink(uri: '', absolute: true)}">
                    <img src="${grailsApplication.config.portal.logo}" alt="Portal logo">
                </a>
            </div>
        </div>
        <div class="container">
            <h2><g:message code="job.status" default="WPS download status"/></h2>
            <dl>

                <g:labelledContent labelCode="job.id.label" href="${job.downloadUrl}">${job.uuid}</g:labelledContent>
                <g:labelledContent labelCode="job.createdTimestamp.label" if="${job.createdTimestamp}" >
                    <label id="localTime"></label>
                    <g:javascript>
                       if('${job.createdTimestamp}')
                       {
                            var date = new Date('${job.createdTimestamp}');
                            document.getElementById('localTime').innerHTML = date;
                       }
                    </g:javascript>
                </g:labelledContent>
                <g:labelledContent labelCode="job.status.label">
                  <g:message code="job.status.${job.status}" default="${job.status.toString()}" />
                </g:labelledContent>
                <g:labelledContent if="${job.downloadUrl}" labelCode="job.download.label">
                    <a href="${job.downloadUrl}">${job.downloadTitle}</a>
                </g:labelledContent>
                <g:labelledContent if="${job.errorMessage}" labelCode="job.error.label">
                    ${job.errorMessage}
                </g:labelledContent>
            </dl>
        </div>
        <div class="jumbotronFooter voffset5">
            <div class="container">
                <footer class="row">
                    <div class="col-md-4">
                        <p>If you've found this information useful, see something wrong, or have a suggestion,
                           please let us
                           know.
                           All feedback is very welcome. For help and information about this site
                           please contact <a href="mailto:${grailsApplication.config.portal.contactEmail}">${grailsApplication.config.portal.contactEmail}</a></p>
                    </div>
                    <div class="col-md-8">
                        <p>Use of this web site and information available from it is subject to our <a href="${grailsApplication.config.portal.conditionOfUse}">
                           Conditions of use
                        </a></p>
                    </div>
                </footer>
            </div>
        </div>
    </body>
</html>
