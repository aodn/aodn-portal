databaseChangeLog = {
	changeSet(author: "dnahodil", id: "1333000638000-1", failOnError: true) {
		
		delete(tableName: "server") {
			
			where "short_acron like 'DN1'"
		}
	}
}