<%--

Copyright 2013 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>
<div class="dialog">
  <span class="hint">Workaround for layers whose bounding box spans the dateline.</span>
  <table>
    <tbody>
      
      <!-- Centre Lat -->
      <tr class="prop">
        <td valign="top" class="name">
          <label for="viewParams.centreLat">Centre Latitude</label>
        </td>
        <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'viewParams?.centreLat', 'errors')}">
          <g:textField name="viewParams.centreLat" maxlength="455" value="${layerInstance?.viewParams?.centreLat}" />
        </td>
      </tr>
      
      <!-- Centre Lon -->
      <tr class="prop">
        <td valign="top" class="name">
          <label for="viewParams.centreLat">Centre Longitude</label>
        </td>
        <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'viewParams?.centreLon', 'errors')}">
          <g:textField name="viewParams.centreLon" maxlength="455" value="${layerInstance?.viewParams?.centreLon}" />
        </td>
      </tr>

      <!-- Zoom Level -->
      <tr class="prop">
        <td valign="top" class="name">
          <label for="viewParams.openLayersZoomLevel">Zoom Level</label>
        </td>
        <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'viewParams?.openLayersZoomLevel', 'errors')}">
          <g:textField name="viewParams.openLayersZoomLevel" maxlength="455" value="${layerInstance?.viewParams?.openLayersZoomLevel}" />
        </td>
      </tr>
      </tbody>
  </table>
</div>
