
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart.downloadCartStatus');

Ext.EventManager.addListener( window, 'load', getDownloadCartCount );

// Public methods
function addToDownloadCart( tuples ) {

    var condensedLinks = new Array();

    // Extract only the fields we need
    Ext.each( tuples,
        function( tuple ){

            var rec = tuple.record.data;
            var link = tuple.link;

            var prefname = null;

            if(tuple.link.preferredFname != null){
            	condensedLinks.push( { disableFlag: false, rec_uuid: rec.uuid, rec_title: rec.title, title: link.title, type: link.type, href: link.href, protocol: link.protocol, preferredFname: link.preferredFname } );
            }

            else{
            	condensedLinks.push( { disableFlag: false, rec_uuid: rec.uuid, rec_title: rec.title, title: link.title, type: link.type, href: link.href, protocol: link.protocol } );
            }

        }
    );

    var linksAsJson = Ext.util.JSON.encode( condensedLinks );

    Ext.Ajax.request({
        url: 'downloadCart/add',
        params: { newEntries: linksAsJson },
        success: _handleSuccessAndShow,
        failure: _handleFailureAndShow
    });
}

function setDownloadCartRecordDisableFlag ( record_uuid,flag ) {

    if (flag == "true") {
        Ext.MsgBus.publish("downloadCart.cartRecordRemoved", record_uuid);
    }

    Ext.Ajax.request({
        url: 'downloadCart/modRecordAvailability',
        params: { rec_uuid: record_uuid, disableFlag: flag },
        success: getDownloadCartCount,
        failure: _handleFailureAndShow
    });
    return false;
}

function getDownloadCartCount() {

    Ext.Ajax.request({
        url: 'downloadCart/getSize',
        success: function( resp ) {

            var count = resp.responseText;

            if ( !_isValidNumber( count ) ) {

                _handleFailureAndHide( resp );
            }
            else if ( count == "0" ) {

                _handleSuccessAndHide( resp );
            }
            else {

                _handleSuccessAndShow( resp );
            }
        },
        failure: _handleFailureAndHide
    });
}

function doDownload(){
    Ext.Ajax.request({
        url: 'downloadCart/getSize',
        success: function(resp){
            if(resp.responseText === "0"){
                alert("The download cart is empty.  Please add an item to the cart and try again.");
            }
            else{
                new Portal.cart.DownloadCartConfirmationWindow().show();

            }
        },
        failure: function(){
            alert("There is a problem with the download cart and please try again later.  Please refer to our Help section for further assistance.");
        }
    });
}


function clearDownloadCart() {

    Ext.Ajax.request({
        url: 'downloadCart/clear',
        success: _handleSuccessfulCartClear,
        failure: _handleFailureAndShow
    });
}


// Internal methods
function _handleSuccessfulCartClear( resp) {

    Ext.MsgBus.publish("downloadCart.cartCleared");
    _handleSuccessAndHide( resp);
}

function _handleSuccess( resp ) {
    var response = resp.responseText;

    if ( !_isValidNumber( response ) ) {
        console.log( 'Invalid response from server: \'' + response + '\' (but with success code ' + resp.status + ')' );
        _updateCount( "?" );
    }
    else {
        _updateCount( response );
        Ext.MsgBus.publish("downloadCart.cartContentsUpdated", response);
    }
}

function _handleSuccessAndShow( resp ) {
    _handleSuccess(resp);
    _showCartControl();
    _flashUI();
}

function _handleSuccessAndHide( resp ) {
    _handleSuccess(resp);
    _hideCartControl();
    _flashUI();
}

function _handleFailureAndShow( resp ) {

    console.log(resp);
    console.log( 'Server-side failure: \'' + resp.responseText + '\' (status: ' + resp.status + ')' );

    _updateCount( "?" );
    _showCartControl();
    _flashUI();
}

function _handleFailureAndHide( resp ) {

    console.log( 'Server-side failure: \'' + resp.responseText + '\' (status: ' + resp.status + ')' );

    _updateCount( "?" );
    _hideCartControl();
    _flashUI();
}

function _updateCount( count ) {

    var cartSizeEl = Ext.get( 'downloadCartSize' );

    cartSizeEl.update( count + '' );
}

function _showCartControl() {

    var cartEl = Ext.get( 'downloadCartStatus' );
    cartEl.removeClass( 'hidden' );

    Ext.MsgBus.publish("downloadCart.toggleDownloadCartPanelButtons","enable");
}

function _hideCartControl() {

    var cartEl = Ext.get( 'downloadCartStatus' );
    cartEl.addClass( 'hidden' );

    Ext.MsgBus.publish("downloadCart.toggleDownloadCartPanelButtons","disable");

}

function showCartTabPanel() {

    Ext.MsgBus.publish("openDownloadCartPanelItem","downloadCartPanel");
}



function _flashUI() {
    
    var cartEl = Ext.get('downloadCartStatus');
    
    // Animate UI
    cartEl.animate(
        // animation control object
        {
            backgroundColor: { from: '#FFFFCC',
                                 to: _getDownloadCartUIOriginalColor() }
        },
        0.7,          // animation duration
        null,         // callback
        'bounceBoth', // easing method
        'color'       // animation type ('run','color','motion','scroll')
    );
}

var _downloadCartOriginalColor;

function _getDownloadCartUIOriginalColor() {
    
    if ( _downloadCartOriginalColor == undefined ) {
        
        _downloadCartOriginalColor = Ext.get('downloadCartStatus').getStyles('backgroundColor').backgroundColor;
    }
    
    return _downloadCartOriginalColor;
}

function _isValidNumber( s ) {

    return !isNaN( parseInt( s, 10 /* decimal */ ) );
}
