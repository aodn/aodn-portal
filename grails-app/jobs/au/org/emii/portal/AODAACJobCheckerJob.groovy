package au.org.emii.portal

class AODAACJobCheckerJob {
    def timeout = 300000l // execute job once in 5 MINUTES!  Yeap, 5 * 60 * 1000
    AodaacAggregatorService aodaacAggregatorService
    
    def execute() {
        aodaacAggregatorService.checkIncompleteJobs()
    }
}
