databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "1328160201244-2", failOnError: true) {
        sql('delete from config')
		insert(tableName: "config") {
			column(name: "id", valueNumeric: "19")

			column(name: "version", valueNumeric: "122")

			column(name: "default_menu_id", valueNumeric: "9")

			column(name: "enablemotd", valueBoolean: "false")

			column(name: "initial_bbox", value: "99,-50,140,-10")

			column(name: "name", value: "Australian Ocean Data Network Portal")

			column(name: "proxy")

			column(name: "proxy_port")

			column(name: "contributor_menu_id", valueNumeric: "18")

			column(name: "region_menu_id", valueNumeric: "14")

			column(name: "motd_id", valueNumeric: "21")

			column(name: "motd_end", valueDate: "2011-10-27T17:39:00.0")

			column(name: "motd_start", valueDate: "2011-08-25T16:52:00.0")

			column(name: "catalog_url", value: "http://mest-test.aodn.org.au/geonetwork")

			column(name: "footer_height", valueNumeric: "88")

			column(name: "header_height", valueNumeric: "95")

			column(name: "west_width", valueNumeric: "290")

			column(name: "download_cart_max_file_size", valueNumeric: "10485760")

			column(name: "download_cart_max_num_files", valueNumeric: "100")

			column(name: "download_cart_filename", value: ""aodn portal download (%s).zip"")

			column(name: "active_layers_height", valueNumeric: "260")

			column(name: "download_cart_mime_type_to_extension_mapping", value: "{
"text/html":"html",
"text/xhtml":"html",
"text/plain":"txt",
"application/msword":"doc",
"image/bmp":"bmp",
"image/x-windows-bmp":"bmp",
"image/gif":"gif",
"image/jpeg":"jpg",
"image/png":"png",
"image/tiff":"tif",
"image/x-tiff":"tif",
"image/bmp":"bmp",
"application/vnd.google-earth.kml+xml":"kml",
"application/vnd.google-earth.kmz":"kmz",
"application/pdf":"pdf"
}")

			column(name: "download_cart_downloadable_protocols", value: "WWW:DOWNLOAD-1.0-http--download
WWW:DOWNLOAD-1.0-http--downloaddata
WWW:DOWNLOAD-1.0-http--downloadother
WWW:LINK-1.0-http--downloaddata")

			column(name: "metadata_layer_protocols", value: "OGC:WMS-1.1.1-http-get-map
OGC:WMS-1.3.0-http-get-map")

			column(name: "metadata_link_protocols", value: "WWW:LINK-1.0-http--link")

			column(name: "map_get_feature_info_buffer", valueNumeric: "10")

			column(name: "baselayer_menu_id", valueNumeric: "20")

			column(name: "popup_height", valueNumeric: "325")

			column(name: "popup_width", valueNumeric: "435")

			column(name: "auto_zoom", valueBoolean: "false")

			column(name: "wms_scanner_base_url", value: "http://localhost:8100/WmsScannerGrails/")

			column(name: "depth_password", value: "gis")

			column(name: "depth_url", value: "db.emii.org.au:5432/maplayers")

			column(name: "depth_user", value: "gis")

			column(name: "depth_schema", value: "bathy")

			column(name: "depth_table", value: "world_depth")

			column(name: "use_depth_service", valueBoolean: "true")

			column(name: "footer_content", value: "<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make inquiries via <a href="mailto:info@aodn.org.au">info@aodn.org.au</a> to be directed to the data custodian.</p>")

			column(name: "footer_content_width", valueNumeric: "550")

			column(name: "application_base_url", value: "http://localhost:8086/Portal2/")

			column(name: "wms_scanner_callback_password", value: "password")

			column(name: "wms_scanner_callback_username", value: "dnahodil+layerapitest1@gmail.com")
		}
	}
}