
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<div class="list">

    <table>
        <thead>
        <tr>
            <g:sortableColumn property="title" title="${message(code: 'layer.title.label', default: 'Title')}" params="${filters}" />

            <g:sortableColumn property="name" title="${message(code: 'layer.name.label', default: 'Name (WMS ID)')}" params="${filters}" />

            <g:sortableColumn property="namespace" title="${message(code: 'layer.namespace.label', default: 'Namespace')}" params="${filters}" />

            <g:sortableColumn property="server" title="${message(code: 'layer.server.label', default: 'Server')}" params="${filters}" />

            <g:sortableColumn property="dataSource" title="${message(code: 'layer.dataSource.label', default: 'Data Source')}" params="${filters}" />

            <g:sortableColumn property="lastUpdated" title="${message(code: 'layer.lastUpdated.label', default: 'Last updated')}" params="${filters}" />

            <g:sortableColumn property="activeInLastScan" title="${message(code: 'layer.activeInLastScan.label', default: 'Active')}" params="${filters}" />

            <g:sortableColumn property="blacklisted" title="${message(code: 'layer.blacklisted.label', default: 'Blacklisted')}" params="${filters}" />

            <g:sortableColumn property="isBaseLayer" title="${message(code: 'layer.isBaseLayer.label', default: 'Base layer')}" params="${filters}" />

            <g:sortableColumn property="cache" title="${message(code: 'layer.cache.label', default: 'Cache')}" params="${filters}" />

            <g:sortableColumn property="filters" title="${message(code: 'layer.filters.label', default: 'Filters')}" params="${filters}" />
        </tr>
        </thead>
        <tbody>
        <g:each in="${layerInstanceList}" status="i" var="layerInstance">
            <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">

                <td>${ layerInstance.parentId ? "" : "(R) " }<g:link action="edit" id="${layerInstance.id}">${fieldValue(bean: layerInstance, field: "title").trim() ?: "<i>No title</i>"}</g:link></td>

                <td>${fieldValue(bean: layerInstance, field: "name")}</td>

                <td>${fieldValue(bean: layerInstance, field: "namespace")}</td>

                <td>${fieldValue(bean: layerInstance, field: "server")}</td>

                <td>${fieldValue(bean: layerInstance, field: "dataSource")}</td>

                <td><g:if test="${layerInstance.lastUpdated}"><g:formatDate format="dd/MM/yy HH:mm" date="${layerInstance.lastUpdated}"/></g:if></td>

                <td><g:formatBoolean boolean="${layerInstance.activeInLastScan}" /></td>

                <td><g:formatBoolean boolean="${layerInstance.blacklisted}" /></td>

                <td><g:formatBoolean boolean="${layerInstance.isBaseLayer}" /></td>

                <td><g:formatBoolean boolean="${layerInstance.cache}" /></td>

                <td>${layerInstance.filters.size()}</td>
            </tr>
        </g:each>
        </tbody>
    </table>
</div>
<div class="pagination">
    <g:paginate total="${ filteredLayersCount }" params="${params}" />
</div>
