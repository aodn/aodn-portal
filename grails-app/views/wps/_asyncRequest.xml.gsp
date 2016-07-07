<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<%@ page import="groovy.xml.XmlUtil" %>
<wps:Execute service="WPS" version="1.0.0"
             xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1"
             xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd">

    <ows:Identifier>gs:${jobType}</ows:Identifier>
    <wps:DataInputs>
        <g:each in="${jobParameters}" var="id, value">
            <wps:Input>
                <ows:Identifier>${id}</ows:Identifier>
                <wps:Data>
                    <wps:LiteralData>${XmlUtil.escapeXml(value)}</wps:LiteralData>
                </wps:Data>
            </wps:Input>
        </g:each>
        <wps:Input>
            <ows:Identifier>callbackUrl</ows:Identifier>
            <wps:Data>
                <wps:LiteralData>
                    <g:createLink controller="wps" action="jobComplete" absolute="true" />
                </wps:LiteralData>
            </wps:Data>
        </wps:Input>
        <wps:Input>
            <ows:Identifier>callbackParams</ows:Identifier>
            <wps:Data>
                <wps:LiteralData>email.to=${email.to}</wps:LiteralData>
            </wps:Data>
        </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
        <wps:ResponseDocument storeExecuteResponse="true" status="true">
            <wps:Output asReference="true" mimeType="${mimeType}">
                <ows:Identifier>result</ows:Identifier>
            </wps:Output>
        </wps:ResponseDocument>
    </wps:ResponseForm>
</wps:Execute>
