
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import static au.org.emii.portal.DateTimeUtils.*

class AODAACJobCheckerJob {

    def timeout = 2 * MINUTES

    AodaacAggregatorService aodaacAggregatorService

    def execute() {
        aodaacAggregatorService.checkIncompleteJobs()
    }
}
