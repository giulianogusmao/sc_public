/**********************************************************
Validação
**********************************************************/
var sendForm = false;

function valida(e){  
    var validateAction = true;  
    var validateRealTime = true;  
    var it;
    var frm = document.forms[0];
    var el = frm.getElementsByTagName('input');
    var cbo = frm.getElementsByTagName('select');
    
    if(e.type == 'click') sendForm = true;        
    
    o('divListaErros').innerHTML = '';
    o('divListaErros2').innerHTML = '';
    
    for(c=0;c<el.length;c++){            
        if(typeof(el[c].getAttribute('required')) == 'string'){
            if(el[c].value == ''){                   
                it = ce('div');
                it.innerHTML = 'O campo <b>'+ el[c].getAttribute('title') + '</b> não foi preenchido<br>';
                o('divListaErros').appendChild(it);
                validateAction = false;
     
                //Titulo
                var tdiv = el[c].previousSibling;
                tdiv.title = 'Campo não preenchido';
                tdiv.className = 'divTitleError';
                addEvent(el[c], 'blur', function(){return valida(event);});
            }
            else{                
                //Titulo
                var tdiv = el[c].previousSibling;
                tdiv.title = '';
                tdiv.className = 'divTitle';
            }                
        }     
        //---------------- 
        if(typeof(el[c].getAttribute('format')) == 'string'){
            if(el[c].value != ''){
                var msg = checkDate(el[c]);                    
                 if(msg != ''){
                    it = ce('div');
                    it.innerHTML = 'Campo <b>'+ el[c].getAttribute('title') + '</b>: '+ msg;
                    o('divListaErros2').appendChild(it);
                    validateRealTime = false;
                
                    var tdiv = el[c].previousSibling;
                    tdiv.title = 'Campo não preenchido';
                    tdiv.className = 'divTitleError';
                    addEvent(el[c], 'blur', function(){return valida(event);});
            }
            else{                
                //Titulo
                var tdiv = el[c].previousSibling;
                tdiv.title = '';
                tdiv.className = 'divTitle';
            }    
            }
        }            
    }   
    //----------------
    for(n=0;n<cbo.length;n++){
        if(typeof(cbo[n].getAttribute('required')) == 'string'){
            if(cbo[n].selectedIndex == 0){      
                it = ce('div');              
                it.innerHTML = '<b>'+ cbo[n].getAttribute('title') + '</b> não foi selecionado<br>';
                o('divListaErros').appendChild(it);                    
                validateAction = false;
                
                //Titulo
                var tdiv = cbo[n].previousSibling;
                tdiv.title = 'Campo não selecionado';
                tdiv.className = 'divTitleError';
                addEvent(cbo[n], 'blur', function(){return valida(event);});
            }
            else{                
                //Titulo
                var tdiv = cbo[n].previousSibling;
                tdiv.title = '';
                tdiv.className = 'divTitle';
            }                 
        } 
    }             
    //----------------
    if(validateRealTime && validateAction){  
        o('divAlerta').style.display = 'none'; 
    }
    else {     
        o('divAlerta').style.display = '';
        
        if(e.type == 'blur'){                
            if(sendForm)                    
                o('divListaErros').style.display = '';
            else 
                o('divListaErros').style.display = 'none';                
        } else
             o('divListaErros').style.display = '';                    
    }        
    return (validateAction && validateRealTime);
}

/*********************************************************
Tab ao teclar ENTER
**********************************************************/
function TABEnter(oEvent){
  var oEvent = (oEvent)? oEvent : event;
  var oTarget =(oEvent.target)? oEvent.target : oEvent.srcElement;
  if(oEvent.keyCode==13){
    oEvent.keyCode = 9;
    
    if(oEvent.srcElement.id == 'txtPacCep')
        getEndereco('txtPacCep');
  }  
  if(oTarget.type=="text" && oEvent.keyCode==13)
      //return false;
      oEvent.keyCode = 9;
  
  if (oTarget.type=="radio" && oEvent.keyCode==13)
    oEvent.keyCode = 9;
}


function autoTab(){      
    var frm = document.forms[0];
    var el = frm.getElementsByTagName('input');
    var cbo = frm.getElementsByTagName('select');
    
    for(n=0;n<cbo.length;n++)
        addEvent(cbo[n], 'keydown', function(){return TABEnter(event);});
        
    for(c=0;c<el.length;c++)
        addEvent(el[c], 'keydown', function(){return TABEnter(event);})
}   

