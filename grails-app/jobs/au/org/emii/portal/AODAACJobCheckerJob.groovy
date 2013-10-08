
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class AODAACJobCheckerJob {
    def timeout = 120000 // 2 minutes to allow quicker testing, can bump back when in prod - DN
    AodaacAggregatorService aodaacAggregatorService

    def execute() {
        aodaacAggregatorService.checkIncompleteJobs()
    }
}
