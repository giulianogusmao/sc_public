<!--
var timeout         = 500;
var closetimer	    = 0;
var ddmenuitem      = 0;
var ddmenu          = 0;

function mopen(id)
{	
	mcancelclosetime();
	if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
	if(ddmenu) ddmenu.style.backgroundColor = 'transparent';
	ddmenuitem = document.getElementById('m' + id);
	ddmenu = document.getElementById('a' + id);
	ddmenu.style.backgroundColor = '#FFFFFF';
	ddmenuitem.style.visibility = 'visible';
}

function mclose()
{
    imgclose();
    
	if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
	if(ddmenu) ddmenu.style.backgroundColor = 'transparent';
	
}

function mclosetime()
{
	closetimer = window.setTimeout(mclose, timeout);
}

function mcancelclosetime()
{
	if(closetimer)
	{
		window.clearTimeout(closetimer);
		closetimer = null;
	}
}

function iniciaMenu(id){
	var vid;
	menu = document.getElementById(id);
	for(i=0;i<menu.childNodes.length;i++){
		if(menu.childNodes[i].tagName == 'LI'){
			with(menu.childNodes[i]){
			    if(childNodes[0].tagName == 'A'){
				    with(childNodes[0]){
					    id = 'a' + i;					    
					    onmouseover = new Function("mopen('" + i + "');");					    
					    onmouseout = new Function("mclosetime();");					    
				    }	
				    //alert(childNodes[1]);
				    with(childNodes[1]){
					    id = 'm' + i;					    
					    onmouseover = new Function("mcancelclosetime();");
					    onmouseout = new Function("mclosetime();");
				    }
		        }							
			}
		}
	}
}
function imgclose(){    
    try{
        if(document.getElementById('imgtip')){
           document.getElementById('imgtip').style.display = 'none';
        }
    }
    catch(e){
        
    }
}
window.onload = new Function("iniciaMenu('sddm');");
document.onclick = mclose; 
// -->