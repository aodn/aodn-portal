/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.data.TopTermStore", function() {
    describe('sort order', function() {

        var topTermStore;

        beforeEach(function() {
            topTermStore = new Portal.data.TopTermStore({
                titleText: 'Some facet'
            });

            var TopTermRecord = Ext.data.Record.create([
                'value',
                'count',
                'display',
                'sortOrder'
            ]);

            topTermStore.add([
                new TopTermRecord({ value: 'bbb', count: 10, display: 'bbb' }),
                new TopTermRecord({ value: 'aaa', count: 5, display: 'bbb' }),
                new TopTermRecord({ value: 'ccc', count: 3, display: 'ccc' })
            ]);
        });

        it('sets default sortOrder', function() {
            topTermStore._applySortOrder();

            expect(topTermStore.getCount()).toEqual(3);
            topTermStore.each(function(record) {
                expect(record.get('sortOrder')).toEqual(Portal.data.TopTermStoreStoreOrder.MAX_SORT_ORDER);
            });
        });

        it('sorts based on sortOrder', function() {
            Portal.data.TopTermStoreStoreOrder.SORT_ORDER = {
                'Some facet': {
                    'ccc': 1,
                    'aaa': 2
                }
            };

            topTermStore._applySortOrder();

            expect(topTermStore.getAt(0).get('value')).toEqual('ccc');
            expect(topTermStore.getAt(1).get('value')).toEqual('aaa');
            expect(topTermStore.getAt(2).get('value')).toEqual('bbb');
        });
    });
});
