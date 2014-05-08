/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class AodaacJobCheckerJob {
    def timeout = 2 * 60 * 1000
    AodaacAggregatorService aodaacAggregatorService

    def execute() {
        aodaacAggregatorService.checkIncompleteJobs()
    }
}
