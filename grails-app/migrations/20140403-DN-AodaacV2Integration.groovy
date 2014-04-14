databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1396486534509-0") {
        delete(tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-1") {
        addColumn(tableName: "aodaac_job") {
            column(name: "has_ended", type: "bool") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-2") {
        addColumn(tableName: "aodaac_job") {
            column(name: "has_expired", type: "bool") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-3") {
        addColumn(tableName: "aodaac_job") {
            column(name: "status_updated_date", type: "timestamp")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-4") {
        addNotNullConstraint(
            columnDataType: "varchar(255)", columnName: "notification_email_address", tableName: "aodaac_job"
        )
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-16") {
        dropColumn(columnName: "data_file_exists", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-17") {
        dropColumn(columnName: "expired", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-18") {
        dropColumn(columnName: "job_params_date_range_end", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-19") {
        dropColumn(columnName: "job_params_date_range_start", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-20") {
        dropColumn(columnName: "job_params_environment", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-21") {
        dropColumn(columnName: "job_params_latitude_range_end", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-22") {
        dropColumn(columnName: "job_params_latitude_range_start", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-23") {
        dropColumn(columnName: "job_params_longitude_range_end", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-24") {
        dropColumn(columnName: "job_params_longitude_range_start", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-25") {
        dropColumn(columnName: "job_params_output_format", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-26") {
        dropColumn(columnName: "job_params_product_id", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-27") {
        dropColumn(columnName: "job_params_server", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-28") {
        dropColumn(columnName: "job_params_time_of_day_range_end", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-29") {
        dropColumn(columnName: "job_params_time_of_day_range_start", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-30") {
        dropColumn(columnName: "latest_status_cgi_seq", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-31") {
        dropColumn(columnName: "latest_status_datafile_ready", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-32") {
        dropColumn(columnName: "latest_status_has_errors", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-33") {
        dropColumn(columnName: "latest_status_job_ended", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-34") {
        dropColumn(columnName: "latest_status_return_code", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-35") {
        dropColumn(columnName: "latest_status_started", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-36") {
        dropColumn(columnName: "latest_status_status_date", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-37") {
        dropColumn(columnName: "latest_status_the_errors", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-38") {
        dropColumn(columnName: "latest_status_url_count", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-39") {
        dropColumn(columnName: "latest_status_urls_complete", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-40") {
        dropColumn(columnName: "latest_status_warnings", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-41") {
        dropColumn(columnName: "most_recent_data_file_exist_check", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396486534509-42") {
        dropColumn(columnName: "result_data_url", tableName: "aodaac_job")
    }
}
