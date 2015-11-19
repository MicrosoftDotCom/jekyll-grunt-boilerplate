//
// UHF SDK
//--------------------------------------

var UHF = (function() {

	// default config values
	var uhf_config = {
		version: "V3",
		partner_id: "retailstore",
		header_id: "OneStoreSharedHeader",
		footer_id: "MainFooter",
		locale: "en-us",
		//url: "http://unistoreshellservice-int.www.microsoft.com/{{ locale }}/shell/XML/",
		url: "http://unistoreshellservice-www-microsoft-com-w6cr07yyif8d.runscope.net/{{ locale }}/shell/XML/"
	};

	// current data
	var uhf_data = { 'css': '', 'js': '', 'header': '', 'footer': '' };

	// build url
	var buildURL = function(version, locale, partner_id, header_id, footer_id) {
		//
		return uhf_config.url.replace(/{{ locale }}/g, locale) + version + '/' + partner_id + '?headerId=' + header_id + '&footerId=' + footer_id;
	};

	// public methods
	return {

		//
		load: function(params) {
			// build URL
			var uhf = this,
					params = params || {},
					version = params.version || uhf_config.version,
					locale = params.locale || uhf_config.locale,
					partner_id = params.partner_id || uhf_config.partner_id,
					header_id = params.header_id || uhf_config.header_id,
					footer_id = params.footer_id || uhf_config.footer_id,
					url = buildURL(version, locale, partner_id, header_id, footer_id);

			// retrieve XML
			$.get(url, function(data) {
				var oSerializer = new XMLSerializer(),
						parser = new DOMParser(),
						sXML = parser.parseFromString(oSerializer.serializeToString(data), "text/xml");

				//console.log(sXML.getElementsByTagName("cssIncludes")[0].childNodes[1].nodeValue);
				uhf_data.css = sXML.getElementsByTagName("cssIncludes")[0].childNodes[1].nodeValue;
				uhf_data.js = sXML.getElementsByTagName("javascriptIncludes")[0].childNodes[1].nodeValue;
				uhf_data.header = sXML.getElementsByTagName("headerHtml")[0].childNodes[1].nodeValue;
				uhf_data.footer = sXML.getElementsByTagName("footerHtml")[0].childNodes[1].nodeValue;

				//console.log(uhf_data);

				// inject CSS
				$('head').append(uhf_data.css);

				// inject JS
				$('head').append(uhf_data.js);

				// insert header
				$('uhf_header').css({'height':'48px', 'display':'block'}).html(uhf_data.header);

				// insert footer
				$('uhf_footer').css({'height':'69px', 'display':'block'}).html(uhf_data.footer);

			});
		}

	};

})();