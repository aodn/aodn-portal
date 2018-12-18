    describe("Portal.filter.ui.AlaSpeciesFilterPanel", function() {

    var alaSpeciesFilterPanel;

    beforeEach(function() {

        Portal.filter.ui.AlaSpeciesFilterPanel.prototype._createControls = function() {
            this.speciesCombo = {
                clearValue: noOp,
                getValue: returns(false),
                validate: returns(true)
            };
            this.operators = {
                getValue: noOp
            };
            this.speciesComboItems = [];
            this.activeFiltersContainer = {
                show: noOp,
                add: noOp,
                doLayout: noOp
            };
        };

        alaSpeciesFilterPanel = new Portal.filter.ui.AlaSpeciesFilterPanel({
            filter: {
                name: 'test',
                label: 'testLabel',
                setValue: noOp,
                getHumanReadableForm: returns('Sushi sandwiches')
            },
            dataCollection: {
                getTitle: returns('ALA Collection'),
                getLayerSelectionModel: returns({
                    getSelectedLayer: returns({
                        name: 'test layer'
                    })
                })
            }
        });

        alaSpeciesFilterPanel.cleanupSpeciesCombo = returns(true);
    });

    describe('_onSpeciesComboChange', function() {
        beforeEach(function() {
            alaSpeciesFilterPanel._createControls();
            alaSpeciesFilterPanel.speciesCombo.getValue = returns(5);
            alaSpeciesFilterPanel.speciesCombo.clearInvalid = noOp;
            alaSpeciesFilterPanel.speciesCombo.validateValue = returns(true);
            alaSpeciesFilterPanel.operators = {
                getValue: noOp,
                markInvalid: noOp
            };
            spyOn(alaSpeciesFilterPanel, '_createNewActiveFilterPanel');
        });

        it('sends correct GA tracking data', function() {
            var record = {
                data: 'sperm whale'
            };
            spyOn(window, 'trackUsage');
            alaSpeciesFilterPanel._onSpeciesComboChange(alaSpeciesFilterPanel.speciesCombo, record);
            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "trackingAlaFilterAction", "Sushi sandwiches", "ALA Collection");
        });

        it('creates a new active filter panel if the record is not present in species combo', function() {
            var record = {
                data: 'sperm whale'
            };
            alaSpeciesFilterPanel._onSpeciesComboChange(alaSpeciesFilterPanel.speciesCombo, record);
            expect(alaSpeciesFilterPanel._createNewActiveFilterPanel).toHaveBeenCalledWith(record.data);
        });

        it('does not create a new active filter panel if the record is not present in species combo', function() {
            var record = {
                data: 'sperm whale'
            };
            alaSpeciesFilterPanel.speciesComboItems.push(record.data);
            alaSpeciesFilterPanel._onSpeciesComboChange(alaSpeciesFilterPanel.speciesCombo, record);
            expect(alaSpeciesFilterPanel._createNewActiveFilterPanel).not.toHaveBeenCalled();
        });
    });
});
