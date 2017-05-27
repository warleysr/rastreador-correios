var BASE_URL = "http://www2.correios.com.br/sistemas/rastreamento/resultado_semcontent.cfm";

checkPendings();

setInterval(checkUpdates, 60000);

function checkUpdates() {
	chrome.storage.local.get(null, function(data) {
		var keys = Object.keys(data);

		keys.forEach(function(element, index, array) {
			if (element === 'PENDINGS') return;
			if (element.endsWith('_size')) return;

			var key = element;

			fetch(BASE_URL, {  
				method: 'POST',
				headers: {'Content-Type':'application/x-www-form-urlencoded'}, 
				body: 'Objetos=' + key
			})
			.then(function(response) {
				return response.text();
			})
			.then(function(responseText) {
				var parser = new DOMParser();

				var doc = parser.parseFromString(responseText, "text/html");

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

						setPending(key);

						chrome.notifications.onClicked.addListener(function(notificationId) {
							if (notificationId == key) {
								window.open('pendings.html');
							}
						});
					}
				});
			});
		});
	});
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
