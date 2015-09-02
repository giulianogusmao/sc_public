
//##########################################################################
//##########################################################################
var js = {    
    //SendEvent("ADD_ITEM","",el,"page.asp")
    SendEvent: function(sAcao, page_event, el) {
        var f = document.forms[0];                
        if (el.type != "select-one"){
            try {                
                el.disabled = true;                
            } catch (e) { }
        }        
        f.hAcao.value = sAcao;
        f.action = page_event;
        f.submit();
        js.sleep();                
    },
    //##########################################################################
    ClearAllText: function() {
        var txt = document.forms[0];
        var i = 0;
        for (i = 0; i < txt.elements.length; i++) {
            var x = txt.elements[i]
            if (x.type == 'text' || x.type == 'textarea')
                x.value = "";
        }
    },
    //###########################################
    sleep: function(msg) {
        var f = js.cf("sleep");
        f.style.zIndex = 0;
        // var img = js.ci("IMG", "img/pagina1/esperando1.gif");
        var img = js.ci("IMG", "");
        img.style.left = (js.rp(f.style.width, "px", "") / 2) + "px";
        img.style.top = (js.rp(f.style.height, "px", "") / 2) - 50 + "px";
        img.style.position = "relative";
        var dv = js.cd("dv", f.style.width, f.style.height, f.style.left, f.style.top);
        dv.style.zIndex = 1;
        dv.style.position = "absolute";
        dv.style.backgroundColor = "#f5f5f5";
        dv.appendChild(img);
        //document.body.appendChild(f);
        document.body.appendChild(dv);
        js.aph(dv.id);
        return true;
    },
    //Create Image	
    aph: function(e, p) {
        var el = js.id(e);
        p = p || 0;
        el.style.filter = "alpha(opacity=" + p + ")";
        p += 10;
        if (p <= 100)
            window.setTimeout("js.aph('" + el.id + "'," + p + ")", 200);
    },
    //--------------------------------------------	
    ci: function(id, src) {
        var img = js.ce("IMG");
        img.src = src;
        img.id = id;
        return img;
    }, //--------------------------------------------
    cd: function(id, width, height, left, top) {
        var dv = js.ce("DIV");
        dv.setAttribute("id", id);
        dv.style.width = width;
        dv.style.height = height;
        dv.style.left = left;
        dv.style.top = top;
        return dv;
    },
    //###########################################
    //Create iFrame
    cf: function(id, src, width, height, left, top) {
        var ifa = js.ce("IFRAME");
        ifa.setAttribute("frameBorder", "no");
        ifa.setAttribute("scrolling", "no");
        ifa.setAttribute("id", id);
        ifa.setAttribute("name", id);
        ifa.src = src || "about:blank";
        ifa.style.top = top || js.getPos("top") + "px";
        ifa.style.left = left || js.getPos("left") + "px";
        ifa.style.width = width || js.getPos("width") + "px";
        ifa.style.height = height || js.getPos("height") + "px";
        return ifa;
    },
    getPos: function(pos) {
        if (js.testIE()) {
            el = window.document.body;
            switch (pos.toLowerCase()) {
                case 'top': return el.offsetTop; break;
                case 'left': return el.offsetLeft; break;
                case 'width': return el.offsetWidth - 2; break;
                case 'height': return el.offsetHeight - 13; break;
            };
        } else {
            el = window;
            switch (pos.toLowerCase()) {
                case 'top': return el.innerTop; break;
                case 'left': return el.innerLeft; break;
                case 'width': return el.innerWidth; break;
                case 'height': return el.innerHeight; break;
            };
        }
    }, //--------------------------------------------
    ce: function(e) {
        return document.createElement(e);
    }, //--------------------------------------------
    id: function(e) {
        if (document.getElementById) {
            return document.getElementById(e);
        } else {
            if (document.all) {
                return document.all[e];
            } else {
                return null
            }
        }
    }, //--------------------------------------------
    toFloat: function() {
        return parseFloat(this);
    }, //--------------------------------------------
    toInt: function(base) {
        return parseInt(this, base || 10);
    }, //--------------------------------------------
    trim: function(s) {
        return s.replace(/^\s+|\s+$/g, '');
    },
    rp: function(e, v, r) {
        return e.replace(v, r);
    },
    chk: function(e) {
        return ( e == null || typeof(e)=="undefined" ? null :e ) ;
        //int x = t == 0 ? 10 : 20;   
    },    
    //###################################################
    //crossBrowser
    //###################################################
    events: function(evt) {
        evt = evt || window.event;
        return evt;
    },  //--------------------------------------------
    srcElem: function(evt) {
        evt = js.events(evt);
        if (evt)
            var elem = evt.srcElement || evt.target;
        return elem;
    }, //--------------------------------------------
    key: function(evt) {
        evt = js.events(evt);
        var key = evt.keyCode || evt.which;
        return key;
    }, //--------------------------------------------
    AttEvent: function(ev, fun) {
        if (document.attachEvent)
            document.attachEvent('on' + ev, fun);
        else
            document.addEventListener(ev, fun, true);
    }, //--------------------------------------------
    AttEventElement: function(el, ev, fun) {
        if (el.attachEvent)
            el.attachEvent('on' + ev, fun);
        else
            el.addEventListener(ev, fun, true);
    }, //--------------------------------------------              
    isIE: false,
    testIE: function() {
        var w = window.navigator;
        js.isIE = (/MSIE/ig.test(w.appVersion) || /MSIE/ig.test(w.userAgent));
        return js.isIE;
    } //--------------------------------------------                      
    //##########################################################################
    //##########################################################################
};
var manage = {
    form: document.forms[0],
    removerValidacao: '',
    initialize: function(){
       //------------------------
       var btn = js.id("btnSalvar");
       if (btn) {
            js.AttEventElement(btn, 'click', function () {
                return manage.validaForm() ? js.sleep() : false;
            });
       }
       btn = js.id("btnSalvar2");
       if (btn) {
           js.AttEventElement(btn, 'click', function () {
               return manage.validaForm() ? js.sleep() : false;
           });
       }
        var inputs = document.getElementsByTagName('input');
        for(x=0;x<inputs.length;x++){
            if(!inputs[x].getAttribute('disabled')){                
                if(inputs[x].getAttribute('foco') == 'true')
                    inputs[x].focus();
            }
        }
    },
    validaForm: function(){
        var form = manage.form;
        var splRemValidacoes = manage.removerValidacao.split('#');
        for(i=0;i<form.length;i++){
            if(!form[i].getAttribute('disabled')){
                if(manage.verificaRemocaValidacao(splRemValidacoes, form[i].id)){
                    if(form[i].getAttribute('valida') == 'true'){
                        if(form[i].value.trim().replace("'","") == ''){
                            try{                            
                                var msg = js.chk(form[i].getAttribute('validamsg'));
                                alert((msg==null ? 'Campo obrigatórios' : msg));
                                form[i].focus();
                            }catch(e){};                                
                            return false;
                        }
                    }
                    if(form[i].getAttribute('validatype') == 'date' && form[i].value.trim() != ''){
                        if(!check_date(form[i])) return false;
                    }            
                }
            }
        }
        return true;
    },
    verificaRemocaValidacao: function(arrRem, id){
        for(y=0;y<arrRem.length;y++)
            if(arrRem[y] == id) return false;
        return true;
    }
}
/****************************************************************/
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
}
/****************************************************************/
function addEvent(obj, evType, fn){
    if (obj.addEventListener) //Non-IE
	    obj.addEventListener(evType, fn, true)
    if (obj.attachEvent) //IE
	    obj.attachEvent('on' + evType, fn)
}
/****************************************************************/
function removeEvent(obj, evType, fn){
    if (obj.removeEventListener) //Non-IE
	    obj.removeEventListener(evType, fn, false)
    if (obj.detachEvent) //IE
	    obj.detachEvent('on' + evType, fn)
}
/****************************************************************/
function getScrollYX(){
    var scrOfX = 0, scrOfY = 0;
    if(typeof(window.pageYOffset) == 'number' ){
	    //Netscape compliant
	    scrOfY = window.pageYOffset;
	    scrOfX = window.pageXOffset;
    }else 
	    if(document.body && (document.body.scrollLeft || document.body.scrollTop)){
		    //DOM compliant
		    scrOfY = document.body.scrollTop;
		    scrOfX = document.body.scrollLeft;
	    }else 
		    if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)){
			    //IE6 standards compliant mode
			    scrOfY = document.documentElement.scrollTop;
			    scrOfX = document.documentElement.scrollLeft;
		    }
    return [scrOfY, scrOfX];
}
/****************************************************************/
function GetSize(){
	var myWidth = 0, myHeight = 0;
	if(typeof( window.innerWidth ) == 'number'){
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	}else 
		if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)){
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		}else 
			if(document.body && (document.body.clientWidth || document.body.clientHeight)){
				//IE 4 compatible
				myWidth = document.body.clientWidth;
				myHeight = document.body.clientHeight;
			}
		return [myHeight, myWidth];
}
/****************************************************************/
function check_date(DATA) {
    var expReg = /^(([0-2]\d|[3][0-1])\/([0]\d|[1][0-2])\/[1-2][0-9]\d{2})$/;
    var msgErro = 'Formato inválido de data.';
    var vdt = new Date();
    var vdia = vdt.getDay();
    var vmes = vdt.getMonth();
    var vano = vdt.getYear();
    if ((DATA.value.match(expReg)) && (DATA.value!='')){
        var dia = DATA.value.substring(0,2);
        var mes = DATA.value.substring(3,5);
        var ano = DATA.value.substring(6,10);
        if((mes==04 && dia > 30) || (mes==06 && dia > 30) || (mes==09 && dia > 30) || (mes==11 && dia > 30)){
        alert("Dia incorreto !!! O mês especificado contém no máximo 30 dias.");
        DATA.focus();
        return false;
    } else{ //1
        if(ano%4!=0 && mes==2 && dia>28){
            alert("Data incorreta!! O mês especificado contém no máximo 28 dias.");
            DATA.focus();
            return false;
        } else{ //2
            if(ano%4==0 && mes==2 && dia>29){
                alert("Data incorreta!! O mês especificado contém no máximo 29 dias.");
                DATA.focus();
                return false;
            } else{ //3
                return true;
            } //3-else
        }//2-else
    }//1-else
    } else { //5
        alert(msgErro);
        DATA.focus();
        return false;
    } //5-else
}
/****************************************************************/
function abreBoxMsg(plargura, paltura, ptitulo, ptexto, ptempoAlerta){
    var box = windowBox;
    with(box){
        largura = plargura;
        altura = paltura;
        titulo = ptitulo;
        texto = ptexto;
        tipo = 0;
        tempoAlerta = ptempoAlerta;
        criaBox();
    }
}
/****************************************************************/
function abreBoxOK(plargura, paltura, ptitulo, ptexto){
    var box = windowBox;
    with(box){
        largura = plargura;
        altura = paltura;
        titulo = ptitulo;
        texto = ptexto;
        tipo = 2;
        criaBox();
    }
}
/****************************************************************/
function abreBoxIframe(plargura, paltura, ptitulo, purl, pExecuta){
    var box = windowBox;
    with(box){
        largura = plargura;
        altura = paltura;
        titulo = ptitulo;
        url = purl;
        tipo = 3;
        if(pExecuta) executa = pExecuta;
        criaBox();
        return false;
    }
}
/****************************************************************/
function abreBoxQuestion(plargura, paltura, ptitulo, ptexto,  pobj){
    var box = windowBox;
    with(box){
        largura = plargura;
        altura = paltura;
        titulo = ptitulo;
        texto = ptexto;
        tipo = 1;
        obj = pobj;
        criaBox();
        if(obj) executa = function(){windowBox.obj.onclick = ''; windowBox.obj.click();};
        return false;        
    }
}
/****************************************************************/
function confirmSalvar(obj) {
    abreBoxQuestion(280, 150, '<center>Confirmação</center>', '<center>Deseja salvar o registro?</center>', obj);
    return false;
}

