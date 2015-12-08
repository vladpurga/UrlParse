/**
 * URL Parse
 * A quick URL parsing function for JavaScript
 * @version 0.4
 * @author Carl Saggs
 */
function urlParse(url){
	var self = {};
	//Store full url
	self.url = url;
	//Store Query String params
	self.QueryParams = {};
	//Use DOM to get URL basics
	self.a = document.createElement('a');
	if (/^(http|https|ftp|ftps|sftp):\/\//.test(url)) {
		self.a.href = url;
	} else {
		self.a.href = 'http://' + url.replace(/^.*:\/\//, '');
	}
	if (self.a.search.length) {
		//Parse Query String
		var q_seg = self.a.search.substring(1).split('&');
		for (var i = 0; i < q_seg.length; i++) {
			var s = q_seg[i].split('=');
			if (s[0]) {
				self.QueryParams[s[0]] = (s[1] || '');
			}
		}
	}
	//Extract the Port
	self.port = self.a.port || undefined; // url.split('/')[2].split(':')[1];
	
	//Return Protocol in use
	self.getProtocol = function(){
		return self.a.protocol;
	}
	//Return Host
	self.getHost = function(){
		return self.a.host.split(':')[0];//Remove the port from the end
	}
	//Return Port
	self.getPort = function(){
		//Assume default port if none is set
		return self.port || (self.getProtocol() == 'https:' ? 443 : 80);
	}
	//Return Path
	self.getPath = function(){
		return self.a.pathname;
	}
	//Get full Query String
	self.getQueryString = function(){
		return self.a.search;
	}
	//Build Query String from QueryParams
	self.buildQueryString = function(){
		var qs = '',
			params = [];
		for (var param in self.getQueryParams()) {
			params.push(param + '=' + self.getQueryParam(param));
		}
		if (params.length) {
			qs = '?' + params.join('&');
		}
		return qs;
	}
	//Get Query String as key=>value object
	self.getQueryParams = function(){
		return self.QueryParams;
	}
	//Get Query String as Array
	//@deprecated : Use getQueryParams instead
	self.getQueryArray = self.getQueryParams;
	//Get value of parameter in query string
	self.getQueryParam = function(x){
		return self.QueryParams[x];
	}
	//Get Fragment
	self.getFragment = function(){
		return self.a.hash.substring(1);//Remove # from start
	}
	//Return original URL
	self.getURL = function(){
		return self.url;
	}
	//Build URL by else parsed original URL
	self.buildURL = function(){
		var url = self.getProtocol() + '//' || 'http://';
		url += self.getHost() || '';
		url += self.port ? ':' + self.port : '';
		url += self.getPath() || '';
		url += self.buildQueryString();
		url += self.getFragment() ? '#' + self.getFragment() : '';
		return url;
	}
	//Drop any param
	self.dropQueryParam = function(name){
		if (self.QueryParams[name]) {
			delete self.QueryParams[name];
		}
	}
	//Add any param
	self.addQueryParam = function(name, value){
		// if (!self.QueryParams[name]) {
		self.QueryParams[name] = value;
		//}
	}
	
	//Return self
	return self;
}