
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart.downloadCartStatus');

Ext.EventManager.addListener( window, 'load', getInitialDownloadCartCount );

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
            	condensedLinks.push( { rec_uuid: rec.uuid, rec_title: rec.title, title: link.title, type: link.type, href: link.href, protocol: link.protocol, preferredFname: link.preferredFname } );
            }

            else{
            	condensedLinks.push( { rec_uuid: rec.uuid, rec_title: rec.title, title: link.title, type: link.type, href: link.href, protocol: link.protocol } );
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

function getInitialDownloadCartCount() {

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

function clearDownloadCart() {

    Ext.Ajax.request({
        url: 'downloadCart/clear',
        success: _handleSuccessAndHide,
        failure: _handleFailureAndShow
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

// Internal methods
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

    cartEl.removeClass( 'hiddenCartStatus' );
}

function showCartTabPanel() {

    Ext.MsgBus.publish("openDownloadCartPanelItem","downloadCartPanel");
}

function _hideCartControl() {

    var cartEl = Ext.get( 'downloadCartStatus' );

    cartEl.addClass( 'hiddenCartStatus' );
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
