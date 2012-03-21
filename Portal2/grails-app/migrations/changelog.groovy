
databaseChangeLog = {
	
	// Structural changes and changes for all instances
	include file: 'initialisation.groovy'
	
	include file: '20120321-DN-TweaksToDefaultConfig.groovy'
	
	// Changes that apply to all instances must be included here, above the calls to instance-specific change logs
	
	// Instance-specific changes
	include file: 'imos-changelog.groovy'
}
