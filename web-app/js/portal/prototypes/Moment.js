/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
moment().constructor.prototype.toUtcDisplayFormat = function() {
    return this.format('YYYY-MM-DD HH:mm:ss:SSS UTC');
}
