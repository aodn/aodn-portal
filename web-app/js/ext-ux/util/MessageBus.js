/** 
 * Licensed under GNU LESSER GENERAL PUBLIC LICENSE Version 3 
 * 
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de> 
 * @url http://www.siteartwork.de/MessageBus 
 */  

Ext.namespace('Ext.ux.util');
 
/** 
 * @class Ext.ux.util.MessageBus
 *
 * A MessageBus mediates messages between components which are not state aware. 
 * For example, a component may send messages in a frequent interval, but it may not be
 * initialized to the time its transceivers are initialized. Since the transceivers are
 * not aware of the state of the sender, they simply subscribe to a broker and get
 * notified when the sender starts publishing its messages for which they have registeres.
 * Each message is being tagged by the senders with a subject.
 *
 * <code> 
    // calls the specified function any time a message with the subject 'telegram' 
    // is published
    Ext.ux.util.MessageBus.subscribe(
        'telegram', 
        function(subject, message) {
            alert("Received message from Broadcaster. Subject is \""+subject+"\"");    
        } 
    ); 
    
    var subject = 'telegram';
    var message = {
        sender : "ts@siteartwork.de",
        body   : "This is a message sent using Ext.ux.util.MessageBus"
    };
    // sends a message with the subject 'telegram' using the MessageBus
    Ext.ux.util.MessageBus.publish(subject, message);
</code>
 * 
 */
Ext.ux.util.MessageBus = function(){
	
    var _subscribedListeners = {};

    var _publish = function(subject, message)
    {
        if (!_subscribedListeners[subject]) {
            return;
        }          
        
        var subs = _subscribedListeners[subject];
        var cb, sc;
        for (var i = 0, len = subs.length; i < len; i++) {
            cb = subs[i].callback;
            sc = subs[i].scope;
            
            cb.call(sc, subject, message); 
        }    
        
    };
    
    var _findTransceiver = function(subject, callback, scope) 
    {
        var index = -1;
        var subs  = _subscribedListeners[subject];
        
        for (var i = 0, len = subs.length; i < len; i++) {
            if (subs[i].callback == callback && subs[i].scope == scope) {
                index = i;
                break;    
            }    
        }
        
        return index;
    };
    
    var _subscribe = function(subject, callback, scope)
    {
        if (!_subscribedListeners[subject]) {
            _subscribedListeners[subject] = []; 
        }
       
        if (_findTransceiver(subject, callback, scope) != -1) {
            return false;    
        }
        
        _subscribedListeners[subject].push({
            callback : callback,
            scope    : scope
        });
        
        return true;
    };

    var _unsubscribe = function(subject, callback, scope)
    {
        var index = _findTransceiverForSubject(subject, callback, scope);
        if (index == -1) {
            return false;
        }
                        
        _subscribedListeners[subject].splice(index, 1);            
        
        return true;
    };

    return {
        
        /**
         * Publishes a message to all receivers who are subscribed to the
         * given subject.
         *
         * @param {String} subject  
         * @param {Object} message
         *
         */
        publish : function(subject, message)
        {
            _publish(subject, message);
        },
        
        /**
         * Subscribes an object to messages tagged with the specified subject. 
         * The callback gets called whenever a message is published using the specified subject.
         * If the scope is specified and the scope is of type {@see Ext.util.Observable},
         * the method will look up the "destroy" event in the events list of "scope".
         * If the event is found, the method will add a listener to unsubscribe
         * automatically from the Broadcaster so it does not receive any messages after
         * the "destroy" event has been fired.
         *
         * @param {String} subject
         * @param {Function} callback
         * @param {Object} scope
         *
         * @return {Boolean} true if the callback along with the scope were not already subscribed
         * for the specfied subject, otherwise false
         */
        subscribe : function(subject, callback, scope)
        {
            var subscribed = _subscribe(subject, callback, scope);
            
            if (subscribed && scope && scope.events && scope.events['destroy']) {
                scope.on('destroy', function() {
                    this.unsubscribe(subject, callback, scope);
                }, this);    
            }
            
            return subscribed;
        },
            
        /**
         * Unsubscribes an callback for the specified subject. The callback will
         * not be notified of any messages represented by the specified
         * subject anymore.
         *
         * @param {String} subject
         * @param {Object} callback
         * @param {Object} scope
         *
         * @return {Boolean} true if the callback and the scope for the specified callback
         * has been found and was removed, otherwise false
         */
        unsubscribe : function(subject, callback, scope)
        {
            return _unsubscribe(subject, callback, scope);
        }
        
    };
	
}(); 

/**
 * Shorthand for {@link Ext.ux.util.MessageBus}
 */
Ext.MsgBus = Ext.ux.util.MessageBus;