databaseChangeLog = {

	changeSet(author: "craigj", id: "7c4f5980-e793-11e2-91e2-0800200c9a66") {
		sql("update config set download_cart_filename=replace(download_cart_filename,'%s %s', '%s')")
	}
}