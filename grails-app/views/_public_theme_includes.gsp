<g:render template="/core_theme_includes"></g:render>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'general.css')}?v=${resourceVersionNumber}"/>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css/font-awesome-4.3.0/css/', file: 'font-awesome.min.css')}"/>

<g:if test="${grailsApplication.config.portal.localThemeCss}"><link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: grailsApplication.config.portal.localThemeCss)}?v=${resourceVersionNumber}"/></g:if>
<g:if test="${grailsApplication.config.portal.externalThemeCss}"><link rel="stylesheet" type="text/css" href="${grailsApplication.config.portal.externalThemeCss}?v=${resourceVersionNumber}"/></g:if>

<link rel="stylesheet" type="text/css" href="${createLink(controller: 'search', action: 'css')}?v=${new Date().time}"/>

<link href='https://fonts.googleapis.com/css?family=Arimo:400,700' rel='stylesheet' type='text/css'>
<link href='https://fonts.googleapis.com/css?family=Oswald:400,700' rel='stylesheet' type='text/css'>

%{--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/transition.min.css" integrity="sha512-5StPzJo8hFyTvXfJ31FMB37EXRMVeUg+J3yvUNOJcL83MEMr7VrhZSNsoL3GDmUDBGBBhoTjnJx0Ql7cH9LY7g==" crossorigin="anonymous" referrerpolicy="no-referrer" />--}%
%{--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/dimmer.min.css" integrity="sha512-H85EGEZQQ3VchqqRRY5U/ZYCYaCTG//aVoUvH0CMYoDUCN8+l5FN105Td0DheDCdYrtyoYcosPwO3nQ3cjDAhQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />--}%
%{--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/modal.min.css" integrity="sha512-CPLGe+O/BzgzHJKpdBXUuewmlxhlEfQ00zuYg1vcGCjOo88mqMeO1qa8q397ifxm18D12Go8OF7A42CjOKEl/g==" crossorigin="anonymous" referrerpolicy="no-referrer" />--}%
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'auth.css')}"/>