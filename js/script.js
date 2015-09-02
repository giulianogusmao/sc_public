      /******************************************
       CORP (Biblioteca)
      ******************************************/ 
      var corp = {
        tls : {
            fadeOpacity : function(id){
                try{
			        var el = document.getElementById(id);
			        if(typeof el.initOpacity=="undefined") el.initOpacity=1;
			        if(el.initOpacity<=100){			            			            
			            corp.tls.opacity(el,el.initOpacity)
			            el.initOpacity+=10;
			            corp.tm.out("corp.tls.fadeOpacity('"+id+"')",50);
			        }else{			            
			            el.initOpacity=1;
			        }
			     }catch(e){}
			},	         
            opacity : function(el,opa){
                try{                      
                    if(corp.tls.isIE())
                        el.style.filter = "alpha(opacity="+opa+")";
                    else                        
                        if(el.style.opacity != undefined || el.style.opacity != null)
                            el.style.opacity =opa/100;
                        else
                            el.style.MozOpacity =opa/100;
                            
                }catch(e){};                        
            },                        
            ce : function(el){
                return document.createElement(el);
            },
            id : function(id){
                if (document.getElementById)
                    return document.getElementById(id);
                else if (document.all)
                    return document.all(id);
            },
            isObj : function(el){
                return (typeof(el)!= "undefined" && el!=null) ? true : false;
            },
            events: function (evt){
                evt = evt || window.event;
                return evt;            
            },                        
            srcElem: function(evt){
                evt = corp.tls.events(evt);
                if (evt)
                var elem = evt.srcElement || evt.target;
                return elem;
            },            
            key: function(evt){
                evt = corp.tls.events(evt);
                var key = evt.keyCode || evt.which;
                return key;  
            },                                           
            isIE : function() { 
		        var w = window.navigator;		        		        
		        return (/MSIE/ig.test(w.appVersion) || /MSIE/ig.test(w.userAgent));		        
            }  ,    
            ids : function(el,img){
                    var ele = corp.tls.id(el);
                    if (ele != null && typeof(ele) != "undefined" ){
                        ele.title=img;            
                        corp.evt.attEl(ele,"click", function(evt){
                            try{                    
                                ele.style.display="none";
                                var img = corp.tls.id(ele.title);
                                if (img!= null && typeof(img) != "undefined") {
                                    img.style.display="block";                           
                                }
                            }catch(e){};
                        });
                    }
            }
        },
        //####################################################                   
        evt: {
            att: function(ev, fun){
	            if (document.attachEvent)
		            document.attachEvent('on' + ev, fun);
	            else
		            document.addEventListener(ev, fun, true);	
            },             
            attEl: function (el, ev, fun){
	            if (el.attachEvent)
		            el.attachEvent('on' + ev, fun);
	            else
		            el.addEventListener(ev, fun, true);	
            },                     
            remove: function (el, ev){
                if (el.detachEvent)
		            el.detachEvent('on' + ev, fun);
	            else
		            el.removeEventListener(ev, fun, false);
            }                                  
        },
        tm : {
            out: function(code,delay){
                window.setTimeout(code,delay);
            },
            int: function(code,delay){
                window.setInterval(code,delay);
            },
            cOut: function(tmr){
                window.clearTimeout(tmr);
            },                        
            cInt: function(tmr){
                window.clearInterval(tmr);
            }        
       }  
      }