function confirmVoltar(obj) {
    abreBoxQuestion(280, 150, '<center>Confirmação</center>', '<center>Deseja voltar para a página principal?</center>', obj);
    return false;
}
/****************************************************************/
function confirmExclusao(obj){
    //abreBoxQuestion(280, 150, '<center>Confirmação</center>', '<center>Tem certeza de que deseja excluir o registro?</center>', obj);
    return confirm("Tem certeza de que deseja excluir o registro?");    
}
/****************************************************************/
function confirmCancelAlteracao(obj){
    abreBoxQuestion(280, 150, '<center>Confirmação</center>', '<center>Confirma cancelamento da alteração?</center>', obj);
    return false;
}
/****************************************************************/
function MostraEscondeDetalhe(img){
    var divDetalhe = document.getElementById('divDetalhe');
    if(divDetalhe.style.display == 'none'){
        divDetalhe.style.display = 'block';
        img.src = 'img/imenos.gif';
        img.alt = 'Ocultar Detalhe!';
    }else{
        divDetalhe.style.display = 'none';    
        img.src = 'img/imais.gif';
        img.alt = 'Mostrar Detalhe!';
    }
}

function formatar(src, mask) {
    var i = src.value.length;
    var saida = mask.substring(i,i+1);
    var ascii = event.keyCode;
    if (saida == "A") {
            if ((ascii >=97) && (ascii <= 122)) { event.keyCode -= 32; }
            else { event.keyCode = 0; }
    } else if (saida == "0") {
            if ((ascii >= 48) && (ascii <= 57)) { return }
            else { event.keyCode = 0 }
    } else if (saida == "#") {
            return;
    } else {
            src.value += saida;
                
           
            if (saida == "A") {
                    if ((ascii >=97) && (ascii <= 122)) { event.keyCode -= 32; }
            } else { return; }
    }
}

