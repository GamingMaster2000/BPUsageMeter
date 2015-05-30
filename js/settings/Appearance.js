// JavaScript Document
function Appearance(){
	this.id = 'appearance';
	this.name = 'Appearance';	
	this.priority = 20;
	this.styles = [];
	this.style = null;
		
	this.Initialise = 	function ()
						{
							LoadJSFiles(System.Gadget.path + "\\js\\styles", this.styles);
							
							var stylename = System.Gadget.Settings.read("style");
							this.style = this.styles[0]; //Sets a default just in case one can't be found
	
							for(var i = 0; i < this.styles.length; i++){
								if(this.styles[i].uid == stylename){
									this.style = this.styles[i];
									break;	
								}
							}
						}
						
	this.Display = 	function (tabContent)
					{
						var container = document.createElement('div');
						container.innerHTML = '<strong>Select Style:</strong> ';
						
						var selector = document.createElement('select');
						selector.id = 'styleSelect';
						
						container.appendChild(selector);
						container.appendChild(document.createElement('hr'));
						
						for(var i = 0; i < this.styles.length; i++){
							//Add option to the style selector
							var option = document.createElement('option');
							option.value = this.styles[i].uid;
							option.text = this.styles[i].Name;
							
							var styleSettings = document.createElement('div');
							styleSettings.id = 'appearance_' + this.styles[i].uid + '_settings';
							container.appendChild(styleSettings);
														
							if(this.styles[i].uid == this.style.uid){
								option.selected = true;
							}else{
								styleSettings.style.display = "none";
							}
								
							selector.add(option);
							
							//Load any style settings that may be there!
							try{
								this.styles[i].LoadSettings(styleSettings);
							}catch(err){	
							}
						}
						
						var that = this;
						selector.onchange = function(){that.ShowStyleSettings(this)};

						tabContent.appendChild(container);
					}

	this.ShowStyleSettings = 	function(selector)
								{
									var	uid = selector.options[selector.selectedIndex].value;							
									for(var i = 0; i < this.styles.length; i++){
										document.getElementById('appearance_' + this.styles[i].uid + '_settings').style.display = "none";
										
										if(uid == this.styles[i].uid)
											document.getElementById('appearance_' + this.styles[i].uid + '_settings').style.display = '';
									}
								}
								
	this.ValidateSettings = function(event)
							{
								for(var i = 0; i < this.styles.length; i++){
									this.styles[i].ValidateSettings(event);
									if(event.cancel)
										return;	
								}
							}
							
	this.SaveSettings = function(event)
						{
							var selector = document.getElementById('styleSelect');
							System.Gadget.Settings.write("style", selector.options[selector.selectedIndex].value);
							
							for(var i = 0; i < this.styles.length; i++){
								this.styles[i].SaveSettings(event);
							}
						}
}