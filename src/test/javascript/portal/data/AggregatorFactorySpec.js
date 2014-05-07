/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.AggregatorFactory', function() {

    var aggrFactory = new Portal.data.AggregatorFactory();

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
