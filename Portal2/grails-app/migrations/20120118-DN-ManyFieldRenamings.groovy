databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1326842592275-1") {
		addColumn(tableName: "layer") {
			column(name: "abstract_trimmed", type: "VARCHAR(455)")
		}
		
		addNotNullConstraint(tableName: "layer", columnName:"abstract_trimmed", defaultNullValue: "No text")
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-2") {
		addColumn(tableName: "layer") {
			column(name: "active_in_last_scan", type: "bool")
		}
		
		addNotNullConstraint(tableName: "layer", columnName:"active_in_last_scan", defaultNullValue: true)
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-3") {
		addColumn(tableName: "layer") {
			column(name: "blacklisted", type: "bool")
		}
		
		addNotNullConstraint(tableName: "layer", columnName:"blacklisted", defaultNullValue: false)
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-4") {
		addColumn(tableName: "layer") {
			column(name: "projection", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-5") {
		addColumn(tableName: "server") {
			column(name: "last_scan_date", type: "TIMESTAMP WITH TIME ZONE")
		}
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-6") {
		addColumn(tableName: "server") {
			column(name: "scan_frequency", type: "int4")
		}
		
		addNotNullConstraint(tableName: "server", columnName:"scan_frequency", defaultNullValue: 120)
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-12") {
		dropColumn(columnName: "currently_active", tableName: "layer")
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-13") {
		dropColumn(columnName: "description", tableName: "layer")
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-14") {
		dropColumn(columnName: "disabled", tableName: "layer")
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-15") {
		dropColumn(columnName: "parse_date", tableName: "server")
	}

	changeSet(author: "dnahodil (generated)", id: "1326842592275-16") {
		dropColumn(columnName: "parse_frequency", tableName: "server")
	}
	
	changeSet(author: "dnahodil", id: "1326842592275-17") {
	
		update(tableName: "config")
		{
			column(name:"wms_scanner_base_url", value: "http://localhost:8100/WmsScannerGrails/")
			where "id = 19"
		}
	}
}
