windowBox = {
    largura: 300,
    altura: 150,
    titulo: '',
    texto: '',
    tipo: 0,
    tempoAlerta: 1000,
    tempoAnimacao: 10,
    intervalAnimacao: null,
    obj: null,
    executa: function () { },
    btnNao: null,
    btnSim: null,
    divGeral: null,
    divBox: null,
    headerBox: null,
    tituloBox: null,
    corpoBox: null,
    rodapeBox: null,
    divBotao: null,
    divClearfix: null,
    spanTitulo: null,
    divTexto: null,
    spanEspacamento: null,
    ifr: null,
    url: null,
    criaBox: function () {
        with (windowBox) {
            // console.log("abre box 2.0");
            fechaBox();
            //------------------------------------------
            btnNao = document.createElement('a');
            btnSim = document.createElement('a');
            divGeral = document.createElement('div');
            divBox = document.createElement('div');
            headerBox = document.createElement('header');
            tituloBox = document.createElement('h1');
            corpoBox = document.createElement('section');
            rodapeBox = document.createElement('footer');
            divBotao = document.createElement('div');
            divClearfix = document.createElement('div');
            spanTitulo = document.createElement('span');
            divTexto = document.createElement('div');
            spanEspacamento = document.createElement('span');
            ifr = document.createElement('iframe');
            //------------------------------------------
            divGeral.className = 'divGeral';
            divBox.className = 'divBoxMsg fadeIn';
            headerBox.className = 'headerBox';
            corpoBox.className = 'corpoBox';
            divBotao.className = 'divBotaoBox';
            divClearfix.className = 'clearfix';
            rodapeBox.className = 'rodapeBox';
            spanEspacamento.innerHTML = '&nbsp;';
            //------------------------------------------
            with (ifr) {
                src = windowBox.url;
                width = '100%';
                height = '100%';
                frameborder = '0';
                marginwidth = '0';
                marginheight = '0';
            }
            //------------------------------------------
            with (divBotao) {
                if (windowBox.tipo == '1') { // TIPO QUESTÃO!
                    btnSim.innerHTML = 'Sim';
                    btnSim.className = "btn";
                    appendChild(btnSim);
                }
                appendChild(btnNao);
            }
            //------------------------------------------
            tituloBox.innerHTML = titulo;
            divTexto.innerHTML = texto;
            divTexto.className = "divTexto";
            //------------------------------------------
            divGeral.id = 'divGeral';
            //------------------------------------------
            with (rodapeBox) {
                appendChild(divBotao);
                appendChild(divClearfix);
            }
            //------------------------------------------
            with (divBox) {
                //------------------------------------------
                with (style) {
                    width = windowBox.largura + 'px';
                    height = (windowBox.altura <= 0) ? '100%' : windowBox.altura+'px';
                    maxHeight = '90%';
                }
                //------------------------------------------
                id = 'divBox';
                //------------------------------------------
                appendChild(windowBox.retornaTableTitulo(headerBox));
                if (windowBox.tipo == 3) {
                    windowBox.corpoBox.appendChild(windowBox.ifr);
                } else {
                    corpoBox.appendChild(divTexto);
                } 
                appendChild(windowBox.corpoBox);
                //------------------------------------------
            }
            //------------------------------------------
            with (btnNao) {
                //------------------------------------------
                switch (windowBox.tipo) {
                    case 1: 
                        innerHTML = 'Não';
                        className = "btn btn-danger";
                        onclick = new Function("windowBox.fechaBox();");
                        break;
                    case 2: 
                        innerHTML = 'Ok'; 
                        onclick = new Function("windowBox.fechaBox();");
                        className = "btn btn-success";
                        break;
                    case 3: 
                        innerHTML = 'Fechar'; 
                        onclick = new Function("windowBox.fechaBox(); windowBox.executa();");
                        className = "btn btn-danger";
                        break;
                }
                // - bug - nao envia _postBack quando clica no botao fechar;
                // onclick = new Function("windowBox.fechaBox();");
                setAttribute('href', "javascript:void(0);");
                //------------------------------------------
            }
            //------------------------------------------
            with (btnSim) {
                //------------------------------------------
                setAttribute('href', "javascript:void(0);");
                onclick = new Function("windowBox.fechaBox(); windowBox.executa();");
            }
            //------------------------------------------
            divBox.onkeydown = new Function("windowBox.verficaTecla(event);");
            //------------------------------------------
            switch (windowBox.tipo) {
                case 0: // Mensagem com Animação!
                    divBox.style.marginBottom = '-' + altura + 'px';
                    divBox.style.bottom = '-' + getScrollYX()[0] + 'px';
                    // addEvent(window, 'scroll', windowBox.reposicionaDivMsg);
                    setTimeout(function () { animacaoMsg(); }, tempoAnimacao);
                    break;
                case 1: case 2: case 3: //Se for tipo igual a tipo de confirmação ou Msg de OK!
                    //------------------------------------------
                    with (windowBox.divBox) {
                        className = 'divBox';
                        appendChild(rodapeBox);
                    }
                    //------------------------------------------
                    document.body.appendChild(divGeral);
                    if (windowBox.tipo != '3')
                        divGeral.onkeydown = new Function("windowBox.verficaTecla(event);");
                    atrelaEventos();
                    break;
            }
            //------------------------------------------
            document.body.appendChild(divBox);
            //------------------------------------------
            if (typeof (btnNao) == Object) btnNao.focus();
            //------------------------------------------
        }
    },
    retornaTableTitulo: function (headerBox) {
        var btFechar = document.createElement('a')
        with (btFechar) {
            className = "close";
            innerHTML = "×";
            setAttribute("rel","tooltip");
            setAttribute("data-placement","bottom");
            setAttribute("title","Fechar");
            onclick = new Function("windowBox.fechaBox(); windowBox.executa();");
            setAttribute('href', "javascript:void(0);");
        }

        with (headerBox) {
            className = "headerBox";
            appendChild(windowBox.tituloBox);
            appendChild(btFechar);
        }
        return headerBox;
        //------------------------------------------
    },
    reposicionaDivMsg: function () {
        windowBox.divBox.style.bottom = '-' + getScrollYX()[0] + 'px';
        windowBox.divBox.style.right = '-' + getScrollYX()[1] + 'px';
    },
    animacaoMsg: function () {
        var valorAtual = parseInt(windowBox.divBox.style.marginBottom.replace('px', ''))
        var proximoValor = valorAtual + 3;
        if (!isNaN(valorAtual)) {
            windowBox.divBox.style.marginBottom = proximoValor + 'px';
            if (parseInt(proximoValor) >= 30) {
                setTimeout(function () { windowBox.fechaMsg(); }, windowBox.tempoAlerta);
            } else {
                setTimeout(function () { windowBox.animacaoMsg(); }, windowBox.tempoAnimacao);
            }
        }
    },
    fechaMsg: function () {
        setTimeout(function() {
            // fadeOut
            windowBox.divBox.className = "divBoxMsg";
            setTimeout(function() {
                try {
                    // removeEvent(window, 'scroll', windowBox.reposicionaDivMsg);
                    windowBox.fechaBox();
                }catch(e) {}
            }, 500);
        }, windowBox.tempoAlerta);
    },
    fechaBox: function () {
        if (document.getElementById('divGeral')) {
            document.body.removeChild(document.getElementById('divGeral'));
            // removeEvent(window, 'scroll', windowBox.resizeDiv);
            removeEvent(window, 'resize', windowBox.resizeDiv);
        }
        if (document.getElementById('divBox')) document.body.removeChild(document.getElementById('divBox'));
    },
    verficaTecla: function (e) {
        var keyCode = e.keyCode;
        if (keyCode == 27 || keyCode == 13 || keyCode == 32) {
            windowBox.fechaBox();
        } else if (windowBox.tipo == '1' && keyCode == 83)
            windowBox.btnSim.click();
    },
    atrelaEventos: function () {
        // addEvent(window, 'scroll', windowBox.resizeDiv);
        addEvent(window, 'resize', windowBox.resizeDiv);
        windowBox.resizeDiv();
        var timer = setTimeout(function(){
            windowBox.resizeDiv();
        },20);
    },
    resizeDiv: function () {
        with (windowBox.divGeral.style) {
            width = (parseInt(GetSize()[1]) + parseInt(getScrollYX()[1])) + 'px';
        }
        with (windowBox.divBox.style) {
            left = (parseInt(GetSize()[1]) / 2) + parseInt(getScrollYX()[1]) - (parseInt(windowBox.largura) / 2) + 'px';
        }
        with (windowBox) {
            divBox.style.marginTop = '-'+parseInt(divBox.offsetHeight / 2)+'px';
            divBox.style.top = '50%';
        }
    },
    isNumber: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}