/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

var log = log4javascript.getLogger();

var ajaxAppender = new log4javascript.AjaxAppender(BASE_URL + '/system/clientLog');
log.addAppender(ajaxAppender);
