databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1327896961801-1") {
		
		update(tableName: "config")
		{
			column(name:"footer_content_width", valueNumeric:550)
		}
	}
}
