/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext4.namespace('Portal.data');

Portal.data.TermClassification = function() {

    function extractCategories(record, depth, result) {
        var broader = record.attributes['value'].value;

        Ext4.each(record.children, function(n) {
            var name = n.attributes['value'].value;

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
        var dimension = record.attributes['value'].value;

        result[dimension] = [{ 'broader': null, 'depth': -1 }];
        extractCategories(record, 0, result);
        return result;
    }

    var constructor = Ext.data.Record.create([
        { name: 'categories', convert: extractDimension }
    ]);

    return constructor;
}();
