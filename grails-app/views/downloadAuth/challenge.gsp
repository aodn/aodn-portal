<% now = new Date() %>
<div>
    <img src="${createLink(controller: 'simpleCaptcha', action: 'captcha')}?${now.getTime()}"/>
</div>
