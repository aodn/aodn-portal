databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "20131111-PB-extra-filter-parameters") {

        // additional columns for date range filtering
        sql "ALTER TABLE filter ADD COLUMN wms_start_date_name character varying(255);"
        sql "ALTER TABLE filter ADD COLUMN wms_end_date_name varying(255);"

	}
}