/******************************************************************/

function formataMascara(campo, evt, formato)
{
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;


    var result = "";
    var maskIdx = formato.length - 1;
    var error = false;
    var valor = campo.value;
    var posFinal = false;
    if (campo.setSelectionRange)
    {
        if (campo.selectionStart == valor.length)
            posFinal = true;
    }

    valor = valor.replace(/[^0123456789Xx]/g, '');
    for (var valIdx = valor.length - 1; valIdx >= 0 && maskIdx >= 0; --maskIdx)
    {
        var chr = valor.charAt(valIdx);
        var chrMask = formato.charAt(maskIdx);
        switch (chrMask)
        {
            case '#':
                if (!(/\d/.test(chr)))
                    error = true;
                result = chr + result;
                --valIdx;
                break;
            case '@':
                result = chr + result;
                --valIdx;
                break;
            default:
                result = chrMask + result;
        }
    }

    campo.value = result;
    campo.style.color = error ? 'red' : '';
    if (posFinal)
    {
        campo.selectionStart = result.length;
        campo.selectionEnd = result.length;
    }
    return result;
}

// Formata o campo valor monetário
function formataValor(campo, evt)
{
    //1.000.000,00
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    vr = campo.value = filtraNumeros(filtraCampo(campo));
    if (vr.length > 0)
    {
        vr = parseFloat(vr.toString()).toString();
        tam = vr.length;

        if (tam == 1)
            campo.value = "0,0" + vr;
        if (tam == 2)
            campo.value = "0," + vr;
        if ((tam > 2) && (tam <= 5))
        {
            campo.value = vr.substr(0, tam - 2) + ',' + vr.substr(tam - 2, tam);
        }
        if ((tam >= 6) && (tam <= 8))
        {
            campo.value = vr.substr(0, tam - 5) + '.' + vr.substr(tam - 5, 3) + ',' + vr.substr(tam - 2, tam);
        }
        if ((tam >= 9) && (tam <= 11))
        {
            campo.value = vr.substr(0, tam - 8) + '.' + vr.substr(tam - 8, 3) + '.' + vr.substr(tam - 5, 3) + ',' + vr.substr(tam - 2, tam);
        }
        if ((tam >= 12) && (tam <= 14))
        {
            campo.value = vr.substr(0, tam - 11) + '.' + vr.substr(tam - 11, 3) + '.' + vr.substr(tam - 8, 3) + '.' + vr.substr(tam - 5, 3) + ',' + vr.substr(tam - 2, tam);
        }
        if ((tam >= 15) && (tam <= 18))
        {
            campo.value = vr.substr(0, tam - 14) + '.' + vr.substr(tam - 14, 3) + '.' + vr.substr(tam - 11, 3) + '.' + vr.substr(tam - 8, 3) + '.' + vr.substr(tam - 5, 3) + ',' + vr.substr(tam - 2, tam);
        }
    }
    MovimentaCursor(campo, xPos);
}

