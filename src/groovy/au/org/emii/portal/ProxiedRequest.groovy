package au.org.emii.portal

import org.apache.commons.io.IOUtils

class ProxiedRequest {

	def request
	def response
	def params

	ProxiedRequest(request, response, params) {
		this.request = request
		this.response = response
		this.params = params
	}

	def proxy(downloadGif) {

		def targetUrl = _getUrl(params)
		def conn = targetUrl.openConnection()

		if (params.format) {
			response.contentType = params.format
		}
		else if(request.contentType)
		{
			response.contentType = request.contentType
		}
		else if(request.getHeader("Accept"))
		{
			response.contentType = request.getHeader("Accept")
		}

		def outputStream = response.outputStream

		_addAuthentication(conn, targetUrl)

		if (request.method == 'HEAD') {
			render(text: "", contentType: (params.format ?: params.FORMAT))
		}
		else {
			if(downloadGif){
				def index = params.url.indexOf("LAYERS=")

				if(index > -1){
					def layers = params.url.substring(index + 7);
					def timeStr = params.TIME.replaceAll("[-:]", "")
					timeStr.replace("/", "_")
					response.setHeader("Content-disposition", "attachment; filename=" +
						layers + "_" + timeStr + ".gif");
				}
			}

			try {
				outputStream << conn.inputStream
				outputStream.flush()
			}
			catch (Exception e) {

				log.info "Unable to pass-through response from $targetUrl", e
			}
			finally {

				IOUtils.closeQuietly( outputStream )
			}
		}
	}

	def _getUrl(params) {

		def query = params.findAll {
			key, value ->

			key != "controller" &&
				key != "url" &&
				key != "format" &&
				key != "_dc"
		}

		def queryStr = ""

		query.each {
			key, value ->

			queryStr += "&$key=$value"
		}

		return (params.url + queryStr).toURL()
	}

	def _addAuthentication(connection, url) {
		def server = _getServer(url)
		if (server) {
			server.addAuthentication(connection)
		}
	}

	def _getServer(url) {
		return Server.findByUriLike("%${url.getHost()}%")
	}

}
