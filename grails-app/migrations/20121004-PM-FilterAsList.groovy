
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1349320781990-1") {
		addColumn(tableName: "filter_possible_values") {
			column(name: "possible_values_idx", type: "int4")
		}
	}

	changeSet(author: "pmak (generated)", id: "1349320781990-2") {
		dropForeignKeyConstraint(baseTableName: "filter_possible_values", baseTableSchemaName: "public", constraintName: "fk439c10e93f8b53a")
	}
}
