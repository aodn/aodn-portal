/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.snapshot.SnapshotController", function() {
    
    var mockMap = {
        getExtent : function() {
            return new OpenLayers.Bounds(-40, -60, 110, 20);
        },
        layers : [ {
            grailsLayerId : 1,
            getVisibility : function() {
                return true;
            }
        } ],
        zoomToExtent : jasmine.createSpy()
    };

    // Mock required config settings
    Ext.namespace('Portal.app.config.currentUser');

    Portal.app.config.currentUser.id = 1;

    var snapshotController = new Portal.snapshot.SnapshotController({
        map : mockMap
    });

    it("creates snapshptController with a snapshot Proxy on instantiation", function() {
        expect(snapshotController.proxy).not.toEqual(undefined);
    });

    it("calls snapshot proxy remove method when deleteSnapshot is called", function() {
        spyOn(snapshotController.proxy, 'remove');

        snapshotController.deleteSnapshot(1, null, null);

        expect(snapshotController.proxy.remove)
                .toHaveBeenCalled();
    });

    it("calls proxy save method with snapshot when createSnapshot is called", function() {
        spyOn(snapshotController.proxy, 'save');

        snapshotController.createSnapshot('test snapshot save',
                null, null);

        expect(snapshotController.proxy.save)
                .toHaveBeenCalled();

        var snapshot = snapshotController.proxy.save.mostRecentCall.args[0];

        expect(snapshot.name).toEqual('test snapshot save');
        expect(snapshot.owner).toEqual(
                Portal.app.config.currentUser.id);
        expect(snapshot.minX).toEqual(-40);
        expect(snapshot.minY).toEqual(-60);
        expect(snapshot.maxX).toEqual(110);
        expect(snapshot.maxY).toEqual(20);
        expect(snapshot.layers.length).toEqual(1);
        expect(snapshot.layers[0].layer).toEqual(1);
        expect(snapshot.layers[0].hidden).toEqual(false);
    });

    it("calls proxy get method with id of snapshot to get when loadSnapshot is called", function() {
        spyOn(snapshotController.proxy, 'get');

        snapshotController.loadSnapshot(1, null, null);

        expect(snapshotController.proxy.get).toHaveBeenCalled();

        var snapshotId = snapshotController.proxy.get.mostRecentCall.args[0];

        expect(snapshotId).toEqual(1);
    });

    it("loads snapshot passed when onSuccessfulLoad is called",  function() {
        spyOn(snapshotController, 'fireEvent');
        spyOn(Ext.MsgBus, 'publish');

        var snapshotInstance = {
            id : 1,
            name : 'test snapshot',
            minX : -10,
            minY : -20,
            maxX : 10,
            maxY : 20,
            layers : [ {
                id : 101,
                hidden : false,
                opacity : 0.65,
                styles : "",
                layer : {
                    id : 301
                }
            } ]
        };

        snapshotController.onSuccessfulLoad(snapshotInstance);

        expect(snapshotController.fireEvent).toHaveBeenCalled();
        expect(
                snapshotController.fireEvent.mostRecentCall.args[0])
                .toEqual('snapshotLoaded');
        expect(mockMap.zoomToExtent).toHaveBeenCalled();
        expect(Ext.MsgBus.publish.mostRecentCall.args[0])
                .toEqual('addLayerUsingServerId');
        expect(Ext.MsgBus.publish.mostRecentCall.args[1].id)
                .toEqual(301);
    });

    // test for ncwms opacity problem
    it("doesn't set opacity if snapshot opacity is null", function() {
        spyOn(Ext.MsgBus, 'publish');
        var snapshotInstance = {
            id : 1,
            name : 'test snapshot',
            minX : -10,
            minY : -20,
            maxX : 10,
            maxY : 20,
            layers : [ {
                id : 101,
                hidden : false,
                opacity : null,
                styles : "",
                layer : {
                    id : 301
                }
            } ]
        };

        snapshotController.onSuccessfulLoad(snapshotInstance);

        var options = Ext.MsgBus.publish.mostRecentCall.args[1].layerOptions;

        expect(options.opacity).toBeUndefined();
    });

    // test for missing style problem 
    it("addSnapshotLayer calls Ext.MsgBus.publish with style in layerParams.styles", function() {
        spyOn(Ext.MsgBus, 'publish');
        var snapshotLayer = {
                id : 101,
                hidden : false,
                opacity : null,
                styles : "greyscale",
                layer : {
                    id : 301
                }
        };

        snapshotController.addSnapshotLayer(snapshotLayer);

        var params = Ext.MsgBus.publish.mostRecentCall.args[1].layerParams;

        expect(params.styles).toEqual("greyscale");
    });

    // test for opacity not saved problem

    it("getSnapshotLayer sets opacity from maplayer", function() {
        var mapLayer = {
                grailsLayerId: 1,
                opacity : 1.0,
                isBaseLayer: false,
                getVisibility: function() { return false; }
        }
                
        var snapshotLayer = snapshotController.getSnapshotLayer(mapLayer);

        expect(snapshotLayer.opacity).toEqual(1.0);
    });

});
