Ext.namespace('Portal.common.downloadCart');

Ext.EventManager.addListener(window, 'load', _updateDownloadCartUI);

// Public methods
function getDownloadCart() {

    var encStateValue = Ext.state.Manager.get( "AggregationItems" );

    return encStateValue ? Ext.decode( encStateValue ) : [];
}

function getDownloadCartSize() {
    
    return getDownloadCart().length
}

function addToDownloadCart(title, type, href, protocol) {
    
    var cart = getDownloadCart();
    
    var maxFiles = Portal.app.config.downloadCartMaxNumFiles
    
    if ( cart.length < maxFiles ) {
        
        cart.push( {title: title,
                    type: type,
                    href: href,
                    protocol: protocol} );
            
        _setDownloadCart( cart );
    }
    
    _updateDownloadCartUI();
}

function clearDownloadCart() {
    
    _setDownloadCart( [] );
    _updateDownloadCartUI();
}

// Internal methods
function _setDownloadCart(newCart) {
    
    var encStateValue = Ext.encode( newCart );

    Ext.state.Manager.set( "AggregationItems", encStateValue );
}

function _updateDownloadCartUI() {
   
   var cartEl = Ext.get('downloadCart');
   var cartSizeEl = Ext.get('downloadCartSize');
   
   var size = getDownloadCartSize();
   
   cartSizeEl.update( size + '' );
   
   if ( size == 0 ) {
       
       cartEl.addClass('emptyCart');
   }
   else {
       cartEl.removeClass('emptyCart');
   }
   
   // Animate UI
   cartEl.animate(
        // animation control object
        {
            backgroundColor: { from: '#FFFFCC',
                                 to: _getDownloadCartUIOriginalColor() }
        },
        0.7,       // animation duration
        null,      // callback
        'easeOut', // easing method
        'color'    // animation type ('run','color','motion','scroll')
    );
}

var _downloadCartOriginalColor;
function _getDownloadCartUIOriginalColor() {
    
    if ( _downloadCartOriginalColor == undefined ) {
        
        _downloadCartOriginalColor = Ext.get('downloadCart').getStyles('backgroundColor').backgroundColor;
    }
    
    return _downloadCartOriginalColor;
}