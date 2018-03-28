<?xml version="1.0" encoding="UTF-8"?>
<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>gs:PagedUnique</ows:Identifier>
    <wps:DataInputs>
        <wps:Input>
            <ows:Identifier>features</ows:Identifier>
            <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">
                <wps:Body>
                    <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2">
                        <wfs:Query typeName="${typeName}">
                            <ogc:SortBy>
                                <ogc:SortProperty>
                                    <ogc:PropertyName>${propertyName}</ogc:PropertyName>
                                    <ogc:SortOrder>ASC</ogc:SortOrder>
                                </ogc:SortProperty>
                            </ogc:SortBy>
                        </wfs:Query>
                    </wfs:GetFeature>
                </wps:Body>
            </wps:Reference>
        </wps:Input>
        <wps:Input>
            <ows:Identifier>fieldName</ows:Identifier>
            <wps:Data>
                <wps:LiteralData>${propertyName}</wps:LiteralData>
            </wps:Data>
        </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
        <wps:RawDataOutput mimeType="application/json">
            <ows:Identifier>result</ows:Identifier>
        </wps:RawDataOutput>
    </wps:ResponseForm>
</wps:Execute>