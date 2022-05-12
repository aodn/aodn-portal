Ext.namespace('Portal.data');

Portal.data.TermClassification = function() {

    function extractCategories(record, depth, result, broader) {
        if (typeof broader === 'undefined') {
            broader = record.attributes['value'].value;
        }
        Ext.each(record.children, function(n) {
            var name = n.attributes['value'].value;

            if (!result[name]) {
                result[name] = [];
            }

            result[name].push({ 'broader': broader, 'depth': depth });
            extractCategories(n, depth + 1, result, name);

            return true;
        }, this.scope);
    }

    function extractDimension(v, record) {
        var result = {};

        var dimension = record.attributes['name'].nodeValue;
        result[dimension] = [{ 'broader': null, 'depth': -1 }];
        extractCategories(record,  0, result, dimension);

        return result;
    }

    var constructor = Ext.data.Record.create([
        { name: 'categories', convert: extractDimension }
    ]);

    return constructor;
}();
