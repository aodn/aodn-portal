describe("Portal.filter.ui.ComboFilterPanel", function() {

    var filterPanel;

    // Test set-up
    beforeEach(function() {

        Portal.filter.ui.ComboFilterPanel.prototype._createControls = function() {
            this.combo = {
                setValue: jasmine.createSpy()
            };
        };

        filterPanel = new Portal.filter.ui.ComboFilterPanel({
            filter: {
                getName: returns('test'),
                getLabel: returns('testLabel'),
                setValue: noOp
            },
            dataCollection: {
                getTitle: returns('Collection title'),
                getLayerSelectionModel: returns({
                    getSelectedLayer: returns({
                        name: 'test layer',
                        getDownloadCql: returns("")
                    })
                })
            }
        });
    });

    describe('validateValue function', function() {

        beforeEach(function() {
            filterPanel.combo = {};
            filterPanel.getRawValue = returns("L'Astrolabe");
            filterPanel.markInvalid = noOp;
        });

        it('should return true when in the store', function() {

            filterPanel.findRecord = returns(true);
            expect(filterPanel.validateValue()).toEqual(true);
        });

        it('should mark combo invalid when not in the store', function() {

            spyOn(filterPanel, 'markInvalid');
            filterPanel.findRecord = returns(undefined);
            filterPanel.validateValue("anything");
            expect(filterPanel.markInvalid).toHaveBeenCalled();
            expect(filterPanel.validateValue()).toEqual(false);
        });
    });

    describe('_filterData', function() {
        it('removes empty and null values', function() {
            var values = [ null, "cake", undefined, "stapler", "", " ", "valid value with space" ];
            var filteredValues = [ ["cake"] , ["stapler"], ["valid value with space"] ];
            expect(filterPanel._filterValues(values)).toEqual(filteredValues);
        });
    });

    describe('onChange', function() {

        beforeEach(function() {
            spyOn(window, 'trackUsage');
            filterPanel.filter.setValue = jasmine.createSpy('setValue');
            filterPanel.combo = {
                getValue: returns("value"),
                disabled: false
            };
        });

        it('tracks usage using google analytics', function() {

            filterPanel._onChange();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Combo", "testLabel=value", "Collection title");
        });
    });
});
