Ext.namespace('Portal.common.downloadCart');

Ext.EventManager.addListener( window, 'load', _updateCount );

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
    
    var maxFiles = Portal.app.config.downloadCartMaxNumFiles;
    
    if ( cart.length < maxFiles ) {
        
        var newEntry = {title: title,
                        type: type,
                        href: href,
                        protocol: protocol};
        
        // Add if it doesn't exists already
        if ( !_existsInCart( newEntry, cart ) ) {
            
            cart.push( newEntry );
            
            _setDownloadCart( cart );
        }
    }
    
    _updateCount();
    _flashUI();
}

function clearDownloadCart() {
    
    _setDownloadCart( [] );
    _updateCount();
    _flashUI();
}

// Internal methods
function _setDownloadCart(newCart) {
    
    var encStateValue = Ext.encode( newCart );

    Ext.state.Manager.set( "AggregationItems", encStateValue );
}

function _updateCount() {
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
}

function _flashUI() {
    
    var cartEl = Ext.get('downloadCart');
    
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
        
        _downloadCartOriginalColor = Ext.get('downloadCart').getStyles('backgroundColor').backgroundColor;
    }
    
    return _downloadCartOriginalColor;
}

function _existsInCart(entryToCheck, cart) {
    
    for ( var i = 0; i < cart.length; i++ ) {
        
        if ( _entryToString(cart[i]) === _entryToString(entryToCheck) ) {
            
            return true;
        }
    }
    
    return false;
}

function _entryToString(entry) {
    return entry.title + ' -- ' + entry.href + ' -- ' + entry.protocol + ' -- ' + entry.type;
}