// JavaScript Document
function UsageGadget(){
	this.logger = new Logger();

	this.username = '';
	this.password = '';
	this.style = '';
	this.refreshInterval = '';
	this.interval = null;
	this.useLog = false;

	this.methods = [];
	this.styles = [];

	this.methodTry = 0;
	this.lastStatus = 'As of never';

	System.Gadget.settingsUI = "settings.html";

	//Load defaults
	this.LoadDefaults = function(override){
							//Set default style
							if(System.Gadget.Settings.read("style") == '' || System.Gadget.Settings.read("style") == null || override)
									System.Gadget.Settings.write("style", this.styles[0].uid);
									
							//Set default refresh Interval
							if(System.Gadget.Settings.read("refreshInterval") == '' || System.Gadget.Settings.read("refreshInterval") == null || override)
								System.Gadget.Settings.write("refreshInterval", this.Defaults.refreshInterval);
								
							if(System.Gadget.Settings.read("bigpondUsername") == null || override)
								System.Gadget.Settings.write("bigpondUsername", '');
							
							if(System.Gadget.Settings.read("bigpondPassword") == null || override)
								System.Gadget.Settings.write("bigpondPassword", '');
								
							if(System.Gadget.Settings.read("useErrorLog") == '' || System.Gadget.Settings.read("useErrorLog") == null || override)
								System.Gadget.Settings.write("useErrorLog", this.Defaults.useErrorLog);
						}

	this.SetStyle = 	function(){
							var stylename = System.Gadget.Settings.read("style");
							this.style = this.styles[0]; //Sets a default just in case one can't be found
	
							for(var i = 0; i < this.styles.length; i++){
								if(this.styles[i].uid == stylename){
									this.style = this.styles[i];
									break;	
								}
							}
						}

	//Initialise the gadget
	this.Initialise = 	function(firstRun){
							this.LoadDefaults(false);
							this.SetStyle();
							this.style.initialise(firstRun);
						
							var that = this;
							System.Gadget.onSettingsClosed = function(event){that.SettingsClosed(event);};
							
							window.clearTimeout(this.interval);
							
							//load login details
							this.username = System.Gadget.Settings.read("bigpondUsername");
							this.password = System.Gadget.Settings.read("bigpondPassword");
							
							//Load other settings
							this.useLog = System.Gadget.Settings.read("useErrorLog");
								
							this.retrieveData();
						}
	
	this.retrieveData = function(){
							
							if(this.username == '' || this.password == '')
							{
								this.SetStatus("Check Settings");
								return;	
							}
							
							if(this.useLog){
								this.logger.user = this.username;
								this.logger.Open();
							}
							
							this.SetStatus("REFRESHING");

							this.logger.LogMessage("INFO", "Logging in using " + this.username);
							
							var that = this;
							var loginPage = new WebLoading(this.logger);
							loginPage.method = 'POST';
							loginPage.headers.push(new RequestHeader('Content-Type', 'application/x-www-form-urlencoded'));
							loginPage.postdata = "username=" + this.username + "&password=" + this.password;
							loginPage.onsuccess = function(responseText){that.LoginOK(responseText);};
							loginPage.onfail = function(){that.LoginFail();};
							loginPage.url = 'https://signon.telstra.com.au:443/login';
							loginPage.waitFor200 = false;
							loginPage.LoadPage();
						}
						
	this.LoginOK = 		function(responseText){
							if(responseText == ''){//Successful logins attempt to redirect to a new page so no returned content.
								this.logger.LogMessage("INFO", "Successfully logged in.");
								this.methodTry = 0;
								this.CheckNextMethod();
							}else{ //Failed login loads content
								this.logger.LogMessage("ERROR", "Incorrect username or password entered.");
								this.SetStatus("Wrong user details");
								this.FinalActions(false);
							}
						}
					
	this.LoginFail = 	function(){
							this.logger.LogMessage("ERROR", "Unable to load login webpage. Could it be an internet connectivity problem?");
							this.SetStatus('Failed log in');
							this.FinalActions(false);
						}
						
	this.CheckNextMethod = 	function()
							{
								try{
									if(this.methodTry < this.methods.length)
										this.methods[this.methodTry++].Run();
									else{
										this.logger.LogMessage("ERROR", "Tried all the methods possible but couldn't load your data. This usually occurs when Bigpond's usage meter is down.");

										if(System.Gadget.Settings.read("hideFailedMessages"))
											this.SetStatus(this.lastStatus);	
										else
											this.SetStatus("Update Failed");
										
										this.FinalActions(false);
									}
								}catch(err){
									this.logger.LogMessage("ERROR", "Error occurred while running an update method. Method: " + this.methods[this.methodTry - 1].uid + ". Error: " + err.message);
									this.CheckNextMethod();
								}
							}
	
	this.FinalActions =	function(success)
						{
							if(success){
								//Set gadget refresh timer	
								this.refreshInterval = System.Gadget.Settings.read("refreshInterval");
								this.logger.LogMessage("INFO", "Next update scheduled for " + this.refreshInterval + " minutes from now.");
							}else{
								this.refreshInterval = 10;
								this.logger.LogMessage("INFO", "Since the update failed, the next update scheduled for " + this.refreshInterval + " minutes from now.");
							}

							var refreshIntervalMS = this.refreshInterval * 60 * 1000;
							var that = this;
							this.interval = window.setTimeout(function(){that.retrieveData();}, refreshIntervalMS);
							
							this.logger.Close();
						}
	
	this.SetStatus = 	function(status){
							this.style.SetStatus(status);
						}
						
	this.GetStatus = 	function(){
							return this.style.GetStatus();
						}

	//DataToDisplay Object (see below)
	this.DisplayData = 	function(data)
						{
							this.logger.LogMessage("INFO", "Starting to display data.");
							System.Gadget.Settings.write("telstramethod", this.methods[this.methodTry - 1].uid);
							try{
								if(System.Gadget.Settings.read("overrideQuota"))
									data.allowance = System.Gadget.Settings.read("overrideQuota") * 1000;
								
								if(System.Gadget.Settings.read("includeUnrated"))
									data.totalUsage = +data.totalUsage + +data.unratedUsage;
								
								this.style.DisplayData(data);
							}catch(err){
								this.logger.LogMessage("ERROR", "Error displaying data. Error with style: " + this.style.name);	
							}
							this.UpdateComplete();
						}

	this.UpdateComplete = 	function()
							{
								var lastUpdated = new Date();
								this.logger.LogMessage("INFO", "Updated successfully!");
								
								var hours = lastUpdated.getHours();
								var post = "";
								
								if(System.Gadget.Settings.read("use12hourtime")){
									post = "AM";
									
									if(hours > 12){
										hours -= 12;
										post = "PM";
									}
									
									if(hours == 0)
										hours = 12;
								}
								
								this.lastStatus = "As of "+hours+":"+(lastUpdated.getMinutes() < 10 ? "0" : "")+lastUpdated.getMinutes()+post;
								this.SetStatus("As of "+hours+":"+(lastUpdated.getMinutes() < 10 ? "0" : "")+lastUpdated.getMinutes()+post);	
								
								this.FinalActions(true);
							}
	
	this.SettingsClosed =	function(event)
							{
								if (event.closeAction == event.Action.commit){
									if(this.style.uid != System.Gadget.Settings.read("style")){
										//New style so all old stylesheets should probably be disabled. Allowing a fresh start for the new style
										for(var i = 0; i < document.getElementsByTagName('link').length; i++)
											document.getElementsByTagName('link')[i].disabled = true;
										var t=setTimeout('UsageGadget.Initialise(true)', 500);
									}else
										var t=setTimeout('UsageGadget.Initialise()', 500);
								}
							}
	
	this.Defaults = {
		refreshInterval: 60,
		useErrorLog: false
	};
}

