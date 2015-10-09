Ext.namespace('Portal.data');

/*
 * Creates a field object with a convert function that returns all matching
 * child elements as an array
 *
 */

Portal.data.ChildElementsField = Ext.extend(Ext.data.Field, {

    convert: function(v, record) {
        var values = [];

        Ext.each(Ext.DomQuery.jsSelect(this.name, record), function(element) {
            values.push(element.firstChild.nodeValue);
        });

        return values;
    }
});

