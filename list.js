var BASE_URL = "http://www2.correios.com.br/sistemas/rastreamento/resultado_semcontent.cfm";

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
			div.innerHTML = "<form id='" + element + "' action='" + BASE_URL + "' method='POST' target='_blank'>" 
							+ "<input type='hidden' name='Objetos' value='" + element + "'>" 
							+ "<b><a href='#' class='redirect'>" + element + "</a></b> (" 
							+ data[element] + ") <button class='btn'>DELETAR</button><br><br>";

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
		var links = document.getElementsByClassName('redirect');
        for(var i = 0; i < links.length; i++) {
            var link = links[i];
            link.onclick = function() {
            	var id = link.text;
            	document.getElementById(id).submit();
            }
        }
	});
}