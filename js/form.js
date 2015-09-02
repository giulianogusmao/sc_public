// GLOBAL
var classInvalid = "campo-invalid",
	ERRO = false;


// =================================================================================
// $(obj).validate();
// =================================================================================
$.fn.validate = function(json) {

	// vars
	var form = this,
		campos = json.campos;

	// adiciona atributos nos campos
	initCampos(json, campos);

	// add class validaform ao form e ao botao submit do form
	form.addClass('validaform').find('[type="submit"]').addClass('btn-validaform');


	// -----------------------------------------------------------------------------
	// set attributos
	function initCampos(json, campos) {
		$.each(campos, function(i, campo) {
			var obj = document.getElementById(i),
				arr = new Array();

			// verifica se campo existe
			if(obj) {
				$(obj).unvalidate().data("attrs", arr);

				// se for radio/checkbox não add atributos
				var type = verificaTipoCampo(obj);
				if(type != "radio" && type != "checkbox") {

					try { // set autocomplete default do campo
						if(!json.autocomplete || json.autocomplete != "off")
							$(obj).setAttr('autocomplete', 'on');

						// caso o campo tenha um prox definido, set campo prox
						if(type != "select") {
							var next = true;
							if(campo.next) 
								next = campo.next;
							else if(json.next === false) // set prox default do campo
								next = json.next;

							$(obj).setAttr("data-next", next);
						}
						
						// addiciona data-equalto
						if(campo.equalto)
							$(obj).setAttr("data-equal", campo.equalto);

						// add mascara no campo
						if(campo.mask)
							$(obj).setAttr('data-mascara', campo.mask);
					} catch(e){ 
						console.log('Erro initCampos(): '+e); 
					}
				}

				try { // set required
					if(json.required == true)
						$(obj).setAttr('required', 'required');
				} catch(e){}

				try { // set attributes
					$.each(campo.attr, function(attr, value) {
						$(obj).setAttr(attr, value);
					});
				} catch(e){}

				try { // set msgs
					$.each(campo.msg, function(data, value) {
						$(obj).setAttr("data-"+data, value);
					});
				} catch(e){}
			}
		});// $.each(campos)
	}// initCampos()

	aplicaMascara();

	return this;
};// .validate

// set attributos que auxiliam a validação do campo
$.fn.setAttr = function(attr, value) {
	try{
		// add atributo
		this.attr(attr, value);
		this.data("attrs").push(attr);
	}catch(e) {
		console.log('ERRO. -função: setAttr().\n-Mensagem: ' + e);
	}

	return this;
}

// remove todos os attributos criados para validar o campo
$.fn.unvalidate = function() {
	try {
		var obj = this,
			attrs = obj.data("attrs");

		if(Array.isArray(attrs)) {
			$.each(attrs, function(i, attr){
				obj.removeAttr(attr);
			});
		}
		obj.removeData("attrs");

	} catch(e) {
		console.log('ERRO. -função: unvalidate().\n-Mensagem: ' + e);
	}

	return this;
}


// =================================================================================
// $(obj).showMsg(); - adiciona msg-help
// =================================================================================
$.fn.showMsg = function(msg, settings) {
	this.removeMsg();

	// vars
    var helpAttr = { 
    	id: this.attr('id'),
    	name: this.attr('name'),
    	tipo: 'error',
    	classe: 'help-block',
    	title: 'Fechar mensagem'
    };

    if (settings) { $.extend(helpAttr, settings); }

    var help = '<span id="msg'+helpAttr.name+'" data-target="'+helpAttr.id+'" class="msg-help '+helpAttr.classe+'" title="'+helpAttr.title+'"> '+msg+'</span>';

    // add help
    this.closest('.control-group').addClass(helpAttr.tipo).data("msg-help", helpAttr.tipo);
    this.closest('.controls').append(help);
    // add class campo-invalid
    $("[name='"+this.attr("name")+"']").addClass(classInvalid);

    return this;
};// .showMsg


// =================================================================================
// $(obj).removeMsg(); - remove msg-help
// =================================================================================
$.fn.removeMsg = function() {
	// get group
	var pai = this.closest('.control-group');
	// remove class
	pai.removeClass(pai.data('msg-help'));
	// remove msg
	pai.find('.msg-help').remove();
	// remove class campo-invalid
	pai.find("."+classInvalid).removeClass(classInvalid);

	return this;
};// .removeMsg


