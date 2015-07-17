// JavaScript Document
function About(){
	this.id = 'about';
	this.name = 'About';
	this.priority = 40;
	
	this.updateBox = null;
	this.versionInfo = null;
	this.latestMethod = null;
	
	this.Initialise = 	function ()
						{
						}
	
	this.Display = 	function (tabContent)
					{
						this.updateBox = document.createElement('div');
						this.updateBox.id = 'updateBox';
						this.updateBox.className = 'noUpdateAvailable';
						this.updateBox.innerHTML = 'No updates available.';
						
						tabContent.appendChild(this.updateBox);
						tabContent.appendChild(document.createElement('hr'));
						
						var currentVersionBox = document.createElement('div');
						currentVersionBox.className = 'font';
						currentVersionBox.innerHTML = 'Current Version: ';

						this.versionInfo = document.createElement('span');
						this.versionInfo.id = 'updateMethod';
						this.versionInfo.innerHTML = System.Gadget.version;
						
						currentVersionBox.appendChild(this.versionInfo);
						tabContent.appendChild(currentVersionBox);
						tabContent.appendChild(document.createElement('hr'));
						
						var latestMethodBox = document.createElement('div');
						latestMethodBox.className = 'font';
						latestMethodBox.innerHTML = 'Last Update Method Used: ';
												
						this.latestMethod = document.createElement('span');
						latestMethodBox.appendChild(this.latestMethod);
						this.DisplayMethod();
						
						tabContent.appendChild(latestMethodBox);
						tabContent.appendChild(document.createElement('hr'));
						
						var gadgetByBox = document.createElement('div');
						gadgetByBox.className = 'font';
						gadgetByBox.innerHTML = 'Gadget by <a href="http://www.gm2k.net/gadgets/bpusagemeter/">GM2K</a>.';
						
						tabContent.appendChild(gadgetByBox);
						tabContent.appendChild(document.createElement('hr'));
						
						var disclaimerBox = document.createElement('div');
						disclaimerBox.className = 'font';
						disclaimerBox.innerHTML = 'Disclaimer: This gadget is not associated with Telstra Bigpond';
						
						tabContent.appendChild(disclaimerBox);
						
						this.CheckForUpdates();
					}
					
	this.CheckForUpdates = 	function()
							{
								var that = this;
								var versionPage = new System.Gadget.document.parentWindow.WebLoading(System.Gadget.document.parentWindow.UsageGadget.logger);
								versionPage.method = 'GET';
								versionPage.onsuccess = function(responseText){that.VersionPageLoaded(responseText);};
								versionPage.url = 'http://www.gm2k.net/gadgets/bpusagemeter/bpmeterversion.html';
								versionPage.LoadPage();
							}
	
	this.VersionPageLoaded = 	function(responseText)
								{
									if(!responseText)
										return;

									var currentVersion = System.Gadget.version.split(".");
									var latestVersion = responseText.split(".");
									var updateAvailable = false;
									var versionAccuracy = 3;
									
									if(currentVersion.length < versionAccuracy || latestVersion.length < versionAccuracy){
										for(var i = 1; i <= versionAccuracy; i++){
											if(currentVersion.length < i)
												currentVersion.push(0);
											
											if(latestVersion.length < i)
												latestVersion.push(0);
										}
									}
									
									for(var i = 0; i < latestVersion.length; i++){
										if(latestVersion[i] > currentVersion[i]){
											updateAvailable = true;
											break;
										}else if(latestVersion[i] == currentVersion[i]){
											continue;	
										}else{
											break;	
										}
									}
									
									if(updateAvailable){
										this.versionInfo.innerHTML += ' | Latest Version: ' + responseText;
										this.updateBox.className = 'updateAvailable';
										this.updateBox.innerHTML = '<a href="http://www.gm2k.net/gadgets/bpusagemeter/">Update Available. CLICK HERE.</a>';
									}
								}
								
	this.DisplayMethod =	function()
							{
								var method = System.Gadget.Settings.read("telstramethod");
								
								//No need to check. Already know there's none.
								if(!method){
									this.latestMethod.innerHTML = 'None';
									return;
								}
								
								var methods = System.Gadget.document.parentWindow.UsageGadget.methods;
								
								for(var i = 0; i < methods.length; i++){
									if(methods[i].uid == method){
										this.latestMethod.innerHTML = methods[i].name/* + ' '*/;

										/*var that = this;
										var resetLink = document.createElement('a');
										resetLink.href = "#";
										resetLink.innerHTML = 'Reset';
										resetLink.onclick = function(){that.ResetMethod(); return false;};

										this.latestMethod.appendChild(resetLink);	*/
										return;
									}
								}
								
								this.latestMethod.innerHTML = 'None'; //Just in case the set method couldn't be found
							}

	this.ResetMethod = 	function()
						{
							System.Gadget.Settings.write('telstramethod', '');
							this.DisplayMethod();
						}

	this.ValidateSettings = function(event)
							{
								
							}
							
	this.SaveSettings = function(event)
						{
						}
}