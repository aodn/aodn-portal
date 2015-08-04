describe('Portal.form.PolygonTypeCombo', function() {

    var mockMap;
    var polygonTypeCombo;

    beforeEach(function() {
        mockMap = getMockMap();

        polygonTypeCombo = new Portal.form.PolygonTypeComboBox({
            map: mockMap
        });
    });

    describe('items', function() {
        it('has a bounding box item', function() {
            expect(polygonTypeCombo.store.find('value', Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX)).toBeGreaterThan(-1);
        });

        it('has a polygon item', function() {
            expect(polygonTypeCombo.store.find('value', Portal.ui.openlayers.SpatialConstraintType.POLYGON)).toBeGreaterThan(-1);
        });
    });

    describe('polygon combo box', function() {
        it('subscribes to a spatial constraint type change event', function() {
            expect(mockMap.events.on).toHaveBeenCalledWith({
                scope: polygonTypeCombo,
                'spatialconstrainttypechanged': polygonTypeCombo._updateValue
            });
        });
    });

    describe('setting spatial constraint', function() {
        it('calls setSpatialConstraintStyle when the value is set', function() {
            polygonTypeCombo.setValue('none');
            expect(mockMap.setSpatialConstraintStyle).toHaveBeenCalled();
        });
    });

    describe('_spatialConstraintCleared', function() {
        var labelsData = [
            { value: "value1", label: "Some label 1" },
            { value: "value2", label: "Some label 2" }
        ];

        beforeEach(function() {
            polygonTypeCombo.store = new Ext.data.JsonStore({
                fields: ['value', 'label'],
                data: labelsData
            });
        });

        it('sets to first item in store', function() {
            spyOn(polygonTypeCombo, 'setValue');

            polygonTypeCombo._spatialConstraintCleared();

            expect(polygonTypeCombo.setValue).toHaveBeenCalledWith("value1");
        });
    });
});