$(function() {

	$("[autofocus]").focus();
	
	$("form")
		.attr('novalidate',true) // desativa validação HTML5
		.addClass('validaform')  // add class no form
		.find('[type="submit"]') // seleciona botao submit
		.addClass('btn-validaform'); // add class .btn-validaform

	// add class required
		$("[required]").after("<span class='before-required' title='Campo obrigatório.'>*</span>");

	// =============================================================================
	// VALIDAR FORMULARIO
	// -----------------------------------------------------------------------------
		// validar form quando clicar no botao .btn-validaform
		$(document).on('click', '.btn-validaform', function() {
			return validaform($(this).closest('form'));
		});

		// -----------------------------------------------------------------------------
		// validar form.validaform ou quando form conter botao.btn-validaform
		$('form.validaform').on('submit', function() {
			return validaform($(this));
		});

		// -----------------------------------------------------------------------------
		// valida formulario
		function validaform(form) {
			ERRO = false;

			// percorre todos os campos do formulario que será enviado
			form.find("input, select, textarea").each( function(i, obj) {
				var errocampo = false,
					type = verificaTipoCampo(obj);

				try {

					// valida campos em branco
					if($(obj).attr("required")) {
						errocampo = validaVazio(obj);
					}

					if(type != "radio" && type != "checkbox") {
						// verifica maxlength e minlength
						if(!errocampo)
							errocampo = validaLength(obj);

						// verifica se campo contem mesmo valor que sua referencia
						if(!errocampo && $(obj).attr("data-equal")) {
							errocampo = validaEqual(obj);
						}
						
						// verifica se campo esta preenchido incorretamente
						if(!errocampo) {
							errocampo = validaInvalid(obj);
						}
					}
				} catch(e){}
			});

			// seleciona primeiro campo invalido do formulario
			form.find("."+classInvalid).first().focus();

			return !ERRO;
		}// validaform()


		// -----------------------------------------------------------------------------
		// verifica se campo esta vazio
		function validaVazio(obj) {

			var type = verificaTipoCampo(obj),
				vazio = false;

			switch(type) {
				case "radio":
				case "checkbox":
			        if( $("[name='"+obj.name+"']:checked").length == 0 )
			            vazio = true;
			        break;		    
			    default:
		            if(obj.value == "" || obj.value == $(obj).attr('placeholder'))
		            	vazio = true;
		        	break;
			}

			if( vazio ) {
				ERRO = true;
				$(obj).showMsg(geraMsgRequired(obj, type));
			} else {
				$(obj).removeMsg();
			}

			return vazio;
		}// validaVazio()


		// -----------------------------------------------------------------------------
		// verifica se campo esta preenchido de forma incorreta
		function validaInvalid(obj) {
			var errocampo = false;

			if($("#"+obj.id+":invalid").length) {
				ERRO = errocampo = true;
				var msg = "";
				msg = $(obj).data('pattern');

				$(obj).showMsg("Campo preechido incorretamente. "+((msg) ? "<br>"+msg : ""));
			}

			return errocampo;
		}// validaInvalid()


		// -----------------------------------------------------------------------------
		// verifica a quantidade de caracteres do campo
		function validaLength(obj) {
			var errocampo = false,
				msg = $(obj).data('length'),
				qtd = $(obj).val().length,
				min = $(obj).attr('minlength'),
				max = $(obj).attr('maxlength');

			if(obj.value != $(obj).attr('placeholder')) {
				if(qtd > 0 && qtd < min) {
					ERRO = errocampo = true;
					$(obj).showMsg("Campo deve conter pelo menos "+min+" caracteres."+((msg) ? "<br>"+msg : ""));
				}else if(obj.value.length > max) {
					ERRO = errocampo = true;
					$(obj).showMsg("Campo deve conter no máximo "+max+" caracteres."+((msg) ? "<br>"+msg : ""));
				}
			}

			return errocampo;
		}// validaLength()


		// -----------------------------------------------------------------------------
		// verifica se campo contem o mesmo valor do campo referencia
		function validaEqual(obj) {

			var errocampo = false,
				obj = $(obj),
				target = $("#"+obj.data('equal'));

			// verifica se os campos contem o mesmo valor
			if(obj.val() != target.val()) {
				ERRO = errocampo = true;
				var msg = "";
				msg = obj.data('equalto');

				obj.showMsg("Campos não conferem. "+((msg) ? "<br>"+msg : ""));
				target.showMsg("Campos não conferem.");
			}
			
			return errocampo;
		}// validaEqual()


		// -----------------------------------------------------------------------------
		// seta mensagem que sera exibida
		function geraMsgRequired(obj, type) {
			var msg = "";
			msg = $(obj).data('required');

			if( !msg ) {
				switch( type ) {
				    case "radio":
				    case "select": 		msg = "Selecione uma opção válida.";		break;
				    case "checkbox": 	msg = "Selecione pelo menos uma opção.";	break;
				    default:       		msg = "Campo obrigatório.";					break;
				}
			}

			return msg; 
		}// geraMsgRequired()


	// =============================================================================
	// ACAO - REMOVER MENSAGENS MSG-HELP
	// -----------------------------------------------------------------------------
		// remover help quando clicar nele
		$(document).on("click", ".msg-help", function(e) {
			e.preventDefault();
			$("#"+$(this).data("target")).focus();
			$(this).removeMsg();
		});

		// -----------------------------------------------------------------------------
		// remover class .campo-invalid quando digitar no campo campo
		$(document).on('keypress', '[class*="'+classInvalid+'"]', function(event) { 
			if([9,13,16,17,18,20,33,34,35,36,37,38,39,40,45].indexOf(event.which) == -1)
				$(this).removeMsg(); 
		});

		// -----------------------------------------------------------------------------
		// remove class .campo-invalid para radio/checkbox ou selecte
		$(document).on('change', 'input[class*="'+classInvalid+'"]', function() { 	$(this).removeMsg(); });
		$(document).on('change', 'select[class*="'+classInvalid+'"]', function() { 	$(this).removeMsg(); });


	// =============================================================================
	// ACAO - SELECIONA PROXIMO
	// -----------------------------------------------------------------------------
		// seleciona proximo campo ou um campo passado como referencia
		$(document).on('keyup', '[data-next]', function() { focusNext(this); });

		// -----------------------------------------------------------------------------
		// quando campo for preenchido seleciona o proximo ou um campo passado como referencia
		function focusNext(obj) {
			try {
				// verifica se campo foi preenchido
				if(obj.value.length == $(obj).attr("maxlength")) {
					var next = $(obj).data("next");

					if(next === true) {
						// array com todos os campos dos form do campo atual
						var arr = $(obj).closest('form').find("input, select, textarea"),
							prox = $.inArray(obj, arr)+1; // obtem prox campo do form

						if(prox < arr.length) // se o campo nao for o ultimo; seleciona prox campo
							$(arr[prox]).focus();
					} else 
						$(next).focus();
				}
			} catch(e){}
		}// focusNext()


	// =============================================================================
	// MASCARA
	// -----------------------------------------------------------------------------

		// mask somente numero - impede que usuário digite outros caracteres
		$(document).on("input",".mask-num", function(){ 
		    var v = this.value;
		    v=v.replace(/\D/g,"");
		    this.value = v;
		});

		$(document).on("input","[data-mascara='ddd_fone']", function(){
			z=this;
			v=z.value;
			v=v.replace(/\D/g,"") // permite digitar apenas numero
    		v=v.replace(/(\d{1})(\d)/,"($1$2) "); // separa ddd (xx)
    		v=v.replace(/(\d{4})(\d{4})$/,"$1-$2"); // separa 8 digitos - 0000-0000
    		v=v.replace(/(\d{5})(\d{4})$/,"$1-$2"); // separa 9 digitos - 00000-0000

			z.value = v;
		});

		$(document).on("input",".mask-valor", function(){
			z=this;
			v=z.value;
			v=v.replace(/\D/g,"") // permite digitar apenas numero
			v=v.replace(/^(0{1,})(\d{0,})$/,"$2") // remove zeros à esquerda

			if(v.length > 2 ) {
				v=v.replace(/(\d{1})(\d{17})$/,"$1.$2")  // coloca ponto antes dos ultimos digitos 
				v=v.replace(/(\d{1})(\d{14})$/,"$1.$2")  // coloca ponto antes dos ultimos 14 digitos 
				v=v.replace(/(\d{1})(\d{11})$/,"$1.$2")  // coloca ponto antes dos ultimos 11 digitos 
				v=v.replace(/(\d{1})(\d{8})$/,"$1.$2")   // coloca ponto antes dos ultimos 8 digitos 
				v=v.replace(/(\d{1})(\d{5})$/,"$1.$2")   // coloca ponto antes dos ultimos 5 digitos 
				v=v.replace(/(\d{1})(\d{1,2})$/,"$1,$2") // coloca virgula antes dos ultimos 2 digitos 
			}else if(v.length == 2 )
				v = v.replace(/(\d{1})(\d{1,2})$/,"0,$1$2") // add 0,#
			else if(v.length == 1 )
				v = v.replace(/(\d{1})$/,"0,0$1") // add 0,0#

			r=$(z).attr("data-replace");
			(v.length == 0) ? r = "" : r = (r) ? r : "";
			z.value = r + v;
		});


		// -----------------------------------------------------------------------------
		// aplica mascara correspondente para cada campo
		aplicaMascara();
});





