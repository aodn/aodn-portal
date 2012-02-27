databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1329802867284-1", failOnError: true) {
        addColumn(tableName: "layer") {
            column(name: "bbox_maxx", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1329802867284-2", failOnError: true) {
        addColumn(tableName: "layer") {
            column(name: "bbox_maxy", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1329802867284-3", failOnError: true) {
        addColumn(tableName: "layer") {
            column(name: "bbox_minx", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1329802867284-4", failOnError: true) {
        addColumn(tableName: "layer") {
            column(name: "bbox_miny", type: "varchar(255)")
        }
    }
	
	changeSet(author: "tfotak (generated)", id: "1329802867284-5", failOnError: true) {
		grailsChange {
			change {
				sql.eachRow('select id, bbox from layer') { row ->
					if (row.bbox) {
						def coords = row.bbox.split(',')
						sql.execute "update layer set bbox_minx = '${coords[0]}', bbox_miny = '${coords[1]}', bbox_maxx = '${coords[2]}', bbox_maxy = '${coords[3]}' where id = $row.id"
					}
				}
			}
		}
	}

    changeSet(author: "dnahodil (generated)", id: "1329802867284-6", failOnError: true) {
        dropColumn(columnName: "bbox", tableName: "layer")
    }
}