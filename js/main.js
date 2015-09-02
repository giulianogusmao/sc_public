var ajax = $.ajax(),
	resMonitorGr = 1200,
	resMonitor = 979,
	resTablet = 767,
	resCel = 480,
	res = {};

$(function(){
	// start
	init();

	/* ============================================================================================= */
	// Ações links - impede que links em branco resetem scroll
	/* ============================================================================================= */
	$(document).on("click", "[href='#']", function(event) {
	    event.preventDefault();
	});
	$(document).on("click", "a[disabled]", function(event) {
	    event.preventDefault();
	});
	/* --------------------------------------------------------------------------------------------- */
	

	/* ============================================================================================= */
	// Ações keydown - dispara evento pressionando enter
	/* ============================================================================================= */
	$("[data-enter]").on("keydown", function(e) {
		if(e.which == 13) {
			e.preventDefault();
			target = $(this).data("enter");
			$("#"+target).trigger('click');
			__doPostBack(target,'');
		}
	});
	/* --------------------------------------------------------------------------------------------- */


	/* ============================================================================================= */
	// Botão com data-loading
	/* ============================================================================================= */
    $(document).on('click','[data-loading-text]',function() {
        var bt = $(this);

        if(!bt.attr('disabled')){ // desativa clique com botao desativado
	        if(!bt.hasClass('loading')) { // desativa botao 
	            bt.btnLoadingOff();
	        } else {
	            bt.btnLoadingOn(); // ativa botao 
	        }
	    }
    });
	/* --------------------------------------------------------------------------------------------- */


	// start - set configuracoes iniciais
	function init() {
		res = resolucao();

		// add tooltip
	    $(".tool-title").each(function(i, obj){
	        txt = $(obj).find('b').html();
	        $(obj).attr({ rel:'tooltip', title:txt });
	    });

		// ativa tooltips
		$("[rel='tooltip']").tooltip('show').tooltip('hide');
	}

    /* ============================================================================================= */
    // Ações Checkbox


    	$(document).on("change", "[data-sel-all]", function() {
    		var selector = $(this).attr('data-sel-all');
            ( this.checked ) ? $(selector).prop('checked',true) : $(selector).prop('checked',false);
    	});

    	$(document).on('change', $("[data-sel-all]").attr("[data-sel-all]") ,function() {
    		// verSelTudo(this);
    	});
});

function getEnderecoNovo(campo, btn) {
	cep = $(campo.cep).val() || $(campo).val();

    ajax.abort();
    ajax = $.ajax({
    	method: 'GET',
        url: 'viewCep.aspx?cep='+ cep,
        // dataType: 'script',
        beforeSend: function(){
            // begin ajax; start icon-refresh
            $(btn).btnLoadingOff();
        },
        complete: function(data){
            // end ajax; stop icon-refresh
            $(btn).btnLoadingOn();
        },
        success: function(data){
        	eval("var data = " + data);
        	if(data.found == 1)
        		showEnderecoNovo(data, campo);
        	else
        		this.error();
        },
        error: function(){
            try {
            	$(campo).showMsg('Ops, Não foi possível obter o endereço apartir deste CEP.<br>Verifique o CEP inserido ou informe o endereço manualmente.');
            } catch(e) {}
        }
    });
}

function showEnderecoNovo(data, json) {
	// obtem estado e sigla
	data = getUf(data);

	// config campos padrão
    var campos = {
        cep: '#txtPAC_CEP',
        rua: '#txtPAC_END',
        bairro: '#txtPAC_BAIRRO',
        cidade: '#txtPAC_CIDADE',
        uf: '#cboPAC_UF'
    };

    // Substitui por novos campos
    if (json) { $.extend(campos, json); }

    // preenche campos
	try {
		$(campos.rua).val(data.rua);       // set Rua
	} catch(e) {}
	try {
		$(campos.bairro).val(data.bairro); // set Bairro
	} catch(e) {}
	try {
		$(campos.cidade).val(data.cidade); // set Cidade
	} catch(e) {}
	try {
		$(campos.uf + ' option').each(function(i, obj){ // set Estado
			if(obj.text == data.sigla || obj.text == data.estado ) {
				$(obj).prop('selected',true);
				return false;
			}
		});
	} catch(e) {}
}

function resolucao() {

    var w = window,
    	e = document.documentElement,
        g = document.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
		y = w.innerHeight || e.clientHeight || g.clientHeight;

	var m = (x >  resMonitor) ? "monitor" :
			(x >  resCel) ? "tablet" : "phone";

    return { media: m, width: x, height: y };
}

// Liga btn-loading: desbloqueia botao e retira classe loading
$.fn.btnLoadingOn = function() {
	this.removeClass('loading');
	this.button('reset');
}
// Desliga btn-loading: bloqueia botao e adiciona class loading
$.fn.btnLoadingOff = function(time) {
	var b = this,
		t = time || this.attr('data-loading-time') || 5000;

	b.addClass('loading');
	b.button('loading');
	setTimeout(function() { b.btnLoadingOn(); }, t);
}

// Set sigla e estado para encontrar em qualquer lista
function getUf(data) {
	try {
		find = data.uf;
	} catch(e) {
		find = data;
	}

	var estados = [
			{ sigla: 'AC', estado: 'Acre' },
			{ sigla: 'AL', estado: 'Alagoas' },
			{ sigla: 'AP', estado: 'Amapá' },
			{ sigla: 'AM', estado: 'Amazonas' },
			{ sigla: 'BA', estado: 'Bahia' },
			{ sigla: 'CE', estado: 'Ceará' },
			{ sigla: 'DF', estado: 'Distrito Federal' },
			{ sigla: 'ES', estado: 'Espírito Santo' },
			{ sigla: 'GO', estado: 'Goiás' },
			{ sigla: 'MA', estado: 'Maranhão' },
			{ sigla: 'MT', estado: 'Mato Grosso' },
			{ sigla: 'MS', estado: 'Mato Grosso do Sul' },
			{ sigla: 'MG', estado: 'Minas Gerais' },
			{ sigla: 'PA', estado: 'Pará' },
			{ sigla: 'PB', estado: 'Paraíba' },
			{ sigla: 'PR', estado: 'Paraná' },
			{ sigla: 'PE', estado: 'Pernambuco' },
			{ sigla: 'PI', estado: 'Piauí' },
			{ sigla: 'RJ', estado: 'Rio de Janeiro' },
			{ sigla: 'RN', estado: 'Rio Grande do Norte' },
			{ sigla: 'RS', estado: 'Rio Grande do Sul' },
			{ sigla: 'RO', estado: 'Rondônia' },
			{ sigla: 'RR', estado: 'Roraima' },
			{ sigla: 'SC', estado: 'Santa Catarina' },
			{ sigla: 'SP', estado: 'São Paulo' },
			{ sigla: 'SE', estado: 'Sergipe' },
			{ sigla: 'TO', estado: 'Tocantins' },
		];

	$.each(estados, function(i, obj) {
		if(obj.sigla == find || obj.estado == find) {
			data.sigla = obj.sigla;
			data.estado = obj.estado;
			return data;
		}
	});

	return data;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};