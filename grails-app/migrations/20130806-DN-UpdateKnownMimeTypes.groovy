databaseChangeLog = {

    changeSet(author: "dnahodil", id: "1375760091000-1") {

        def newValue = """\
{
	"application/msword":"doc",
	"application/netcdf":"nc",
	"application/pdf":"pdf",
	"application/vnd.google-earth.kml+xml":"kml",
	"application/vnd.google-earth.kmz":"kmz",
	"application/xml":"xml",
	"image/bmp":"bmp",
	"image/gif":"gif",
	"image/jpeg":"jpg",
	"image/png":"png",
	"image/tiff":"tif",
	"image/x-tiff":"tif",
	"image/x-windows-bmp":"bmp",
	"text/csv":"csv",
	"text/html":"html",
	"text/plain":"txt",
	"text/xhtml":"html",
	"text/xml":"xml"
}"""

        sql "UPDATE config SET download_cart_mime_type_to_extension_mapping = '$newValue'"
    }
}