// Formata data no padrão DD/MM/YYYY
function formataData(campo, evt)
{
    var xPos = PosicaoCursor(campo);
    //dd/MM/yyyy
    evt = getEvent(evt);

    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;
    vr = campo.value = filtraNumeros(filtraCampo(campo));
    tam = vr.length;

    if (tam >= 2 && tam < 4)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2);
    if (tam == 4)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2, 2) + '/';
    if (tam > 4)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2, 2) + '/' + vr.substr(4);

    MovimentaCursor(campo, xPos);
}

//descobre qual a posição do cursor no campo
function PosicaoCursor(textarea)
{
    var pos = 0;
    if (typeof (document.selection) != 'undefined')
    {
        //IE
        var range = document.selection.createRange();
        var i = 0;
        for (i = textarea.value.length; i > 0; i--)
        {
            if (range.moveStart('character', 1) == 0)
                break;
        }
        pos = i;
    }
    if (typeof (textarea.selectionStart) != 'undefined')
    {
        //FireFox
        pos = textarea.selectionStart;
    }

    if (pos == textarea.value.length)
        return 0; //retorna 0 quando não precisa posicionar o elemento
    else
        return pos; //posição do cursor
}

// move o cursor para a posição pos
function MovimentaCursor(textarea, pos)
{
    if (pos <= 0)
        return; //se a posição for 0 não reposiciona

    if (typeof (document.selection) != 'undefined')
    {
        //IE
        var oRange = textarea.createTextRange();
        var LENGTH = 1;
        var STARTINDEX = pos;

        oRange.moveStart("character", -textarea.value.length);
        oRange.moveEnd("character", -textarea.value.length);
        oRange.moveStart("character", pos);
        //oRange.moveEnd("character", pos);
        oRange.select();
        textarea.focus();
    }
    if (typeof (textarea.selectionStart) != 'undefined')
    {
        //FireFox
        textarea.selectionStart = pos;
        textarea.selectionEnd = pos;
    }
}

