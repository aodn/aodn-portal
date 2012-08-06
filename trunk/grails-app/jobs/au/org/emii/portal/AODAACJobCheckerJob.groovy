package au.org.emii.portal

class AODAACJobCheckerJob {
    def timeout = 60000l // execute job once in 5 seconds
    AodaacAggregatorService aodaacAggregatorService
    
    def execute() {
        aodaacAggregatorService.checkIncompleteJobs()
    }
}
