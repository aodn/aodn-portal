eventCreateWarStart = { warname, stagingDir ->
    Ant.delete(file: "${stagingDir}/WEB-INF/lib/postgresql-9.0-801.jdbc3.jar")
}