// =================================================================================
// $(form).convertForm(); - converte form.divLinha para padrão bootstrap .form-horizontal
// =================================================================================


		function aplicaMascara() {

			$("[data-mascara]").each(function(i, obj) {

				var	options = {
					translation: {'W': {pattern: /[0-9]/, optional: true}},
					reverse: false
				}

				var	obj = $(obj),
					mascara = "",
					placeholder = "",
					pattern = "",
					length = "",
					min = "",
					max = "";

				switch(obj.attr('data-mascara')) {
					case "hora":
						mascara = '00:00:00';
						break;
					case "hora_min":
					case "min_seg":
						mascara = '00:00';
						break;
					case "data":
						mascara = '00/00/0000'; 
						placeholder = "DD/MM/AAAA"; 
						pattern = "^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[0-9]|[2-9]\\d)?\\d{2})$";
						obj.data({ pattern: "Informe uma data válida." });
						break;
					case "date":
					case "data-us":
						mascara = '0000/00/00'; 
						placeholder = "YYYY/MM/DD"; 
						pattern = "^\\d{4}[\\/\\-](0?[1-9]|1[012])[\\/\\-](0?[1-9]|[12][0-9]|3[01])";
						obj.data({ pattern: "Informe uma data-us válida." });
						break;
					case "data_hora":
						mascara = '00/00/0000 00:00:00';
						placeholder = "DD/MM/YYYY 00:00:00";
						pattern = "^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[0-9]|[2-9]\\d)?\\d{2}) (:{0,1}[0-9]{2}){3}$";
						obj.data({ pattern: "Informe uma data/Hora válida." });
						break;
					case "date_time":
						mascara = '00/00/0000 00:00:00';
						placeholder = "YYYY/MM/DD 00:00:00";
						pattern = "^\\d{4}[\\/\\-](0?[1-9]|1[012])[\\/\\-](0?[1-9]|[12][0-9]|3[01]) (:{0,1}[0-9]{2}){3}$";
						obj.data({ pattern: "Informe uma data-us/Hora válida." });
						break;
					case "cep":
						mascara = '00000-000';
						pattern = "^[0-9]{5}-[0-9]{3}$";
						obj.data({ pattern: "Formato exigido: 00000-000" });
						break;
					case "ddd":
						mascara = '(00)';
						pattern = "\\([1-9]{2}\\)";
						obj.data({ pattern: "Formato exigido: (00)" });
						break;
					case "fone":
						mascara = '0000W-0000';
						placeholder = "0000-0000";
						pattern = "[0-9]{4,5}-[0-9]{4}$";
						min = 9;
						options.reverse = true;
						obj.data({ pattern: "Formato exigido: 0000-0000" });
						break;
					case "ddd_fone":
						// mascara = '(00) 0000W-0000';
						placeholder = "(00) 0000-0000";
						pattern = "\\([1-9]{2}\\) [0-9]{4,5}-[0-9]{4}$";
						min = 14;
						max = 15;
						obj.data({ pattern: "Formato exigido: (00) 0000-0000" });
						// options.reverse = true;
						break;
					case "rg":
						mascara = '00.000.000-Z';
						placeholder = '00.000.000-0';
						pattern = "(\\d{2}).(\\d{3}).(\\d{3})-.$";
						obj.data({ pattern: "Formato exigido: 00.000.000-0" });
						options.translation = {'Z': {pattern: /[0-9A-Za-z]/, optional: true}};
						break;
					case "cpf":
						mascara = '000.000.000-00';
						pattern = "(\\d{3}).(\\d{3}).(\\d{3})-(\\d{2})$";
						obj.data({ pattern: "Formato exigido: 000.000.000-00" });
						break;
					case "cnpj":
						mascara = '00.000.000/0000-00';
						pattern = "(\\d{2}).(\\d{3}).(\\d{3})/(\\d{4})-(\\d{2})$";
						obj.data({ pattern: "Formato exigido: 00.000.000/0000-00" });
						break;
					case "valor":
						placeholder = "0,00";
						options.reverse = true;
						length = null;
						min = null;
						if(!obj.data('pattern')) { obj.data({ pattern: "Digite apenas números." }); }
						obj.addClass('mask-valor');
						break;
					case "numero":
						mascara = '0#';
						min = null;
						max = null;
						length = null;
						placeholder = "0";
						pattern = "[0-9]*";
						if(!obj.data('pattern')) { obj.data({ pattern: "Digite apenas números." }); }
						obj.addClass('mask-num');
						break;
					case "num_residencia":
						min = null;
						max = 6;
						length = null;
						placeholder = "Nº";
						pattern = "(\\d)[0-9A-Za-z]*";
						if(!obj.data('pattern')) { obj.data({ pattern: "Campo deve começar com número (0-9)." }); }
						break;
					case "email":
						max = 50;
						min = null;
						length = null;
						placeholder = "Email@email.com";
						pattern = "^[a-zA-Z0-9]+.*@[a-zA-Z0-9]+.*\\.[a-zA-Z0-9]+";
						obj.data({ pattern: "Informe um e-mail válido." });
						obj.attr({ type: "email" });
						break;
					case "texto":
						max = 250;
						min = null;
						length = null;
						pattern = "((((?![0-9])([\\wÀ-ú])){1,})( )*)+";
						if(!obj.data('pattern')) { obj.data({ pattern: "Digite apenas texto.<br>Não insira caracteres especiais ou números." }); }
						break;
					case "nome_sobrenome":
						max = 250;
						min = null;
						length = null;
						placeholder = "Informe o nome e sobrenome";
						pattern = "(((?![0-9])([\\wÀ-ú])){2,} )((?![0-9])([\\wÀ-ú]) ?(\\. )?){2,}";
						if(!obj.data('pattern')) { obj.data({ pattern: "Informe nome e sobrenome.<br>Não insira caracteres especiais ou números." }); }
						break;
					default: break;
				}// switch

				if(mascara)
					obj.mask(mascara, options);

				if(!obj.attr("pattern") && pattern)
					obj.setAttr("pattern",pattern);

				if(max === "" && mascara)
					obj.setAttr("maxlength", mascara.length); 

				if(max && !obj.attr('maxlength'))
					obj.setAttr("maxlength", max);

				if(!obj.attr("minlength")) {
					if(min === "" && mascara){ min = mascara.length; }
					obj.setAttr("minlength", min); 
				}

				// add placeholder formato exigido
				if(!obj.attr('placeholder') && placeholder !== null) {
					if(!placeholder){ placeholder = mascara; }
					obj.setAttr('placeholder',placeholder);
				}

				if(!obj.attr("length")) {
					if(length === ""){ length = "Formato exigido: "+placeholder; }
					obj.setAttr("data-length",length);
				}

			});
		}// aplicaMascara();




