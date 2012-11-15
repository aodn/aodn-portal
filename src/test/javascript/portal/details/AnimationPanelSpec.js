describe("Portal.details.AnimationPanel", function() {
	
	var animationPanel = new Portal.details.AnimationPanel();
	var startDatePicker = new Ext.form.DateField({
				format : 'd-m-Y',
				value : '06-06-2007'
			});
	
	describe("_onDateSelected", function() {
		animationPanel.startDatePicker = startDatePicker;
		
		it("should, if there is only one date available, select it", function() {
			var a = "AHH";	
			var allTimes = new Array();
			allTimes['2006-06-06'] = new Array();
			
			allTimes['2006-06-06'][0] = new Array();
			allTimes['2006-06-06'][0][0]="13:18:00 (+10:00)"
			allTimes['2006-06-06'][0][1]="13:20:00 (+10:00)"
			
			animationPanel.allTimes =allTimes;	
			
			animationPanel._onDateSelected(startDatePicker, Date.parseDate("06-06-2006", 'd-m-Y'));
			console.log(animationPanel.startTimeCombo);
			expect(animationPanel.startTimeCombo.value).toBe("13:18:00 (+10:00)");
		});
	});
});