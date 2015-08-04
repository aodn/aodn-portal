

var log = log4javascript.getLogger();

var ajaxAppender = new log4javascript.AjaxAppender('system/clientLog');
log.addAppender(ajaxAppender);