function DataToDisplay() {
	this.totalUsage = 0; //in MB
	this.allowance = 0;
	this.startDate = null;
	this.endDate = null;
	this.unratedUsage = null;
	this.freeUsage = null;
	this.flyoutData = '';
	this.raw = '';
}

function RequestHeader(hname, hvalue){
	this.name = hname;
	this.value = hvalue;	
}

function WebLoading(usagelogger) {
	this.logger = usagelogger;
	
	this.onsuccess = '';
	this.onfail = '';
	this.url = '';
	this.method = 'GET';
	this.headers = [];
	this.postdata = '';
	this.pageRequest = '';
	this.waitFor200 = true;
	this.failed = false;
	
	this.LoadPage = function(){
						this.logger.LogMessage('INFO', 'Loading URL: ' + this.url);
						
						var pageReq = new XMLHttpRequest();
						pageReq.open(this.method, this.url, true);

						for(var i = 0; i < this.headers.length; i++){
							pageReq.setRequestHeader(this.headers[i].name, this.headers[i].value);
						}
						var that = this;
						pageReq.onreadystatechange = function() 
						{
							that.logger.LogMessage('INFO', 'Ready State changed to: ' + pageReq.readyState + '. Status: ' + pageReq.status);
							if (pageReq.readyState == 4) 
							{
								if(that.waitFor200){
									if(pageReq.status == 200)
									{
										that.onsuccess(pageReq.responseText);
									}
								}else{
									that.onsuccess(pageReq.responseText);	
								}
							}
						}

						pageReq.send(this.postdata);

						this.pageRequest = pageReq;
						
						setTimeout( function(){that.Timeout();}, 15000);
					}
	
	this.Timeout = 	function(){
						if(this.pageRequest.readyState != 4 || (this.waitFor200 && this.pageRequest.readyState == 4 && this.pageRequest.status != 200)){
							this.failed = true;
							this.onsuccess = null;
							this.pageRequest.abort();
							this.logger.LogMessage("WARNING", "Request for URL timed out. URL: " + this.url);
							if(this.onfail != '')
								this.onfail();
						}
					}
}