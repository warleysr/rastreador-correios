var BASE_URL = "http://websro.correios.com.br/sro_bin/txect01$.ResultList?P_LINGUA=001&P_ITEMCODE=";

checkPendings();

setInterval(checkUpdates, 60000);

function checkUpdates() {
	chrome.storage.local.get(null, function(data) {
		var keys = Object.keys(data);

		keys.forEach(function(element, index, array) {
			if (element === 'PENDINGS') return;
			if (element.endsWith('_size')) return;

			var key = element;

			var xhr = createCORSRequest("GET", BASE_URL + key);

			xhr.onload = function() {
				var response = xhr.responseText;

				var parser = new DOMParser();

				var doc = parser.parseFromString(response, "text/html");

				var tables = doc.getElementsByTagName('td');

				var sizeKey = key + "_size";

				chrome.storage.local.get([key, sizeKey], function(data) {
					var iden = data[key];
					var size = data[sizeKey];

					if (size != tables.length) {
						var obj = {}
						obj[sizeKey] = tables.length;
						chrome.storage.local.set(obj, function(){});

						var opt = {
							type: "basic",
							title: "Boas notícias!",
							message: "\"" + iden + "\" está cada vez mais próximo!\nClique aqui para visualizar.",
							iconUrl: "icon.png"
						}
						chrome.notifications.create(key, opt);

						chrome.notifications.onClicked.addListener(function(notificationId) {
							// REMOVE PENDINGS
							chrome.storage.local.get('PENDINGS', function(data) {
								var str = data['PENDINGS'];
								var keys = str.split(',');
								var str = '';

								keys.forEach(function(element, index, array) {
									if (element.length != 13) return;
									if (element === key) return;
									str += element + ',';
								});

								chrome.storage.local.set({'PENDINGS': str}, function(){});

								if (str.length === 0) {
									var ba = chrome.browserAction;
									ba.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
  									ba.setBadgeText({text: ''});
								}
							});
				
							if (notificationId == key) {
								window.open(BASE_URL + key);
							}
						
						});

						setPending(key);
					}
				});
			}

			xhr.send();
		});
	});
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}

function setPending(key) {
  chrome.storage.local.get('PENDINGS', function(data) {
  	var current = data['PENDINGS'];
  	var str = '';
  	if (typeof current !== 'undefined') {
  		str = current;
  	}
  	str += key + ",";
  	chrome.storage.local.set({'PENDINGS': str}, function(){});
  });
  var ba = chrome.browserAction;
  ba.setBadgeBackgroundColor({color: [232, 6, 6, 128]});
  ba.setBadgeText({text: '!'});
}

function checkPendings() {
	chrome.storage.local.get('PENDINGS', function(data) {
		var current = data['PENDINGS'];
  		if (typeof current != 'undefined') {
			if (current.length == 0) return;
  			var ba = chrome.browserAction;
  			ba.setBadgeBackgroundColor({color: [232, 6, 6, 128]});
  			ba.setBadgeText({text: '!'});
  		}
	});
}
