Ext.namespace('Portal.cart');

Portal.cart.DownloadHandler = Ext.extend(Object, {

    DATE_FORMAT_FOR_PORTAL: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
    DEFAULT_LAT_START: -90,
    DEFAULT_LAT_END: 90,
    DEFAULT_LON_START: -180,
    DEFAULT_LON_END: 180,
    DEFAULT_DATE_START: moment.utc({year: 1900}).startOf('year'),
    DEFAULT_DATE_END: moment.utc().endOf('day'),

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {
        throw 'Should be implemented by subclasses';
    },

    _resourceName: function() {

        return this.onlineResource.name;
    },

    _resourceNameNotEmpty: function() {

        var name = this._resourceName();

        return name && name != "";
    },

    _resourceHref: function() {

        return this.onlineResource.href;
    },

    _resourceHrefNotEmpty: function() {

        var href = this._resourceHref();

        return href && href != "";
    },

    _formatDate: function(date) {

        return date.format(this.DATE_FORMAT_FOR_PORTAL);
    }
});

Portal.cart.DownloadHandler.handlersForDataCollection = function(dataCollection) {
    var handlers = [];

    Ext.each(dataCollection.getAllLinks(), function(link) {
        Ext.each(this._handlersForProtocol(link.protocol), function(handler) {
            handlers.push({ 'handler': handler, 'link': link });
        }, this);
    }, this);

    handlers = this._applyHandlerPrecedence(handlers);
    return this._constructify(handlers);
};

Portal.cart.DownloadHandler._constructify = function(handlers) {
    constructedHandlers = [];
    Ext.each(handlers, function(handlerDescriptor) {
        constructedHandlers.push(new Portal.cart[handlerDescriptor.handler](handlerDescriptor.link));
    }, this);
    return constructedHandlers;
};

Portal.cart.DownloadHandler._applyHandlerPrecedence = function(handlers) {
    orderedHandlers = [];

    Ext.each(this._handlerOrder(), function(handler) {
        Ext.each(handlers, function(handlerDescriptor) {
            if (handler == handlerDescriptor.handler) {
                orderedHandlers.push(handlerDescriptor);
            }
        }, this);
    }, this);

    return orderedHandlers;
};

Portal.cart.DownloadHandler._handlersForProtocol = function(protocol) {
    var mapping = this._mappingFromConfig();

    return mapping[protocol] || [];
};

Portal.cart.DownloadHandler._protocolHandlerMapping = function() {
    return Portal.app.appConfig.portal.downloadHandlersForProtocol;
};

Portal.cart.DownloadHandler._handlerOrder = function() {
    if (!this.__handlerOrder) {
        var handlerOrder = [];

        Ext.each(this._protocolHandlerMapping(), function(obj) {
            handlerOrder.push(obj.handler);
        }, this);

        this.__handlerOrder = handlerOrder;
    }

    return this.__handlerOrder;
};

Portal.cart.DownloadHandler._mappingFromConfig = function() {

    if (!this.__mappingFromConfig) {
        var mapping = {};

        Ext.each(this._protocolHandlerMapping(), function(protocolMapping) {
            protocol = protocolMapping.protocol;
            handler = protocolMapping.handler;

            if (mapping[protocol] == undefined) {
                mapping[protocol] = [];
            }
            mapping[protocol].push(handler);
        }, this);

        this.__mappingFromConfig = mapping;
    }

    return this.__mappingFromConfig;
};
