
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<script>
  var select1;
$(document).ready(function () {
    select1 = $('select#showItems1').selectList({
       list: 'ul#pickedItems1',
       instance: true,
       clickRemove: false, // handle remove  in sortable function using the instance var
       template: '<li>%text%<a onclick="select1.remove(\'%value%\');">' +
                      '<span class="ui-icon ui-icon-circle-close"></span></a>' +
                      '<input type=hidden name="defaultLayers" value="%value%" /></li>'
    });
    // now add the previously existing items
        <g:each in="${configInstance.defaultLayers}">
          select1.add('${it.id}');
        </g:each>

    $( "ul#pickedItems1" ).sortable();
});
</script>

