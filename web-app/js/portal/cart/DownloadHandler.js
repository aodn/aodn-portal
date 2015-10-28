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

    canEstimateDownloadSize: function() {

        return false;
    },

    getDownloadEstimateParams: function() {

        throw "Should be implemented by sublasses which return 'true' for canEstimateDownloadSize()";
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
        handlers = handlers.concat(this._handlersForLink(link));
    }, this);

    return handlers;
};

Portal.cart.DownloadHandler._handlersForLink = function(link) {
    var handlers = [];

    var constructors = this._downloadHandlerConstructorForProtocol(link.protocol);
    Ext.each(constructors, function(constructor) {
        handlers.push(
            new constructor(link)
        );
    });
    return handlers;
};

Portal.cart.DownloadHandler._downloadHandlerConstructorForProtocol = function(protocol) {
    var mapping = {
        'OGC:WFS-1.0.0-http-get-capabilities': [
            Portal.cart.WfsDownloadHandler,
            Portal.cart.PythonDownloadHandler
        ],
        'IMOS:AGGREGATION--bodaac': Portal.cart.BodaacDownloadHandler,
        'IMOS:AGGREGATION--gogoduck': Portal.cart.GogoduckDownloadHandler,
        'OGC:WPS': Portal.cart.WpsDownloadHandler
    };

    return mapping[protocol] || [];
};
