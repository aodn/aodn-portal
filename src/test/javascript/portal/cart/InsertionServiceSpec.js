describe('Portal.cart.InsertionService', function() {

    var mockInsertionService;
    var dataCollection;

    beforeEach(function() {
        mockInsertionService = new Portal.cart.InsertionService();

        dataCollection = {
            title: 'the title',
            uuid: '42',
            isAla: returns(false)
        };
    });

    describe('insertionValues', function() {

        var mockInjector;

        beforeEach(function() {

            mockInjector = {
                getInjectionJson: jasmine.createSpy('getInjectionJson')
            };

            spyOn(Portal.cart, 'NcWmsInjector').andReturn(mockInjector);
            spyOn(Portal.cart, 'WmsInjector').andReturn(mockInjector);
            spyOn(Portal.cart, 'NoDataInjector').andReturn(mockInjector);
        });

        it('creates an ncwms injector for ncwms layers', function() {
            spyOn(Portal.cart.DownloadHandler, 'handlersForDataCollection').andReturn([{}]);

            mockInsertionService.insertionValues(getNcwmsRecord());
            expectGetInjectorToHaveBeenCalled(Portal.cart.NcWmsInjector);
        });

        it('creates a wms injector for wms layers', function() {
            spyOn(Portal.cart.DownloadHandler, 'handlersForDataCollection').andReturn([{}]);

            mockInsertionService.insertionValues(getWmsRecord());
            expectGetInjectorToHaveBeenCalled(Portal.cart.WmsInjector);
        });

        it('creates a no data injector for layers containing no data', function() {
            spyOn(Portal.cart.DownloadHandler, 'handlersForDataCollection').andReturn([]);

            mockInsertionService.insertionValues(getNoDataRecord());
            expectGetInjectorToHaveBeenCalled(Portal.cart.NoDataInjector);
        });

        afterEach(function() {
            expect(mockInjector.getInjectionJson).toHaveBeenCalled();
        });
    });

    describe('download confirmation', function() {
        it('delegates to the download panel for confirmation', function() {
            mockInsertionService.downloadPanel = {
                confirmDownload: noOp
            };
            spyOn(mockInsertionService.downloadPanel, 'confirmDownload');

            var collection = {};
            var callback = noOp;
            var params = {};

            mockInsertionService.downloadWithConfirmation(collection, this, callback, params);

            expect(mockInsertionService.downloadPanel.confirmDownload).toHaveBeenCalledWith(
                collection, this, callback, params
            );
        });
    });

    function expectGetInjectorToHaveBeenCalled(injectorConstructor) {

        var injectorConstructors = [
            Portal.cart.NcWmsInjector,
            Portal.cart.WmsInjector,
            Portal.cart.NoDataInjector
        ];

        expect(injectorConstructor).toHaveBeenCalled();

        for (var i = 0; i < injectorConstructors.length; i++) {
            if (injectorConstructors[i] != injectorConstructor) {
                expect(injectorConstructors[i]).not.toHaveBeenCalled();
            }
        }
    }

    function getWmsRecord() {
        dataCollection.isNcwms = returns(false);

        return dataCollection;
    }

    function getNcwmsRecord() {
        dataCollection.isNcwms = returns(true);

        return dataCollection;
    }

    function getNoDataRecord() {

        return dataCollection;
    }
});
