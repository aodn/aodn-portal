/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.data.ElementValuesField', function() {
    describe('convert method', function() {
        it('converts multiple matching elements into an array', function() {
            var xmlDoc  = document.implementation.createDocument('', 'root');
            
            xmlDoc.documentElement
            .appendChild(xmlDoc.createElement('parameter'))
            .appendChild(xmlDoc.createTextNode('parameter 1'));
            
            xmlDoc.documentElement
            .appendChild(xmlDoc.createElement('parameter'))
            .appendChild(xmlDoc.createTextNode('parameter 2'));

            var field = new Portal.data.ElementValuesField({name: 'parameter'});
            
            var result = field.convert(undefined, xmlDoc);
        	
            expect(result[1]).toEqual('parameter 2');
        });
    });

});
