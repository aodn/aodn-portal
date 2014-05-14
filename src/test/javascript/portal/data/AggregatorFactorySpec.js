/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.AggregatorFactory', function() {

    var aggrFactory = new Portal.data.AggregatorFactory();

    describe('newAggregatorGroup', function() {

        it('returns a group with children', function() {
            var links = [
                { name: Portal.data.AggregatorFactory.prototype.GOGODUCK_PROTOCOL_NAME },
                { name: Portal.data.AggregatorFactory.prototype.BODAAC_PROTOCOL_NAME }
            ];

            var aggrGroup = aggrFactory.newAggregatorGroup(links);

            expect(aggrGroup.childAggregators[0]).toBeInstanceOf(Portal.data.GogoduckAggregator);
            expect(aggrGroup.childAggregators[1]).toBeInstanceOf(Portal.data.BodaacAggregator);
        });

        it('returns a group with only a gogoduck child if links contains both gogoduck and aodaac', function() {
            var links = [
                { name: Portal.data.AggregatorFactory.prototype.GOGODUCK_PROTOCOL_NAME },
                { name: Portal.data.AggregatorFactory.prototype.AODAAC_PROTOCOL_NAME }
            ];

            var aggrGroup = aggrFactory.newAggregatorGroup(links);

            expect(aggrGroup.childAggregators[0]).toBeInstanceOf(Portal.data.GogoduckAggregator);
            expect(aggrGroup.childAggregators.length).toBe(1);
        });
    });

    describe('cutAodaac', function() {

        it('returns a array with only gogoduck if presented with links containing both aodaac and gogoduck', function() {
            var links = [
                { name: Portal.data.AggregatorFactory.prototype.GOGODUCK_PROTOCOL_NAME },
                { name: Portal.data.AggregatorFactory.prototype.AODAAC_PROTOCOL_NAME }
            ];

            var linksWithAodaacCut = aggrFactory.cutAodaac(links);

            expect(linksWithAodaacCut.length).toBe(1);

        });
    });

    describe('newAggregator', function() {

       it('returns an aodaac aggregator if metadata link protocol is aodaac', function() {
           spyOn(aggrFactory, '_getAodaacAggregator');
           var aggr = aggrFactory.newAggregator('AODAAC');
           expect(aggrFactory._getAodaacAggregator).toHaveBeenCalled();
       });

       it('returns an bodaac aggregator if metadata link protocol is bodaac', function() {
           spyOn(aggrFactory, '_getBodaacAggregator');
           var aggr = aggrFactory.newAggregator('BODAAC');
           expect(aggrFactory._getBodaacAggregator).toHaveBeenCalled();
       });

       it('returns an gogoduck aggregator if metadata link protocol is gogoduck', function() {
           spyOn(aggrFactory, '_getGogoduckAggregator');
           var aggr = aggrFactory.newAggregator('GoGoDuck');
           expect(aggrFactory._getGogoduckAggregator).toHaveBeenCalled();
       });
    });
});
