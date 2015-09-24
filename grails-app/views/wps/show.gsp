<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
        <link rel="stylesheet" href="${resource(dir: 'css', file: 'imosTheme.css')}" type="text/css">
    </head>
    <body>
        <div class="imosHeader">
            <div class="container">
                <a class="btn" role="button" href="https://imos.aodn.org.au/imos123/home">
                    <img src="https://static.emii.org.au/images/logo/IMOS-Ocean-Portal-logo.png" alt="IMOS logo">
                </a>
            </div>
        </div>
        <div class="container">
            <h2><g:message code="job.status" default="WPS Status"/></h2>
            <dl>
                <g:labelledContent labelCode="job.id.label">${job.uuid}</g:labelledContent>
                <g:labelledContent labelCode="job.createdTimestamp.label"><joda:format value="${job.createdTimestamp}" /></g:labelledContent>
                <g:labelledContent labelCode="job.status.label">
                  <g:message code="job.status.${job.status}" default="${job.status.toString()}" />
                </g:labelledContent>

                <g:labelledContent if="${job.downloadUrl}" labelCode="job.download.label">
                    <a href="${job.downloadUrl}">${job.downloadTitle}</a>
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
                           please contact <a href="mailt:info@emii.org.au">info@emii.org.au</a></p>
                    </div>
                    <div class="col-md-8">
                        <p>Use of this web site and information available from it is subject to our <a href="http://imos.org.au/imostermsofuse0.html">
                           Conditions of use
                        </a></p>
                        <p>© 2015 IMOS</p>
                    </div>
                </footer>
            </div>
        </div>
    </body>
</html>