// =================================================================================
// $(form).convertForm(); - converte form.divLinha para padrão bootstrap .form-horizontal
// =================================================================================
$.fn.convertForm = function(settings) {
	// vars
    var config = {
    	form:      { classe: 'form-horizontal' },
		old_linha: { classe: 'divLinha' },
		old_label: { classe: 'divTitItem' },
		old_item:  { classe: 'divItem' },
    	linha:     { classe: 'control-group' },
    	label:     { classe: 'control-label' },
    	item:      { classe: 'controls' }
    };
    
	if (settings) { $.extend(config, settings); }

	this.addClass(config.form.classe);

	// percorre linhas
	$.each(this.find("."+config.old_linha.classe), function(i, linha) {
		$(linha).removeClass(config.old_linha.classe)
				.addClass(config.linha.classe);

		// percorre itens
		$(linha).find("."+config.old_label.classe).each(function(i, label) {
			var divItem = $(linha).find("."+config.old_item.classe+":eq("+i+")"),
				campo = divItem.find("[id]");

			var jsLabel = { 
				txt: $(label).html(),
				target: campo.attr('id'),
				classe: config.label.classe
			};

			// $("<label>", { 
			// 	class: jsLabel.classe, 
			// 	for: jsLabel.target, 
			// 	html: jsLabel.txt,
			// 	insertBefore: divItem 
			// });

			$("<label for='"+jsLabel.target+"' class='"+jsLabel.classe+"'>"+jsLabel.txt+"</label>").insertBefore(divItem);

			$(label).remove();
		});

		// troca class divitem
		$(linha).find("."+config.old_item.classe)
				.addClass(config.item.classe)
				.removeClass(config.old_item.classe);
	});

	return this;
};// .convertForm();





