var BASE_URL = "http://websro.correios.com.br/sro_bin/txect01$.ResultList?P_LINGUA=001&P_ITEMCODE=";

window.onload = function() {
	get('list').onclick = function() {
		window.open('list.html');
	}
	
	get('add').onclick = function() {
		var code = get('code').value.trim();
		var iden = get('iden').value.trim();

		if (code.length != 13) {
			showInfo("O código deve ter 13 caracteres!", true);
			return;
		}

		if (iden.length < 1) {
			showInfo("Informe um identificador!", true);
			return;
		}

		keyExists(code, function() {

			var xhr = createCORSRequest("GET", BASE_URL + code);

			xhr.onload = function() {
				var response = xhr.responseText;

				var parser = new DOMParser();

				var doc = parser.parseFromString(response, "text/html");

				var tables = doc.getElementsByTagName('td');

				if (tables.length > 0) {
					var obj = {}
					obj[code] = iden;
					obj[code + "_size"] = tables.length;
					console.log(obj);
					chrome.storage.local.set(obj, function() {
						showInfo("Adicionado com sucesso!");
					});
				} else {
					showInfo("Este código não é válido!", true);
				}
			}

			xhr.send();
		});
	}
}

function keyExists(key, callback) {
	chrome.storage.local.get(key, function(data) {
		var type = typeof data[key];
		if (type != "undefined") {
			showInfo("Este código já está adicionado!", true);
		} else {
			callback();
		}
	});
}

function get(id) {
	return document.getElementById(id);
}

function showInfo(msg, error = false) {
	var info = get('info');
	info.textContent = msg;
	info.style.display = "inline";

	if (error) {
		info.style.color = "red";
	} else {
		info.style.color = "green";
	}

	hideInfo();
}

function hideInfo() {
	setTimeout(function() {
		get('info').style.display = "none";
	}, 3000);
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