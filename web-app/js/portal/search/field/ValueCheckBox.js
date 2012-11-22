
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search.field');

Portal.search.field.ValueCheckBox = Ext.extend(Ext.form.Checkbox, {
  
  // Return configured checkedValue or uncheckedValue instead of true/false
  getValue: function() {
    var checked = Portal.search.field.ValueCheckBox.superclass.getValue.call(this);
    
    return checked ? this.checkedValue : this.uncheckedValue;
  },
 
   getFilterValue: function () {
     return { value: this.getValue()};
   },
   
   setFilterValue: function(v) {
     var checked = (v.value == this.checkedValue);
     
     this.setValue(checked);
   }
});

Ext.reg('portal.search.field.valuecheckbox', Portal.search.field.ValueCheckBox);

