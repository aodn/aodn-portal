Ext.namespace('Portal.search');

Portal.search.ResultsPanel = Ext.extend(Ext.Panel, {
   startRecord: 1,
   hitsPerPage: 20,
   layout: 'fit',
   border: true,
   autoScroll: true,
   cls: 'p-results-panel',
   
   initComponent: function() {
      this.previousAction = new Ext.Action({
            disabled: true,
            text: '<< Previous',
            handler: this.previousActionExecute,
            scope: this
         });

      this.nextAction = new Ext.Action({
          disabled: true,
          text: 'Next >>',
          handler: this.nextActionExecute,
          scope: this
       });
      
      this.cursorText = new Ext.Toolbar.TextItem({
         cls: 'p-cursor-text',
         text: '(0-0/0)'
      });

      //TODO: Use paging toolbar instead?
      
      this.bbar = new Ext.Toolbar({
         items: [this.previousAction, ' ', this.nextAction, ' ', this.cursorText]
      });

      this.items = {
         ref: 'resultsView',
         store: this.store,
         xtype: 'portal.search.resultsview',
      };
      
      Portal.search.ResultsPanel.superclass.initComponent.call(this);

      this.mon(this.store, {
         scope: this,
         datachanged: this.storeDataChanged
      });
      
      this.addEvents('previousPage', 'nextPage');
      
   },
   
   previousActionExecute: function() {
      this.fireEvent('previousPage');
   },
   
   nextActionExecute: function() {
      this.fireEvent('nextPage');
   },
   
   storeDataChanged: function() {
      var endRecord = this.startRecord + this.store.getCount() - 1;
      this.nextAction.setDisabled( endRecord == this.store.getTotalCount());
      this.previousAction.setDisabled(this.startRecord == 1);
      this.cursorText.setText('(' + this.startRecord + '-' + endRecord + '/' + this.store.getTotalCount() + ')');
   }
});

Ext.reg('portal.search.resultspanel', Portal.search.ResultsPanel);
