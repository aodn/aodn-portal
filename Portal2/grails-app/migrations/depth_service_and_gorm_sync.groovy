databaseChangeLog = {

	changeSet(author: "jburgess (generated)", id: "1324344865662-1") {
		addNotNullConstraint(columnDataType: "int4", columnName: "active_layers_height", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-2") {
		addNotNullConstraint(columnDataType: "bool", columnName: "auto_zoom", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-3") {
		addNotNullConstraint(columnDataType: "int8", columnName: "baselayer_menu_id", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-4") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "catalog_url", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-5") {
		addNotNullConstraint(columnDataType: "int8", columnName: "contributor_menu_id", tableName: "config")
	}

	changeSet(author: "jburgess", id: "1324344865662-5-1") {
		update(tableName: "config")
		{
			column(name:"depth_password", value:"depth_password")
			column(name:"depth_schema", value:"depth_schema")
			column(name:"depth_table", value:"depth_table")
            column(name:"depth_url", value:"depth_url")
            column(name:"depth_user", value:"depth_user")
			column(name:"use_depth_service", valueBoolean:false)

			where "id=19"
		}
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-6") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_password", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-7") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_schema", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-8") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_table", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-9") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_url", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-10") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_user", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-11") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "download_cart_downloadable_protocols", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-12") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "download_cart_filename", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-13") {
		addNotNullConstraint(columnDataType: "int4", columnName: "download_cart_max_file_size", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-14") {
		addNotNullConstraint(columnDataType: "int4", columnName: "download_cart_max_num_files", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-15") {
		addNotNullConstraint(columnDataType: "VARCHAR(2000)", columnName: "download_cart_mime_type_to_extension_mapping", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-16") {
		addNotNullConstraint(columnDataType: "int4", columnName: "footer_height", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-17") {
		addNotNullConstraint(columnDataType: "int4", columnName: "header_height", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-18") {
		addNotNullConstraint(columnDataType: "int4", columnName: "map_get_feature_info_buffer", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-19") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "metadata_layer_protocols", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-20") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "metadata_link_protocols", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-21") {
		modifyDataType(columnName: "motd_end", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-22") {
		addNotNullConstraint(columnDataType: "TIMESTAMP WITH TIME ZONE", columnName: "motd_end", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-23") {
		addNotNullConstraint(columnDataType: "int8", columnName: "motd_id", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-24") {
		modifyDataType(columnName: "motd_start", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-25") {
		addNotNullConstraint(columnDataType: "TIMESTAMP WITH TIME ZONE", columnName: "motd_start", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-26") {
		addNotNullConstraint(columnDataType: "int4", columnName: "popup_height", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-27") {
		addNotNullConstraint(columnDataType: "int4", columnName: "popup_width", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-28") {
		addNotNullConstraint(columnDataType: "int8", columnName: "region_menu_id", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-29") {
		addNotNullConstraint(columnDataType: "bool", columnName: "use_depth_service", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-30") {
		addNotNullConstraint(columnDataType: "int4", columnName: "west_width", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-31") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "wms_scanner_base_url", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-32") {
		addNotNullConstraint(columnDataType: "bool", columnName: "currently_active", tableName: "layer")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-33") {
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "source", tableName: "layer")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-34") {
		modifyDataType(columnName: "edit_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "menu")
	}
/**
	changeSet(author: "jburgess (generated)", id: "1324344865662-35") {
		modifyDataType(columnName: "json", newDataType: "VARCHAR(255)", tableName: "menu")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-36") {
		modifyDataType(columnName: "motd", newDataType: "VARCHAR(255)", tableName: "motd")
	}
*/
	changeSet(author: "jburgess (generated)", id: "1324344865662-37") {
		addNotNullConstraint(columnDataType: "bool", columnName: "allow_discoveries", defaultNullValue: "TRUE", tableName: "server")
	}

    changeSet(author: "jburgess", id: "1324344865662-37-1") {
        update(tableName: "server")
        {
            column(name:"image_format", value:"image/png")
            column(name:"opacity", valueNumeric:100)

            where "id=96"
        }
    }

	changeSet(author: "jburgess (generated)", id: "1324344865662-38") {
		addNotNullConstraint(columnDataType: "VARCHAR(9)", columnName: "image_format", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-39") {
		addNotNullConstraint(columnDataType: "int4", columnName: "opacity", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-40") {
		modifyDataType(columnName: "parse_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-41") {
		modifyDataType(columnName: "type", newDataType: "VARCHAR(11)", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-42") {
		dropForeignKeyConstraint(baseTableName: "aggregation_entry", baseTableSchemaName: "public", constraintName: "fk99b3e0d5761e105a")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-43") {
		dropForeignKeyConstraint(baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f83426acdf12d")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-44") {
		dropForeignKeyConstraint(baseTableName: "saved_search", baseTableSchemaName: "public", constraintName: "user_id_fkey")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-45") {
		addUniqueConstraint(columnNames: "name", constraintName: "config_name_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-46") {
		addUniqueConstraint(columnNames: "title", constraintName: "menu_title_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "menu")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-47") {
		addUniqueConstraint(columnNames: "email_address", constraintName: "portal_user_email_address_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "portal_user")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-48") {
		addUniqueConstraint(columnNames: "name", constraintName: "server_name_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-49") {
		addUniqueConstraint(columnNames: "short_acron", constraintName: "server_short_acron_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-50") {
		addUniqueConstraint(columnNames: "uri", constraintName: "server_uri_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-51") {
		addUniqueConstraint(columnNames: "name", constraintName: "user_role_name_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "user_role")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-52") {
		dropColumn(columnName: "test_menu_id", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-53") {
		dropColumn(columnName: "status", tableName: "layer")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-54") {
		dropColumn(columnName: "source", tableName: "portal_user")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-55") {
		dropTable(tableName: "aggregation_entry")
	}

	changeSet(author: "jburgess (generated)", id: "1324344865662-56") {
		dropTable(tableName: "saved_search")
	}
}
