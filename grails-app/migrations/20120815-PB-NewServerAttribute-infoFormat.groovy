databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "1344988200476-1") {
//		addColumn(tableName: "server") {
//			column(name: "info_format", type: "VARCHAR(10)") {
//				constraints(nullable: "false")
//			}
//		}
//	}
		sql("ALTER TABLE server ADD COLUMN info_format character varying(16) NOT NULL DEFAULT 'text/html'; update server set info_format = 'text/xml' where uri like '%www2.landgate.wa.gov.au/ows/wmspublic%';  update server set info_format = 'text/xml' where uri like '%reg.bom.gov.au/cgi-bin/reg/ws/gis/users/bomw0501%';")
	}
}
