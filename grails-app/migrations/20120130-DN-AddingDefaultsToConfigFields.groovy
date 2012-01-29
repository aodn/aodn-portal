databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1327878756568-1") {
		
		update(tableName: "config")
		{
			column(name:"wms_scanner_callback_username", value: "dnahodil+layerapitest1@gmail.com")
		}
		
		update(tableName: "config")
		{
			column(name:"wms_scanner_callback_password", value: "password")
		}
	}
}
