/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data');

Portal.data.TermClassification = function() {

    function extractCategories(record, depth, result) {
        var broader = record.attributes['value'].nodeValue;

        Ext.each(record.children, function(n) {
            var name = n.attributes['value'].nodeValue;

            if (!result[name]) {
                result[name] = [];
            }

            result[name].push({ 'broader': broader, 'depth': depth });
            extractCategories(n, depth + 1, result);

            return true;
        }, this.scope);
    }

    function extractDimension(v, record) {
        var result = {};
        var dimension = record.attributes['value'].nodeValue;

        result[dimension] = [{ 'broader': null, 'depth': -1 }];
        extractCategories(record, 0, result);
        return result;
    }

    var constructor = Ext.data.Record.create([
        { name: 'categories', convert: extractDimension }
    ]);

    return constructor;
}();
