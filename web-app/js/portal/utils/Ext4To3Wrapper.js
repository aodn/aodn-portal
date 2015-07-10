Ext4.createWrapped = function(name, args) {

    // This is just to get the title (if there is one).
    var tmp = Ext4.create(name, args);

    var ext3Wrapper = new Ext.Container({
        autoHeight: true,
        title: tmp.title
    });

    ext3Wrapper.on('render', function() {
        args.renderTo = ext3Wrapper.el;
        Ext4.create(name, args);
    });

    return ext3Wrapper;
};
