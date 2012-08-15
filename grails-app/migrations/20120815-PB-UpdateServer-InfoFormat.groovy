databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "1345007841118-1") {
		sql("update server set info_format = 'text/plain' where uri like '%www2.landgate.wa.gov.au/ows/wmspublic%';  update server set info_format = 'text/plain' where uri like '%reg.bom.gov.au/cgi-bin/reg/ws/gis/users/bomw0501%';")
	}

}
