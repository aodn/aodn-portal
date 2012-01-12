databaseChangeLog = {

	changeSet(author: "tfotak", id: "1326408271000-1") {
		sql("update layer set name = 'argo_float' where id = 5")
		sql("update layer set name = 'Zooview ' where id = 7")
		sql("update layer set name = 'HiRes_aus-group' where id = 8")
		sql("update layer set name = 'abos_tracks' where id = 12")
		sql("update layer set name = 'sots' where id = 13")
		sql("update layer set name = '2001_ABOM-L3P_GHRSST-SSTsubskin-AVHRR_MOSAIC_01km-AO_DAAC-v01-fv01_0%2Fsea_surface_temperature' where id = 26")
		sql("update layer set name = 'argo_float' where id = 35")
		sql("update layer set name = 'default_basemap_simple' where id = 37")
		sql("update layer set name = 'setas_surf_fcst.temp' where id = 67")
		sql("update layer set name = 'ocean_east_aus_temp/temp' where id = 72")
		sql("update layer set name = 'INFORMD_STORM/h1agrid' where id = 75")
		sql("update layer set name = 'marine_geo' where id = 86")
		sql("update layer set name = 'satellite' where id = 87")
		sql("update layer set name = 'ACORN_raw_data_SAG/SPEED' where id = 90")
		sql("update layer set name = 'layer_won' where id = 97")
		sql("update layer set name = 'layer_too' where id = 101")
		sql("update layer set name = 'soop_xbt' where id = 108")
		sql("update layer set name = 'anfog_glider' where id = 109")
		sql("update layer set name = 'argo_aggregation' where id = 110")
	}
}