//Formata data e hora no padrão DD/MM/YYYY HH:MM
function formataDataeHora(campo, evt)
{
    xPos = PosicaoCursor(campo);
    //dd/MM/yyyy
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;
    vr = campo.value = filtraNumeros(filtraCampo(campo));
    tam = vr.length;

    if (tam >= 2 && tam < 4)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2);
    if (tam == 4)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2, 2) + '/';
    if (tam > 4)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2, 2) + '/' + vr.substr(4);
    if (tam > 8 && tam < 11)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2, 2) + '/' + vr.substr(4, 4) + ' ' + vr.substr(8, 2);
    if (tam >= 11)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2, 2) + '/' + vr.substr(4, 4) + ' ' + vr.substr(8, 2) + ':' + vr.substr(10);

    campo.value = campo.value.substr(0, 16);
    //    if(xPos == 2 || xPos == 5)
    //        xPos = xPos +1;
    //    if(xPos == 11 || xPos == 14)
    //        xPos = xPos +2;
    MovimentaCursor(campo, xPos);
}

// Formata só números
function formataInteiro(campo, evt)
{
    //1234567890
    xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    campo.value = filtraNumeros(filtraCampo(campo));
    MovimentaCursor(campo, xPos);
}

// Formata hora no padrao HH:MM
function formataHora(campo, evt)
{
    //HH:mm

    xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    vr = campo.value = filtraNumeros(filtraCampo(campo));

    if (tam == 2)
        campo.value = vr.substr(0, 2) + ':';
    if (tam > 2 && tam < 5)
        campo.value = vr.substr(0, 2) + ':' + vr.substr(2);
    //    if(xPos == 2)
    //        xPos = xPos + 1;
    MovimentaCursor(campo, xPos);
}

