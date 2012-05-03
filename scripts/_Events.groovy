eventCreateWarStart = { warname, stagingDir ->
    Ant.delete(file: "${stagingDir}/WEB-INF/lib/postgresql-9.0-801.jdbc3.jar")
}


eventCompileStart = { kind ->
	def buildNumber = metadata.'app.buildNumber'
 
	if (!buildNumber)
		buildNumber = 1
	else
		buildNumber = Integer.valueOf(buildNumber) + 1
 
	metadata.'app.buildNumber' = buildNumber.toString()

	def formatter = new java.text.SimpleDateFormat("MMM dd, yyyy")
	def buildDate = formatter.format(new Date(System.currentTimeMillis()))
	metadata.'app.buildDate' = buildDate
	metadata.'app.buildProfile' = grailsEnv
		
	
	metadata.persist()
 
	println "Compile Starting on Build #${buildNumber}"
}

