databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1335485693361-1") {
        createTable(tableName: "aodaac_job") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "aodaac_jobPK")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "timestamp") {
                constraints(nullable: "false")
            }

            column(name: "job_id", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_environment", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_server", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_date_range_end", type: "timestamp") {
                constraints(nullable: "false")
            }

            column(name: "job_params_date_range_start", type: "timestamp") {
                constraints(nullable: "false")
            }

            column(name: "job_params_latitude_range_end", type: "float8(19)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_latitude_range_start", type: "float8(19)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_longitude_range_end", type: "float8(19)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_longitude_range_start", type: "float8(19)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_output_format", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_product_id", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "job_params_time_of_day_range_end", type: "varchar(4)") {
                constraints(nullable: "false")
            }

            column(name: "job_params_time_of_day_range_start", type: "varchar(4)") {
                constraints(nullable: "false")
            }

            column(name: "latest_status_cgi_seq", type: "varchar(255)")

            column(name: "latest_status_datafile_ready", type: "bool")

            column(name: "latest_status_has_errors", type: "bool")

            column(name: "latest_status_job_ended", type: "bool")

            column(name: "latest_status_status_date", type: "timestamp")

            column(name: "latest_status_return_code", type: "int4")

            column(name: "latest_status_started", type: "bool")

            column(name: "latest_status_the_errors", type: "varchar(255)")

            column(name: "latest_status_url_count", type: "int4")

            column(name: "latest_status_urls_complete", type: "int4")

            column(name: "latest_status_warnings", type: "varchar(255)")

            column(name: "result_data_url", type: "varchar(255)")
        }
    }
}
