/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.AggregatorGroup', function() {

    var aggregatorGroup;
    var gogoduckAggregator;
    var bodaacAggregator;

    beforeEach(function() {
        aggregatorGroup = new Portal.data.AggregatorGroup();
        gogoduckAggregator = new Portal.data.GogoduckAggregator();
        bodaacAggregator = new Portal.data.BodaacAggregator();
    });

    describe('supports subsetted netcdf', function() {

        it('returns true if any child aggregators return true', function() {

            aggregatorGroup.add(gogoduckAggregator);
            aggregatorGroup.add(bodaacAggregator);
            expect(aggregatorGroup.supportsSubsettedNetCdf()).toBe(true);
        });

        it('returns true if any child aggregators return true, regardless of order', function() {

            aggregatorGroup.add(bodaacAggregator);
            aggregatorGroup.add(gogoduckAggregator);
            expect(aggregatorGroup.supportsSubsettedNetCdf()).toBe(true);
        });
    });

    describe('supports url list netcdf format', function() {

        it('returns true if any child aggregators return true', function() {

            aggregatorGroup.add(gogoduckAggregator);
            aggregatorGroup.add(bodaacAggregator);
            expect(aggregatorGroup.supportsNetCdfUrlList()).toBe(true);
        });

        it('returns true if any child aggregators return true, regardless of order', function() {

            aggregatorGroup.add(bodaacAggregator);
            aggregatorGroup.add(gogoduckAggregator);
            expect(aggregatorGroup.supportsNetCdfUrlList()).toBe(true);
        });
    });
});
