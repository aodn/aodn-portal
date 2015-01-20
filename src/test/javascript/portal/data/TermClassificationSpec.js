/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.data.TermClassificationStore', function() {

    describe('decode xml', function() {

        var classificationStore;

        beforeEach(function() {

            var recordsAsXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
              <response from=\"1\" to=\"100\" selected=\"0\"> \
                <summary count=\"100\" type=\"local\"> \
                  <dimension value=\"Measured parameter\" count=\"92\"> \
                    <category value=\"Physical-Water\" count=\"71\"> \
                      <category value=\"Temperature\" count=\"50\"> \
                        <category value=\"Temperature of the water body\" count=\"41\" /> \
                      </category> \
                    </category> \
                  </dimension> \
                </summary> \
              </response> \
            ";

            var doc = new DOMParser().parseFromString(recordsAsXml, 'text/xml');
            classificationStore = new Portal.data.TermClassificationStore();
            classificationStore.loadData(doc);
        });


        it('correctly decodes parameters', function() {
            var categories = classificationStore.data.items[0].data.categories;
            expect(categories['Physical-Water'][0].broader).toEqual('Measured parameter');
            expect(categories['Temperature'][0].broader).toEqual('Physical-Water');
            expect(categories['Temperature of the water body'][0].broader).toEqual('Temperature');
        });

        it('correctly decodes parameter depth', function() {
            var categories = classificationStore.data.items[0].data.categories;
            expect(categories['Physical-Water'][0].depth).toEqual(0);
            expect(categories['Temperature'][0].depth).toEqual(1);
            expect(categories['Temperature of the water body'][0].depth).toEqual(2);
        });

        it('lookup accessor works', function() {
            expect(classificationStore.getBroaderTerms( 'Temperature of the water body', 0, 'Measured parameter' )[0]).toEqual('Measured parameter' );
            expect(classificationStore.getBroaderTerms( 'Temperature of the water body', 1, 'Measured parameter' )[0]).toEqual('Physical-Water' );
            expect(classificationStore.getBroaderTerms( 'Temperature of the water body', 2, 'Measured parameter' )[0]).toEqual('Temperature' );
        });
    });
});
