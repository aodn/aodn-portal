Ext.namespace('Portal.common');

Portal.common.BrowserWindow = {
    percentAvailHeight: 80,
    widthHeightRatio: 1.33,
    
    open: function(url) {
      var height = screen.availHeight * this.percentAvailHeight / 100;
      var width = height * this.widthHeightRatio;
      var left = parseInt((screen.availWidth/2) - (width/2));
      var top = parseInt((screen.availHeight/2) - (height/2));
      
      var windowFeatures = "width=" + width + ",height=" + height + ",toolbar,resizable,scrollbars,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
      
      window.open(url, '_blank', windowFeatures);
    }
};

