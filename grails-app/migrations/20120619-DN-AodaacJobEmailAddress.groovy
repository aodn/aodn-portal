databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1340249843164-2") {
        addColumn(tableName: "aodaac_job") {
            column(name: "notification_email_address", type: "varchar(255)")
        }
    }
}
