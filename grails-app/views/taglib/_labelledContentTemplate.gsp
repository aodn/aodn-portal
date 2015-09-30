<dt>
    <g:message code="${labelCode}" default="${labelCode}"/>
    <g:message code="label.separator" default=":"/>
</dt>
<dd>
    <g:if test="${href}">
        <a href="${href}">
    </g:if>

            ${content}

    <g:if test="${href}">
        </a>
    </g:if>
</dd>
