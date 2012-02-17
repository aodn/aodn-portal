databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1329370045000-1") {
		
		update(tableName: "server")
		{
			column(name:"type", value: "NCWMS-1.1.1")
			where "type like 'NCWMS-1.3.0'"
		}
	}
}
