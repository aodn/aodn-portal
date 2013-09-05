/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.MessageBox.alert = function () {
};

//overwrite Ext.Ajax.request so it doesn't try to make requests.
Ext.Ajax.request = function(options) {
};

beforeEach(function() {
    this.addMatchers({
        toBeSame: function(expected) {

            var notText = this.isNot ? " not" : "";
            var actualText = this.actual ? moment(this.actual).format() : this.actual;
            var expectedText = expected ? moment(expected).format() : this.expected;

            this.message = function() {
                return "Expected " + actualText + notText + " to be same as " + expectedText;
            };

            if (this.actual instanceof Array && expected instanceof Array) {
                if (this.actual.length != expected.length) {
                    return false;
                }

                var equal = true;
                for (var i = 0; i < expected.length; i++) {
                    if (!this.actual[i].isSame(expected[i])) {
                        equal = false;
                    }
                }

                return equal;
            }
            return moment(this.actual).isSame(moment(expected));   // moment.js#isSame()
        },

        toBeInstanceOf: function(expected) {
            return this.actual instanceof expected;
        },

        toStartWith: function(expected) {
            return this.actual.indexOf(expected) == 0;
        }
    });
});