// limpa todos os caracteres especiais do campo solicitado
function filtraCampo(campo)
{
    var s = "";
    var cp = "";
    vr = campo.value;
    tam = vr.length;
    for (i = 0; i < tam; i++)
    {
        if (vr.substring(i, i + 1) != "/"
                  && vr.substring(i, i + 1) != "-"
                  && vr.substring(i, i + 1) != "."
                  && vr.substring(i, i + 1) != "("
                  && vr.substring(i, i + 1) != ")"
                  && vr.substring(i, i + 1) != ":"
                  && vr.substring(i, i + 1) != ",")
        {
            s = s + vr.substring(i, i + 1);
        }
    }
    return s;
    //return campo.value.replace("/", "").replace("-", "").replace(".", "").replace(",", "")
}

// limpa todos caracteres que não são números
function filtraNumeros(campo)
{
    var s = "";
    var cp = "";
    vr = campo;
    tam = vr.length;
    for (i = 0; i < tam; i++)
    {
        if (vr.substring(i, i + 1) == "0" ||
                  vr.substring(i, i + 1) == "1" ||
                  vr.substring(i, i + 1) == "2" ||
                  vr.substring(i, i + 1) == "3" ||
                  vr.substring(i, i + 1) == "4" ||
                  vr.substring(i, i + 1) == "5" ||
                  vr.substring(i, i + 1) == "6" ||
                  vr.substring(i, i + 1) == "7" ||
                  vr.substring(i, i + 1) == "8" ||
                  vr.substring(i, i + 1) == "9")
        {
            s = s + vr.substring(i, i + 1);
        }
    }
    return s;
    //return campo.value.replace("/", "").replace("-", "").replace(".", "").replace(",", "")
}

// limpa todos caracteres que não são letras
function filtraCaracteres(campo)
{
    vr = campo;
    for (i = 0; i < tam; i++)
    {
        //Caracter
        if (vr.charCodeAt(i) != 32 && vr.charCodeAt(i) != 94 && (vr.charCodeAt(i) < 65 ||
              (vr.charCodeAt(i) > 90 && vr.charCodeAt(i) < 96) ||
                  vr.charCodeAt(i) > 122) && vr.charCodeAt(i) < 192)
        {
            vr = vr.replace(vr.substr(i, 1), "");
        }
    }
    return vr;
}

// limpa todos caracteres que não são números, menos a vírgula
function filtraNumerosComVirgula(campo)
{
    var s = "";
    var cp = "";
    vr = campo;
    tam = vr.length;
    var complemento = 0; //flag paga contar o número de virgulas
    for (i = 0; i < tam; i++)
    {
        if ((vr.substring(i, i + 1) == "," && complemento == 0 && s != "") ||
                  vr.substring(i, i + 1) == "0" ||
                  vr.substring(i, i + 1) == "1" ||
                  vr.substring(i, i + 1) == "2" ||
                  vr.substring(i, i + 1) == "3" ||
                  vr.substring(i, i + 1) == "4" ||
                  vr.substring(i, i + 1) == "5" ||
                  vr.substring(i, i + 1) == "6" ||
                  vr.substring(i, i + 1) == "7" ||
                  vr.substring(i, i + 1) == "8" ||
                  vr.substring(i, i + 1) == "9")
        {
            if (vr.substring(i, i + 1) == ",")
                complemento = complemento + 1;
            s = s + vr.substring(i, i + 1);
        }
    }
    return s;
}

function formataMesAno(campo, evt)
{
    //MM/yyyy
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    vr = campo.value = filtraNumeros(filtraCampo(campo));
    tam = vr.length;

    if (tam >= 2)
        campo.value = vr.substr(0, 2) + '/' + vr.substr(2);
    MovimentaCursor(campo, xPos);
}

