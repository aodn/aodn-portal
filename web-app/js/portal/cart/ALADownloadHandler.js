Ext.namespace('Portal.cart');

Portal.cart.ALADownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    DOWNLOAD_FEILDS: "type%2Cmodified.p%2Clanguage%2Clicense%2Crightsholder%2Crights%2CbibliographicCitation%2Ccitation%2Creferences%2CinstitutionID%2CcollectionID%2CdatasetID%2CinstitutionCode%2CcollectionCode%2CdatasetName%2CownerInstitutionCode%2CbasisOfRecord.p%2CbasisOfRecord.p%2CinformationWithheld.p%2CdataGeneralizations.p%2CdynamicProperties%2CoccurrenceID%2CcatalogNumber%2CrecordNumber%2CrecordedBy.p%2CindividualCount%2CorganismQuantity%2CorganismQuantityType%2Csex%2ClifeStage%2CreproductiveCondition%2Cbehavior%2CestablishmentMeans.p%2CoccurrenceStatus.p%2Cpreparations%2Cdisposition%2CassociatedMedia%2CassociatedReferences%2CassociatedSequences%2CassociatedTaxa%2CotherCatalogNumbers%2CoccurrenceRemarks%2CorganismID%2CorganismName%2CorganismScope%2CassociatedOccurrences.p%2CassociatedOrganisms%2CpreviousIdentifications%2CorganismRemarks%2CmaterialSampleID%2CeventID%2CparentEventID%2CfieldNumber%2CeventDate.p%2CeventTime%2CstartDayOfYear%2CendDayOfYear%2Cyear.p%2Cmonth.p%2Cday.p%2CverbatimEventDate%2Chabitat.p%2CsamplingProtocol.p%2CsamplingEffort%2CsampleSizeUnit%2CfieldNotes%2CeventRemarks%2ClocationId%2ChigherGeographyID%2ChigherGeography%2Ccontinent%2CwaterBody%2CislandGroup%2Cisland%2Ccountry.p%2CcountryCode%2CstateProvince.p%2Ccounty%2Cmunicipality%2Clocality.p%2CverbatimLocality%2CminimumElevationInMeters.p%2CmaximumElevationInMeters.p%2CverbatimElevation.p%2CminimumDepthInMeters.p%2CmaximumDepthInMeters.p%2CverbatimDepth.p%2CminimumDistanceAboveSurfaceInMeters%2CmaximumDistanceAboveSurfaceInMeters%2ClocationAccordingTo%2ClocationRemarks%2CdecimalLatitude.p%2CdecimalLongitude.p%2CgeodeticDatum.p%2CcoordinateUncertaintyInMeters.p%2CcoordinatePrecision.p%2CpointRadiusSpatialFit%2CverbatimCoordinates%2CverbatimLatitude%2CverbatimLongitude%2CverbatimCoordinateSystem%2CverbatimSRS%2CfootprintWKT%2CfootprintSRS%2CfootprintSpatialFit%2CgeoreferencedBy.p%2CgeoreferencedDate.p%2CgeoreferenceProtocol.p%2CgeoreferenceSources.p%2CgeoreferenceVerificationStatus.p%2CgeoreferenceRemarks%2CgeologicalContextID%2CearliestEonOrLowestEonothem%2ClatestEonOrHighestEonothem%2CearliestEraOrLowestErathem%2ClatestEraOrHighestErathem%2CearliestPeriodOrLowestSystem%2ClatestPeriodOrHighestSystem%2CearliestEpochOrLowestSeries%2ClatestEpochOrHighestSeries%2CearliestAgeOrLowestStage%2ClatestAgeOrHighestStage%2ClowestBiostratigraphicZone%2ChighestBiostratigraphicZone%2ClithostratigraphicTerms%2Cgroup%2Cformation%2Cmember%2Cbed%2CidentificationID%2CidentificationQualifier%2CtypeStatus.p%2CidentifiedBy.p%2CdateIdentified.p%2CidentificationReferences.p%2CidentificationVerificationStatus%2CidentificationRemarks%2CtaxonID%2CscientificNameID%2CacceptedNameUsageID%2CparentNameUsageID%2CoriginalNameUsageID%2CnameAccordingToID%2CnamePublishedInID%2CtaxonConceptID.p%2CscientificName.p%2CacceptedNameUsage%2CparentNameUsage%2CoriginalNameUsage%2CnameAccordingTo.p%2CnamePublishedIn%2CnamePublishedInYear%2ChigherClassification%2Ckingdom.p%2Cphylum.p%2Cclasss.p%2Cclasss%2Corder.p%2Cfamily.p%2Cgenus.p%2Csubgenus%2Cspecies.p%2CspecificEpithet%2CinfraspecificEpithet%2CtaxonRank.p%2CverbatimTaxonRank%2CscientificNameAuthorship%2CvernacularName.p%2CnomenclaturalCode.p%2CtaxonomicStatus%2CnomenclaturalStatus%2CtaxonRemarks%2CmeasurementDeterminedDate%2CrelationshipAccordingTo%2CresourceRelationshipID%2CmeasurementRemarks%2CmeasurementValue%2CrelationshipRemarks%2CresourceID%2CrelationshipEstablishedDate%2CrelationshipOfResource%2CmeasurementMethod%2CmeasurementID%2CmeasurementType%2CmeasurementUnit%2CmeasurementDeterminedBy%2CmeasurementAccuracy%2CrelatedResourceID",

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: 'CSV',
                handler: this._getUrlGeneratorFunction('csv'),
                handlerParams: this._buildHandlerParams('{0}.csv.zip')
            });

            downloadOptions.push({
                textKey: 'TSV',
                handler: this._getUrlGeneratorFunction('tsv'),
                handlerParams: this._buildHandlerParams('{0}.tsv.zip')
            });

            downloadOptions.push({
                textKey: 'CSV+SHP',
                handler: this._getUrlGeneratorFunction('shp'),
                handlerParams: this._buildHandlerParams('{0}.shp.zip')
            });
        }
        return downloadOptions;
    },

    _buildHandlerParams: function(fileFormat) {
        return {
            asyncDownload: true,
            collectEmailAddress: true,
            downloadLabel: OpenLayers.i18n('downloadAlaAction'),
            filenameFormat: fileFormat,
            downloadControllerArgs: {
                action: 'passThrough'
            },
            serviceResponseHandler: this.serviceResponseHandler // adds the status url to popup. todo always says invalid?
        }
    },

    _showDownloadOptions: function(filters) {

        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty()
            && !Portal.filter.FilterUtils.hasFilter(filters, 'timeSeriesAtPoint');
    },

    _getUrlGeneratorFunction: function(format) {

        var _this = this;

        return function(collection, handlerParams) {

            var builder = new Portal.filter.combiner.ALAParametersBuilder({
                filters: collection.getFilters()
            });

            handlerParams.alaDownloadFilename = collection.getTitle();

            var url = _this.buildRequestUrl(
                _this.onlineResource.href,
                format,
                builder.buildParameterString(),
                handlerParams
            );

            if (handlerParams.challengeResponse) {
                url += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }
            return url;
        };
    },

    buildRequestUrl: function(baseUrl, outputFormat, downloadParameterString, handlerParams ) {

        if (downloadParameterString == undefined) {
            return;
        }
        else {
            var downloadUrl = baseUrl;
            downloadUrl += (downloadUrl.indexOf('?') !== -1) ? "&" : "?";
            downloadUrl += '&fileType=' + outputFormat;
            downloadUrl += '&file=' + handlerParams.alaDownloadFilename.replace(/ /g, '_').replace(/\W/g, '');
            downloadUrl += '&fields=' + this.DOWNLOAD_FEILDS;
            downloadUrl += "&dwcHeaders=true";
            downloadUrl += "&email=" + handlerParams.emailAddress;
            downloadUrl += '&reasonTypeId=' + 4;
            downloadUrl += '&qa=none';
            downloadUrl += '&sourceTypeId=' + 0; // AODN will need to be assigned a number by ALA
            downloadUrl += downloadParameterString;


            return String.format(
                "{0}{1}",
                this.getAsyncDownloadUrl('ala'),
                Ext.urlEncode({
                    server: downloadUrl
                })
            );
        }
    },
    
    serviceResponseHandler: function(response) {
        var msg = "";

        if (response) {
            try {
                var responseJson = JSON.parse(response);
                if (responseJson['url']) {
                    msg = OpenLayers.i18n('asyncServiceMsg', {
                        url: responseJson['url']
                    });
                }
            }
            catch (e) {
                log.error(String.format("Could not parse asynchronous response: '{0}'", response));
            }
        }
        return msg;
    }
});
