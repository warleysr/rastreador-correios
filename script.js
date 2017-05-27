var BASE_URL = "http://www2.correios.com.br/sistemas/rastreamento/resultado_semcontent.cfm";

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
			fetch(BASE_URL, {  
				method: 'POST',
				headers: {'Content-Type':'application/x-www-form-urlencoded'}, 
				body: 'Objetos=' + code
			})
			.then(function(response) {
				return response.text();
			})
			.then(function(responseText) {
				var parser = new DOMParser();

				var doc = parser.parseFromString(responseText, "text/html");

				var tables = doc.getElementsByTagName('td');

				if (tables.length > 0) {
					var obj = {}
					obj[code] = iden;
					obj[code + "_size"] = tables.length;
					chrome.storage.local.set(obj, function() {
						showInfo("Adicionado com sucesso!");
					});
				} else {
					showInfo("Este código não é válido!", true);
				}
			});
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