function formataCNPJ(campo, evt)
{
    //99.999.999/9999-99
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    vr = campo.value = filtraNumeros(filtraCampo(campo));
    tam = vr.length;

    if (tam >= 2 && tam < 5)
        campo.value = vr.substr(0, 2) + '.' + vr.substr(2);
    else if (tam >= 5 && tam < 8)
        campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(5);
    else if (tam >= 8 && tam < 12)
        campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(5, 3) + '/' + vr.substr(8);
    else if (tam >= 12)
        campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(5, 3) + '/' + vr.substr(8, 4) + '-' + vr.substr(12);
    MovimentaCursor(campo, xPos);
}

function formataCPF(campo, evt)
{
    //999.999.999-99
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    vr = campo.value = filtraNumeros(filtraCampo(campo));
    tam = vr.length;
    if (tam >= 3 && tam < 6)
        campo.value = vr.substr(0, 3) + '.' + vr.substr(3);
    else if (tam >= 6 && tam < 9)
        campo.value = vr.substr(0, 3) + '.' + vr.substr(3, 3) + '.' + vr.substr(6);
    else if (tam >= 9)
        campo.value = vr.substr(0, 3) + '.' + vr.substr(3, 3) + '.' + vr.substr(6, 3) + '-' + vr.substr(9);
    MovimentaCursor(campo, xPos);
}

function formataDouble(campo, evt)
{
    //18,53012
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    campo.value = filtraNumerosComVirgula(campo.value);
    MovimentaCursor(campo, xPos);
}

function formataTelefone(campo, evt)
{
    //(00) 0000-0000
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    vr = campo.value = filtraNumeros(filtraCampo(campo));
    tam = vr.length;

    if (tam == 1)
        campo.value = '(' + vr;
    else if (tam >= 2 && tam < 6)
        campo.value = '(' + vr.substr(0, 2) + ') ' + vr.substr(2);
    else if (tam >= 6)
        campo.value = '(' + vr.substr(0, 2) + ') ' + vr.substr(2, 4) + '-' + vr.substr(6);

    //(
    //    if(xPos == 1 || xPos == 3 || xPos == 5 || xPos == 9)
    //        xPos = xPos +1
    MovimentaCursor(campo, xPos);
}

function formataTexto(campo, evt, sMascara)
{
    //Nome com Inicial Maiuscula.
    evt = getEvent(evt);
    xPos = PosicaoCursor(campo);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;
    vr = campo.value = filtraCaracteres(filtraCampo(campo));
    tam = vr.length;

    if (sMascara == "Aa" || sMascara == "Xx")
    {
        var valor = campo.value.toLowerCase();
        var count = campo.value.split(" ").length - 1;
        var i;
        var pos = 0;
        var valorIni;
        var valorMei;
        var valorFim;
        valor = valor.substring(0, 1).toUpperCase() + valor.substring(1, valor.length);
        for (i = 0; i < count; i++)
        {
            pos = valor.indexOf(" ", pos + 1);
            valorIni = valor.substring(0, valor.indexOf(" ", pos - 1)) + " ";
            valorMei = valor.substring(valor.indexOf(" ", pos) + 1, valor.indexOf(" ", pos) + 2).toUpperCase();
            valorFim = valor.substring(valor.indexOf(" ", pos) + 2, valor.length);
            valor = valorIni + valorMei + valorFim;
        }
        campo.value = valor;
    }
    if (sMascara == "Aaa" || sMascara == "Xxx")
    {
        var valor = campo.value.toLowerCase();
        var count = campo.value.split(" ").length - 1;
        var i;
        var pos = 0;
        var valorIni;
        var valorMei;
        var valorFim;
        var ligacao = false;
        var chrLigacao = Array("de", "da", "do", "para", "e")
        valor = valor.substring(0, 1).toUpperCase() + valor.substring(1, valor.length);
        for (i = 0; i < count; i++)
        {
            ligacao = false;
            pos = valor.indexOf(" ", pos + 1);
            valorIni = valor.substring(0, valor.indexOf(" ", pos - 1)) + " ";
            for (var a = 0; a < chrLigacao.length; a++)
            {
                if (valor.substring(valorIni.length, valor.indexOf(" ", valorIni.length)).toLowerCase() == chrLigacao[a].toLowerCase())
                {
                    ligacao = true;
                    break;
                }
                else if (ligacao == false && valor.indexOf(" ", valorIni.length) == -1)
                {
                    if (valor.substring(valorIni.length, valor.length).toLowerCase() == chrLigacao[a].toLowerCase())
                    {
                        ligacao = true;
                        break;
                    }
                }
            }
            if (ligacao == true)
            {
                valorMei = valor.substring(valor.indexOf(" ", pos) + 1, valor.indexOf(" ", pos) + 2).toLowerCase();
            }
            else
            {
                valorMei = valor.substring(valor.indexOf(" ", pos) + 1, valor.indexOf(" ", pos) + 2).toUpperCase();
            }
            valorFim = valor.substring(valor.indexOf(" ", pos) + 2, valor.length);
            valor = valorIni + valorMei + valorFim;
        }

        campo.value = valor;
    }
    MovimentaCursor(campo, xPos);
    return true;
}

