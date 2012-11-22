
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.field.BoundingBox", function() {
  
  var testWindow;
  
  beforeEach(function() {
    testWindow = new Ext.Window();
  });
  
  afterEach(function() {
    testWindow.close();
  });
  
  it("should fire bboxchange event when co-ordinates are changed by the user", function() {
    var bboxField = new Portal.search.field.BoundingBox();
    
    testWindow.add(bboxField);
    testWindow.show();
    
    bboxField.setBox({northBL: -22, westBL: -55, eastBL: -20, southBL: -25});
    
    spyOn(bboxField, 'fireEvent');
    
    bboxField.northBL.setValue(-44);
    bboxField.northBL.onBlur();
    
    expect(bboxField.fireEvent).toHaveBeenCalled();
  });
});
