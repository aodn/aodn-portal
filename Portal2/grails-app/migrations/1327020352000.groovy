databaseChangeLog = {

	changeSet(author: "tfotak", id: "1327020352000-1", failOnError: true) {
		update(tableName: "config") {
			column(name: "catalog_url", value: "http://mest-test.aodn.org.au/geonetwork")
		}
	}
	
}
