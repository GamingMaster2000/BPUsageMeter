// JavaScript Document
function LoadJSFiles(path, arrayToStore){
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var folder = fso.GetFolder(path);
	var fc = new Enumerator(folder.files);

	for(; !fc.atEnd();fc.moveNext()){
		try{
			var fileref = document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", fc.item())
				
			document.getElementsByTagName("head")[0].appendChild(fileref)
							
			var classname = fc.item() + "";
			classname = classname.toString().replace(path + "\\", "").replace(".js", "");
			
			arrayToStore.push(new window[classname]());
		}catch(err){	
		}
	}	
	
	//If priority isn't defined it'll fail gracefully
	try{
		arrayToStore.sort(function(a, b){return a.priority-b.priority});
	}catch(err){	

	}
}

function Radio_Value_Get(radioObj) 
{
	if(!radioObj)
		return "";

	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}