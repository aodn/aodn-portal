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
            Portal.data.TopTermStoreStoreOrder.SORT_ORDER = {
                'Some facet': {
                    'ccc': 1,
                    'aaa': 2
                }
            };
    
            topTermStore = new Portal.data.TopTermStore({
                limitTo: 2,
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
                new TopTermRecord({ value: 'aaa', count: 5, display: 'aaa' }),
                new TopTermRecord({ value: 'ccc', count: 3, display: 'ccc' })
            ]);
        });

        describe('when limiting display to top terms', function() {
    
            it('sets default sortOrder', function() {
                topTermStore._applyLimitDisplaySortOrder();
    
                expect(topTermStore.getCount()).toEqual(3);
                expect(topTermStore.getAt(0).get('sortOrder')).toEqual(1);
                expect(topTermStore.getAt(1).get('sortOrder')).toEqual(2);
                expect(topTermStore.getAt(2).get('sortOrder')).toEqual(Portal.data.TopTermStoreStoreOrder.MAX_SORT_ORDER);
            });
    
            it('limits based on sort order, sorted in display order', function() {
                topTermStore.setShowAll(true);
                topTermStore.setShowAll(false);
    
                expect(topTermStore.getAt(0).get('value')).toEqual('aaa');
                expect(topTermStore.getAt(1).get('value')).toEqual('ccc');
            });
        });
        
        describe('when all terms displayed', function() {
                
            it('sorts based on display value', function() {
                topTermStore.showAll = true;
                topTermStore._applyFilters();
    
                expect(topTermStore.getAt(0).get('value')).toEqual('aaa');
                expect(topTermStore.getAt(1).get('value')).toEqual('bbb');
                expect(topTermStore.getAt(2).get('value')).toEqual('ccc');
            });
            
        });
    });
});
