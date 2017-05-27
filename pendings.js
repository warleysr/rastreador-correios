var BASE_URL = "http://www2.correios.com.br/sistemas/rastreamento/resultado_semcontent.cfm";

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
	  		    	div.innerHTML = "<form id='" + element + "' action='" + BASE_URL + "' method='POST' target='_blank'>" 
                              + "<input type='hidden' name='Objetos' value='" + element + "'>" 
                              + "<b><a href='#' class='redirect'>" + element + "</a></b> (" 
                              + data[element] + ")<br><br>";
	  				main.appendChild(div);
	  				has = true;
	  		    });
	  		}
  		    var extra = document.createElement('div');
  		    if (has) {
  		    	extra.innerHTML = "<b>Clique nos links acima para acompanhar!</b><br><br>";

            var links = document.getElementsByClassName('redirect');
            for(var i = 0; i < links.length; i++) {
                var link = links[i];
                link.onclick = function() {
                  var id = link.text;
                  document.getElementById(id).submit();
                }
            }
  		    } else {
  		    	extra.innerHTML = "<b>Nenhuma notificação pendente!</b><br><br>";
  		    }
  		    main.appendChild(extra);
  	});

  	chrome.storage.local.remove('PENDINGS', function(){});
}