/**********************************************************
Verifica se a data digitada existe
**********************************************************/
function checkDate(txt){
    var expReg = /^(([0-2]\d|[3][0-1])\/([0]\d|[1][0-2])\/[1-2][0-9]\d{2})$/;
    var msgErro = '';
    var vdt = new Date();
    var vdia = vdt.getDay();
    var vmes = vdt.getMonth();
    var vano = vdt.getYear();
    
    if(txt.value != ''){ 
        if (txt.value.match(expReg)){
            var dia = txt.value.substring(0,2);
            var mes = txt.value.substring(3,5);
            var ano = txt.value.substring(6,10);
            
            if((mes==04 && dia > 30) || (mes==06 && dia > 30) || (mes==09 && dia > 30) || (mes==11 && dia > 30)){                     
                msgErro = 'Dia incorreto !!! O mês especificado contém no máximo 30 dias';                
            } else{
                if(ano%4!=0 && mes==2 && dia>28){  //a4
                    msgErro = 'Data incorreta!! O mês especificado contém no máximo 28 dias';
                } else { 
                    if(ano%4==0 && mes==2 && dia>29){ //a5
                        msgErro =  'Data incorreta!! O mês especificado contém no máximo 29 dias';
                    }
                }
            }
        } else {
            msgErro =  'Data em formato incorreto';            
        }    
    }        
    return msgErro
}    

/**********************************************************
Mascara de data
**********************************************************/
function mascaraData(campoData){   
  var data = campoData.value;          
         
      if (data.length == 2){
          data = data + '/';
          campoData.value = data;       
      }
      if (data.length == 5){
          data = data + '/';
          campoData.value = data;
      }
      return true;
 }
 
/**********************************************************
Verifica a idade atual de acordo com a data de nascimento informada 
**********************************************************/
function getIdade(dataNasc){    
    var campoIdade = o('txtDoaIdade');  
    
    x = dataNasc.split('/');
    h = '13/01/2011'.split('/');

    if(x.length == h.length){            
        idade = h[2] - x[2];         
        if (! isNaN(idade)){                    
            if(parseInt(h[1]) < parseInt(x[1])) {
                idade -= 1;
            }
            else if(parseInt(h[1]) == parseInt(x[1])) {
                if(parseInt(h[0]) < parseInt(x[0])) {
                    idade -= 1;
                }
            }               
            if (idade < 0){                
                return false;
            }     
            else{
                campoIdade.value = idade;
                return true;
            }           
        } else{
            campoIdade.focus();
        }
    }
}    
 
/**********************************************************
Retorna "false" se a tecla digitada nao for numerica     
**********************************************************/
function isNumberKey(evt){    
    var charCode = (evt.which) ? evt.which : event.keyCode;
    
    if(charCode == 8 || charCode == 46)      
        evt.srcElement.value = '';
        
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105))
    return false;

    return true;
}  

/**********************************************************
CEP
**********************************************************/
function getEndereco(field){
    var cep = o(field).value;

    if (window.XMLHttpRequest){
        xhttp=new XMLHttpRequest();
    }
    else{
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    try{        
        o('divWait').style.display = '';
        
        window.setTimeout(function(){                                
            xhttp.open("GET",'viewCep.aspx?cep='+ cep,true);            
            xhttp.onreadystatechange =  function(){
                if (xhttp.readyState == 4) {
                    eval("var infoEndereco = "+ xhttp.responseText);
                    showEndereco(infoEndereco);
                    o('divWait').style.display = 'none';  
                }
            }
            xhttp.send();
       }, 500);
   }
   catch(e){ 
    console.log('Ops, ocorreu um erro. funcção: getEndereco(); ')      
   }
}

function showEndereco(info) {
    o("txtPAC_END").value = info.rua;
    o("txtPAC_BAIRRO").value = info.bairro;
    o("txtPAC_CIDADE").value = info.cidade;
    //o("cboPAC_UF").value = info.uf;
    // console.log(info);
    // console.log(info.uf);
    var cbo = o("cboPAC_UF");
    for (n = 0; n < cbo.length; n++) {
        // console.log(cbo[n].text);
        if (cbo[n].text == info.uf) {
            cbo.selectedIndex = n
            n = cbo.length;
        }
    }
    o("txtPAC_END_NUM").focus();
}

function go(url) { window.location.href= url; } 
function o(id) {return document.getElementById(id); } 
function ce(el){ return document.createElement(el); }

function ajuda(apl, item){
    if(item != '0')
        window.open('http://10.0.0.238/ajuda/default.aspx?apl='+ apl +'&top='+ item, 'w','width=860,height=520,scrollbars=1');
    else
        window.open('http://10.0.0.238/ajuda/default.aspx?apl='+ apl +'', 'w','width=860,height=520,scrollbars=1');
}
function dontShowAgain(div){
    o(div).style.display = 'none';
    setCookie('show', '0', 1);
}

/****************************
Gerenciamento de Cookies 
****************************/

function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name){
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

function checkCookie(){
 var show = getCookie("show");
  if (show!=null && show!=""){
    if(show == '0')
        return false;        
    else
        return true
  } else 
    return true;  
}