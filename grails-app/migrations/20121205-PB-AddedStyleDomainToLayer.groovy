databaseChangeLog = {

    changeSet(author: "pmbohm (generated)", id: "1354668542663-1") {
        createTable(tableName: "layer_styles") {
            column(name: "layer_styles_id", type: "int8")

            column(name: "styles_id", type: "int8")
        }
    }

    changeSet(author: "pmbohm (generated)", id: "1354668542663-2") {
        createTable(tableName: "styles") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "stylesPK")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "abstract_text", type: "varchar(255)")

            column(name: "name", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "title", type: "varchar(255)")
        }
    }


    changeSet(author: "pmbohm (generated)", id: "1354668542663-8") {
        addForeignKeyConstraint(baseColumnNames: "layer_styles_id", baseTableName: "layer_styles", constraintName: "FK4DDE53905A22FB", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "layer", referencesUniqueColumn: "false")
    }

    changeSet(author: "pmbohm (generated)", id: "1354668542663-9") {
        addForeignKeyConstraint(baseColumnNames: "styles_id", baseTableName: "layer_styles", constraintName: "FK4DDE5390BAF9C4FA", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "styles", referencesUniqueColumn: "false")
    }


    changeSet(author: "pmbohm (generated)", id: "1354668542663-13") {
        dropColumn(columnName: "styles", tableName: "layer")
    }
}
