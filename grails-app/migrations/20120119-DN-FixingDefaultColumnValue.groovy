databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1326943581305-1") {
		
		update(tableName: "layer")
		{
			column(name:"abstract_trimmed", value: "")
			where "abstract_trimmed LIKE 'No text'"
		}
	}
}