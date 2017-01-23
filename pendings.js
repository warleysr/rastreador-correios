var BASE_URL = "http://websro.correios.com.br/sro_bin/txect01$.ResultList?P_LINGUA=001&P_ITEMCODE=";

window.onload = function() {
	var ba = chrome.browserAction;
	ba.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
  	ba.setBadgeText({text: ''});

  	var main = document.getElementById('main');

  	chrome.storage.local.get(null, function(data) {
  		    var str = data['PENDINGS'];
  		    if (typeof str != 'undefined') {
	  		    var keys = str.split(',');
	  		    var has = false;
	  		    keys.forEach(function(element, index, array) {
	  		    	if (element.length != 13) return;
	  		    	var div = document.createElement('div');
	  		    	div.innerHTML = "<a href='" + BASE_URL + element + "' target='_blank'>" 
	  		    	+ element + "</a> (" + data[element] + ")<br><br>"
	  				main.appendChild(div);
	  				has = true;
	  		    });
	  		}
  		    var extra = document.createElement('div');
  		    if (has) {
  		    	extra.innerHTML = "<b>Clique nos links acima para ver as mudanças!</b><br><br>";
  		    } else {
  		    	extra.innerHTML = "<b>Nenhuma notificação pendente!</b><br><br>";
  		    }
  		    main.appendChild(extra);
  	});

  	chrome.storage.local.remove('PENDINGS', function(){});
}