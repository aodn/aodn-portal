describe('Portal.cart.BaseInjector', function() {

    var injector;
    var dataCollection;

    beforeEach(function() {
        Portal.app.appConfig.portal.metadataProtocols.metadataRecord = 'metadataRecord';
        Portal.app.appConfig.portal.metadataProtocols.dataFile = 'dataFile';

        injector = new Portal.cart.BaseInjector();

        dataCollection = {
            getUuid: returns(9),
            getLinksByProtocol: function(protocols) {
                if (protocols == 'dataFile') {
                    return 'Downloadable link!';
                }
                else if (protocols == 'metadataRecord') {
                    return 'Metadata record link!'
                }
            },
            getFilters: function() {
                return [];
            }
        };
    });

    describe('getPointOfTruthLinks', function() {

        it('returns point of truth links as appropriate', function() {
            expect(injector._getPointOfTruthLink(dataCollection)).toEqual('Metadata record link!');
        });
    });

    describe('getMetadataLinks', function() {

        it('returns metadata links as appropriate', function() {
            expect(injector._getMetadataLinks(dataCollection)).toEqual('Downloadable link!');
        });
    });
});
