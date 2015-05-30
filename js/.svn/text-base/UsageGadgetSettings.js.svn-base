// JavaScript Document
function UsageGadgetSettings(){
	this.selectedTab = '';
	this.settings = [];
			
	this.Initialise = 	function()
						{
							var that = this;
							System.Gadget.onSettingsClosing = function(event){that.onSettingsClosing(event)};

							for(var i = 0; i < this.settings.length; i++){
								try{
									this.settings[i].Initialise();
									this.AddTab(this.settings[i]);
								}catch(err){ //If this settings group has an error just move onto the next one
									var name = (this.settings[i].name ? this.settings[i].name : "Unknown Settings");
									System.Gadget.document.parentWindow.UsageGadget.logger.LogMessage("DEBUG", "Error loading settings: " + name);
								}
							}

							if(this.settings.length > 0) //Should always be some settings but just in case
								this.ShowTab(this.settings[0].id);
						}
	
	this.AddTab =	function(setting)
					{
						var that = this;
						
						var tabBtn = document.createElement("div");
						tabBtn.id = setting.id + "_tab";
						tabBtn.innerHTML = setting.name;
						tabBtn.className = 'tab';
						tabBtn.onclick = function(){that.ShowTab(setting.id)};
						tabBtn.onmouseover = function(){that.MouseOver('hand', setting.id);};
						tabBtn.onmouseout = function(){that.MouseOver('default', setting.id);};

						var tabContent = document.createElement('div');
						tabContent.id = setting.id;
						tabContent.className = 'tabContent';
						
						try{
							setting.Display(tabContent);
						}catch(err){
						}
						
						document.getElementById('tabs').appendChild(tabBtn);
						document.getElementById('tabContent').appendChild(tabContent);
					}
					
	this.ShowTab = 	function (tab)
					{
						for(var i = 0; i < this.settings.length; i++){
							var backgroundColor = "#f9f9f9";
							var display = "none";
							
							if(this.settings[i].id == tab){
								backgroundColor = "#f0f0f0";
								display = "";
								this.selectedTab = this.settings[i].id;
							}

							document.getElementById(this.settings[i].id + '_tab').style.color = "#000000";
							document.getElementById(this.settings[i].id + '_tab').style.backgroundColor = backgroundColor;
							document.getElementById(this.settings[i].id).style.display = display;
						}
					}
					
	this.MouseOver = 	function(type, tab){
							document.body.style.cursor = type;
							
							if(tab != this.selectedTab){
								var backgroundColor = '#808080';
								var color = '#ffffff';
								
								if(type == 'default'){
									backgroundColor = "#f9f9f9";
									color = "#000000";
								}
								
								document.getElementById(tab + '_tab').style.backgroundColor = backgroundColor;
								document.getElementById(tab + '_tab').style.color = color;
							}
			            }
						
	this.onSettingsClosing =	function(event)
								{
									if (event.closeAction == event.Action.commit) {
										
										//Validate any settings
										for(var i = 0; i < this.settings.length; i++){
											try{
												this.settings[i].ValidateSettings(event);
												if(event.cancel) //Failed to validate settings
													return;
											}catch(err){
												var name = (this.settings[i].name ? this.settings[i].name : "Unknown Settings");
												System.Gadget.document.parentWindow.UsageGadget.logger.LogMessage("DEBUG", "Error validating settings: " + name);

												event.cancel = true;
												return;
											}
										}
										
										//All settings validated so go ahead and save them!
										if(!event.cancel){
											for(var i = 0; i < this.settings.length; i++){
												try{
													this.settings[i].SaveSettings(event);
												}catch(err){
													var name = (this.settings[i].name ? this.settings[i].name : "Unknown Settings");
													System.Gadget.document.parentWindow.UsageGadget.logger.LogMessage("DEBUG", "Error saving settings: " + name);
													
													event.cancel = true;
													return;
												}
											}
										}
									}
									
									event.cancel = false; //Allows the settings page to close
								}
	
	this.SetStatus =	function(message)
						{
							document.getElementById('status').innerHTML = message;	
						}
}