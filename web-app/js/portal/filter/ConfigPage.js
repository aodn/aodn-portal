/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.filter');

$(document).ready(function() {

    var showPossibleValues = function() {
        $('#possibleValues').val(Portal.filter.possibleValues);
        Portal.filter.possibleValues = '';
        $('#possibleValues, #possibleValuesLabel').show();
    };

    var hidePossibleValues = function() {
        $('#possibleValues, #possibleValuesLabel').hide();
        Portal.filter.possibleValues = $('#possibleValues').val();
        $('#possibleValues').val('');
    }

    var showOrHidePossibleValues = function() {
        if ($("#possibleValuesType").val() != 'String') {
            hidePossibleValues();
        }
        else {
            showPossibleValues();
        }
    }

    var showOrHideDateRangeFormElements = function() {
        if ($("#possibleValuesType").val() != 'DateRange') {
            $('.dateRangeFilterAdminElement').hide();
            $('.downloadOnlyAdminElement').show();
        }
        else {
            $('.dateRangeFilterAdminElement').show();
            $('.downloadOnlyAdminElement').hide();
        }
    }

    $("#possibleValuesType").change(function() {
        showOrHidePossibleValues();
        showOrHideDateRangeFormElements();
    });

    showOrHidePossibleValues();
    showOrHideDateRangeFormElements();

});