// =================================================================================
// CLASSES GENÉRICAS
// =================================================================================
// retorna tipo do obj
function verificaTipoCampo(obj){
    var result = "";
    switch( (obj.tagName).toLowerCase() ){
        case "select":    result = "select";             break;
        case "textarea":  result = "textarea";           break;
        case "input":     result = ($(obj).attr("type")).toLowerCase(); break;
    }

    return result;
}// verificaTipoCampo()

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}





// jQuery Mask Plugin v1.11.4
// github.com/igorescobar/jQuery-Mask-Plugin 
// http://igorescobar.github.io/jQuery-Mask-Plugin/
(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):"object"===typeof exports?module.exports=b(require("jquery")):b(jQuery||Zepto)})(function(b){var y=function(a,d,e){a=b(a);var g=this,k=a.val(),l;d="function"===typeof d?d(a.val(),void 0,a,e):d;var c={invalid:[],getCaret:function(){try{var q,v=0,b=a.get(0),f=document.selection,c=b.selectionStart;if(f&&-1===navigator.appVersion.indexOf("MSIE 10"))q=f.createRange(),q.moveStart("character",a.is("input")?-a.val().length:-a.text().length),
v=q.text.length;else if(c||"0"===c)v=c;return v}catch(d){}},setCaret:function(q){try{if(a.is(":focus")){var b,c=a.get(0);c.setSelectionRange?c.setSelectionRange(q,q):c.createTextRange&&(b=c.createTextRange(),b.collapse(!0),b.moveEnd("character",q),b.moveStart("character",q),b.select())}}catch(f){}},events:function(){a.on("keyup.mask",c.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){a.keydown().keyup()},100)}).on("change.mask",function(){a.data("changed",!0)}).on("blur.mask",
function(){k===a.val()||a.data("changed")||a.triggerHandler("change");a.data("changed",!1)}).on("keydown.mask, blur.mask",function(){k=a.val()}).on("focus.mask",function(a){!0===e.selectOnFocus&&b(a.target).select()}).on("focusout.mask",function(){e.clearIfNotMatch&&!l.test(c.val())&&c.val("")})},getRegexMask:function(){for(var a=[],b,c,f,e,h=0;h<d.length;h++)(b=g.translation[d.charAt(h)])?(c=b.pattern.toString().replace(/.{1}$|^.{1}/g,""),f=b.optional,(b=b.recursive)?(a.push(d.charAt(h)),e={digit:d.charAt(h),
pattern:c}):a.push(f||b?c+"?":c)):a.push(d.charAt(h).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));a=a.join("");e&&(a=a.replace(RegExp("("+e.digit+"(.*"+e.digit+")?)"),"($1)?").replace(RegExp(e.digit,"g"),e.pattern));return RegExp(a)},destroyEvents:function(){a.off("keydown keyup paste drop blur focusout ".split(" ").join(".mask "))},val:function(b){var c=a.is("input")?"val":"text";if(0<arguments.length){if(a[c]()!==b)a[c](b);c=a}else c=a[c]();return c},getMCharsBeforeCount:function(a,b){for(var c=0,
f=0,e=d.length;f<e&&f<a;f++)g.translation[d.charAt(f)]||(a=b?a+1:a,c++);return c},caretPos:function(a,b,e,f){return g.translation[d.charAt(Math.min(a-1,d.length-1))]?Math.min(a+e-b-f,e):c.caretPos(a+1,b,e,f)},behaviour:function(a){a=a||window.event;c.invalid=[];var e=a.keyCode||a.which;if(-1===b.inArray(e,g.byPassKeys)){var d=c.getCaret(),f=c.val().length,n=d<f,h=c.getMasked(),k=h.length,m=c.getMCharsBeforeCount(k-1)-c.getMCharsBeforeCount(f-1);c.val(h);!n||65===e&&a.ctrlKey||(8!==e&&46!==e&&(d=c.caretPos(d,
f,k,m)),c.setCaret(d));return c.callbacks(a)}},getMasked:function(a){var b=[],k=c.val(),f=0,n=d.length,h=0,l=k.length,m=1,p="push",t=-1,s,w;e.reverse?(p="unshift",m=-1,s=0,f=n-1,h=l-1,w=function(){return-1<f&&-1<h}):(s=n-1,w=function(){return f<n&&h<l});for(;w();){var x=d.charAt(f),u=k.charAt(h),r=g.translation[x];if(r)u.match(r.pattern)?(b[p](u),r.recursive&&(-1===t?t=f:f===s&&(f=t-m),s===t&&(f-=m)),f+=m):r.optional?(f+=m,h-=m):r.fallback?(b[p](r.fallback),f+=m,h-=m):c.invalid.push({p:h,v:u,e:r.pattern}),
h+=m;else{if(!a)b[p](x);u===x&&(h+=m);f+=m}}a=d.charAt(s);n!==l+1||g.translation[a]||b.push(a);return b.join("")},callbacks:function(b){var g=c.val(),l=g!==k,f=[g,b,a,e],n=function(a,b,c){"function"===typeof e[a]&&b&&e[a].apply(this,c)};n("onChange",!0===l,f);n("onKeyPress",!0===l,f);n("onComplete",g.length===d.length,f);n("onInvalid",0<c.invalid.length,[g,b,a,c.invalid,e])}};g.mask=d;g.options=e;g.remove=function(){var b=c.getCaret();c.destroyEvents();c.val(g.getCleanVal());c.setCaret(b-c.getMCharsBeforeCount(b));
return a};g.getCleanVal=function(){return c.getMasked(!0)};g.init=function(d){d=d||!1;e=e||{};g.byPassKeys=b.jMaskGlobals.byPassKeys;g.translation=b.jMaskGlobals.translation;g.translation=b.extend({},g.translation,e.translation);g=b.extend(!0,{},g,e);l=c.getRegexMask();!1===d?(e.placeholder&&a.attr("placeholder",e.placeholder),a.attr("autocomplete","off"),c.destroyEvents(),c.events(),d=c.getCaret(),c.val(c.getMasked()),c.setCaret(d+c.getMCharsBeforeCount(d,!0))):(c.events(),c.val(c.getMasked()))};
g.init(!a.is("input"))};b.maskWatchers={};var A=function(){var a=b(this),d={},e=a.attr("data-mask");a.attr("data-mask-reverse")&&(d.reverse=!0);a.attr("data-mask-clearifnotmatch")&&(d.clearIfNotMatch=!0);"true"===a.attr("data-mask-selectonfocus")&&(d.selectOnFocus=!0);if(z(a,e,d))return a.data("mask",new y(this,e,d))},z=function(a,d,e){e=e||{};var g=b(a).data("mask"),k=JSON.stringify;a=b(a).val()||b(a).text();try{return"function"===typeof d&&(d=d(a)),"object"!==typeof g||k(g.options)!==k(e)||g.mask!==
d}catch(l){}};b.fn.mask=function(a,d){d=d||{};var e=this.selector,g=b.jMaskGlobals,k=b.jMaskGlobals.watchInterval,l=function(){if(z(this,a,d))return b(this).data("mask",new y(this,a,d))};b(this).each(l);e&&(""!==e&&g.watchInputs)&&(clearInterval(b.maskWatchers[e]),b.maskWatchers[e]=setInterval(function(){b(document).find(e).each(l)},k));return this};b.fn.unmask=function(){clearInterval(b.maskWatchers[this.selector]);delete b.maskWatchers[this.selector];return this.each(function(){var a=b(this).data("mask");
a&&a.remove().removeData("mask")})};b.fn.cleanVal=function(){return this.data("mask").getCleanVal()};b.applyDataMask=function(a){a=a||b.jMaskGlobals.maskElements;(a instanceof b?a:b(a)).filter(b.jMaskGlobals.dataMaskAttr).each(A)};var p={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},
S:{pattern:/[a-zA-Z]/}}};b.jMaskGlobals=b.jMaskGlobals||{};p=b.jMaskGlobals=b.extend(!0,{},p,b.jMaskGlobals);p.dataMask&&b.applyDataMask();setInterval(function(){b.jMaskGlobals.watchDataMask&&b.applyDataMask()},p.watchInterval)});
