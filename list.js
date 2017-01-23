var BASE_URL = "http://websro.correios.com.br/sro_bin/txect01$.ResultList?P_LINGUA=001&P_ITEMCODE=";

window.onload = function() {
	chrome.storage.local.get(null, function(data) {
		var keys = Object.keys(data);
		var has = false;
		var i = 0;
		keys.forEach(function(element, index, array) {
			if (element === 'PENDINGS') return;
			if (element.endsWith('_size')) return;

			has = true;

			var div = document.createElement("div");
			div.innerHTML = "<b><a href='" + BASE_URL + element + "' target='_blank'>" 
			+ element + "</a></b> (" + data[element] + ") <button class='btn'>DELETAR</button><br><br>";

			document.getElementById("main").appendChild(div);

			var btn = document.getElementsByClassName('btn')[i];
			btn.onclick = function() {
				chrome.storage.local.remove(element, function() {
					location.reload();
				});
			}
			i++;
		});
		if (!(has)) {
			var div = document.createElement("div");
			div.innerHTML = "<b>Nenhum código adicionado. Adicione clicando no ícone da extensão.</b><br><br>";
			document.getElementById("main").appendChild(div);
		}
	});
}