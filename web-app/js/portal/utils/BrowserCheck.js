function browserCheck() {
	var supported = false; // exclusive
	var isChrome = !!window.chrome;
	var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0

	var agent = navigator.userAgent.toLowerCase();
	var isIOS = /(ipad|iphone|ipod)/g.test(agent);
	var isAndroid = (agent.indexOf("android") > -1 && agent.indexOf("mobile") > -1);

	if (isChrome || isFirefox ) {  supported = true; }
	if (isIOS || isAndroid)     { supported = false;}

	if (!supported) {
	    alert('Your browser or device is unsupported and may not work with this site. \nPlease use Chrome or Firefox on a later generation Windows PC, Linux or Macbook/iMac for the best experience.');
    }
}
