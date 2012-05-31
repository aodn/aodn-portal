databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1338444808360-1") {
        addColumn(tableName: "aodaac_job") {
            column(name: "user_id", type: "int8") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1338444808360-2") {
        dropNotNullConstraint(columnDataType: "varchar(4)", columnName: "job_params_time_of_day_range_end", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1338444808360-3") {
        dropNotNullConstraint(columnDataType: "varchar(4)", columnName: "job_params_time_of_day_range_start", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1338444808360-10") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "aodaac_job", constraintName: "FK23D7EF0B761E105A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "portal_user", referencesUniqueColumn: "false")
    }
}
