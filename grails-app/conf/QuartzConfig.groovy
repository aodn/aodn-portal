
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */


quartz {
    autoStartup = true
    jdbcStore = false
    waitForJobsToCompleteOnShutdown = true
}

environments {
    test {
        quartz {
            autoStartup = false
        }
    }
}
