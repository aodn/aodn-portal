databaseChangeLog = {

    changeSet(author: "pmbohm (generated)", id: "1355191564282-1") {
            sql("alter table layer_styles rename to layer_style;\n" +
                    "ALTER TABLE layer_style  RENAME  COLUMN styles_id TO style_id;\n" +
                    "alter table styles rename to style;")
    }

}