// Formata o campo CEP
function formataCEP(campo, evt)
{
    //312555-650
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    vr = campo.value = filtraNumeros(filtraCampo(campo));
    tam = vr.length;

    if (tam < 5)
        campo.value = vr;
    else if (tam == 5)
        campo.value = vr + '-';
    else if (tam > 5)
        campo.value = vr.substr(0, 5) + '-' + vr.substr(5);
    MovimentaCursor(campo, xPos);
}

function formataCartaoCredito(campo, evt)
{
    //0000.0000.0000.0000
    var xPos = PosicaoCursor(campo);
    evt = getEvent(evt);
    var tecla = getKeyCode(evt);
    if (!teclaValida(tecla))
        return;

    var vr = campo.value = filtraNumeros(filtraCampo(campo));
    var tammax = 16;
    var tam = vr.length;

    if (tam < tammax && tecla != 8)
    { tam = vr.length + 1; }

    if (tam < 5)
    { campo.value = vr; }
    if ((tam > 4) && (tam < 9))
    { campo.value = vr.substr(0, 4) + '.' + vr.substr(4, tam - 4); }
    if ((tam > 8) && (tam < 13))
    { campo.value = vr.substr(0, 4) + '.' + vr.substr(4, 4) + '.' + vr.substr(8, tam - 4); }
    if (tam > 12)
    { campo.value = vr.substr(0, 4) + '.' + vr.substr(4, 4) + '.' + vr.substr(8, 4) + '.' + vr.substr(12, tam - 4); }
    MovimentaCursor(campo, xPos);
}


//recupera tecla

//evita criar mascara quando as teclas são pressionadas
function teclaValida(tecla)
{
    if (tecla == 8 //backspace
        //Esta evitando o post, quando são pressionadas estas teclas.
        //Foi comentado pois, se for utilizado o evento texchange, é necessario o post.
           || tecla == 9 //TAB
           || tecla == 27 //ESC
           || tecla == 16 //Shif TAB 
           || tecla == 45 //insert
           || tecla == 46 //delete
           || tecla == 35 //home
           || tecla == 36 //end
           || tecla == 37 //esquerda
           || tecla == 38 //cima
           || tecla == 39 //direita
           || tecla == 40)//baixo
        return false;
    else
        return true;
}

// recupera o evento do form
function getEvent(evt)
{
    if (!evt) evt = window.event; //IE
    return evt;
}
//Recupera o código da tecla que foi pressionado
function getKeyCode(evt)
{
    var code;
    if (typeof (evt.keyCode) == 'number')
        code = evt.keyCode;
    else if (typeof (evt.which) == 'number')
        code = evt.which;
    else if (typeof (evt.charCode) == 'number')
        code = evt.charCode;
    else
        return 0;

    return code;
}
