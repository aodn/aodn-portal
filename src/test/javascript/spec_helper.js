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
}

beforeEach(function() {
    this.addMatchers({
        toBeSame: function(expected) {

            if (this.actual instanceof Array && expected instanceof Array) {
                if (this.actual.length != expected.length) {
                    return false;
                }

                var equal = true;
                for (var i = 0; i < expected.length; i++) {
                    if (this.actual[i] != expected[i]) {
                        equal = false;
                    }
                }

                return equal;
            }
            return moment(this.actual).isSame(moment(expected));   // moment.js#isSame()
        },

        toBeInstanceOf: function(expected) {
            return this.actual instanceof expected;
        }
    });
});
