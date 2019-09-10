Ext.namespace('Portal.data');

Portal.data.TermClassification = function() {

    function extractCategories(record, broader, depth, result) {
        // var broader = record.attributes['label'].value;
        Ext.each(record.children, function(n) {
            var name = n.attributes['value'].value;

            if (!result[name]) {
                result[name] = [];
            }

            result[name].push({ 'broader': broader, 'depth': depth });
            extractCategories(n, name,depth + 1, result);

            return true;
        }, this.scope);
    }

    function extractDimension(v, record) {
        var result = {};
        var dimension = record.attributes['name'].nodeValue;

        result[dimension] = [{ 'broader': null, 'depth': -1 }];
        extractCategories(record, dimension, 0, result);
        return result;
    }

    var constructor = Ext.data.Record.create([
        { name: 'categories', convert: extractDimension }
    ]);

    return constructor;
}();
