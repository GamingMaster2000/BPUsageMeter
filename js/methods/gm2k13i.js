// JavaScript Document
//NOTE: Due to some restrictions with Gadgets/Javascript and the 
//Bigpond Usage page this method is for we can't call the usage
//page directly so we need to go via custom php webpage.
//This method uses one hosted at gm2k.net but can be hosted anywhere
//so if you want to host your own copy of the file just visit
//http://www.gm2k.net/gadgets/bpusagemeter/external/iframebypass.php
//to download the php script and change the url below.
//Also note: No details are logged with the script.

//If you don't want to use this custom script just delete this file
//from the %LocalAppData%\Microsoft\Windows Sidebar\Gadgets\TelstraUsageMeter.gadget\js
//folder. Deleting this file won't affect the gadget in any way other than
//not being able to use this usage page to grab details.
function gm2k13i(){
	//If you want to host the script yourself just download it (see note at the top of this file)
	//and change this url to wherever you have it hosted.
	this.customScriptURL = 'http://www.gm2k.net/gadgets/bpusagemeter/external/iframebypass.php';
	
	this.uid = 'gm2k13i';
	this.name = 'GM2K 1.3i';
	this.priority = 30;
	
	this.accountId = '';
	this.serviceId = '';

	this.Run =	function()
				{
					UsageGadget.logger.LogMessage("INFO", "Running method: " + this.name);

					//Older methods require a different login page so we need to login "again"
					UsageGadget.logger.LogMessage("INFO", "This method requires a different login page so we're calling that now.");
					var that = this;
					var loginPage = new WebLoading(UsageGadget.logger);
					loginPage.method = 'POST';
					loginPage.headers.push(new RequestHeader('Content-Type', 'application/x-www-form-urlencoded'));
					loginPage.postdata = "username=" + UsageGadget.username + "&password=" + UsageGadget.password;
					loginPage.onsuccess = function(responseText){that.LoginOK(responseText);};
					loginPage.onfail = function(){that.FailedPageLoading();};
					loginPage.url = this.customScriptURL;
					loginPage.waitFor200 = false;
					loginPage.LoadPage();	
				}
	
	this.LoginOK = 	function(responseText)
					{
						var loginOK = /Your username\/password combination is incorrect or incomplete/.exec(responseText);
													
						if (loginOK == "Your username/password combination is incorrect or incomplete"){
							//Shouldn't actually get here since the details should be correct before getting here
							UsageGadget.logger.LogMessage("ERROR", "Logging in failed. Username or Password is incorrect.");
							UsageGadget.CheckNextMethod();
							return;
						}
						
						UsageGadget.logger.LogMessage("INFO", "Getting usage info and passing it to the gadget to display!");

						try{
							var data = new DataToDisplay();
							var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
							var Traffic = Array(5);
							
							var Usage = /<tr class=\"trStyleTotal\">[^`]+?<!-- total usage shown as bold -->[^`]+?>([0-9\-]+)<\/b>/i.exec(responseText);
							var Quota = /Monthly Plan Allowance[^`]+?([0-9:]+\s*(?:G|M|h))/i.exec(responseText);
							var Period = /<tbody>[^`]+?<!-- date column -->[^`]+?>([0-9]{2} [A-Za-z]{3} [0-9]{4})<[^`]+>([0-9]{2} [A-Za-z]{3} [0-9]{4})[^`]+<\/tbody>/i.exec(responseText);
							
							var result = 1;
							
							if(Usage != null)
								data.totalUsage = (Usage[1] == '-' ? '0' : Usage[1]);
							else
								result = 0;
							
							if(Quota != null){
								var allowanceDetails = /([0-9]+)\s*(G|M)/.exec(Quota[1]);
								data.allowance = allowanceDetails[1] * (allowanceDetails[2] == 'G' ? 1000 : 1);
							}else
								result = 0;
								
							if(Period != null){
								var startParts = /([0-9]+) ([a-z]+)/i.exec(Period[1]);
								var endParts = /([0-9]+) ([a-z]+)/i.exec(Period[2]);
								
								if(monthNames[(new Date()).getMonth()] == 'Jan' && startParts[2] == 'Dec'){
									startParts.push((new Date()).getFullYear() - 1);
								}else{
									startParts.push((new Date()).getFullYear());
								}
								
								if(monthNames[(new Date()).getMonth()] == 'Dec' && endParts[2] == 'Jan'){
									endParts.push((new Date()).getFullYear() + 1);	
								}else{
									endParts.push((new Date()).getFullYear());
								}
	
								data.startDate = (new Date(startParts[1] + " " + startParts[2] + " " + startParts[3])).getTime();
								data.endDate = (new Date(endParts[1] + " " + endParts[2] + " " + endParts[3])).getTime();
							}else
								result = 0;
								
							if(result == 0){
								UsageGadget.logger.LogMessage("WARNING", "Required usage information wasn't found. Page is probably not compatible with method " + this.name + ". Trying next method.");
								UsageGadget.CheckNextMethod();
								return;
							}
								
							data.unratedUsage = 0;
						
							try{
								var UnratedUsage = /<tr class="trStyleTotal">[^`]+<td>([^`]+)<\/td>[^`]+?<\/tr>[^`]+?<\/tfoot>/i.exec(responseText);
								data.unratedUsage = UnratedUsage[1];
							}catch(err){
							}
														
							data.flyoutData = this.BuildFlyoutPage(responseText, data);
							data.raw = responseText;
							UsageGadget.DisplayData(data);
						}catch(err){
							UsageGadget.logger.LogMessage("ERROR", "Error getting the usage data. Message: " + err.message);
							UsageGadget.CheckNextMethod();	
						}	
					}
	
	this.FailedPageLoading =	function()
								{
									UsageGadget.logger.LogMessage("WARNING", "Failed to load the webpage.");
									UsageGadget.CheckNextMethod();
								}

	this.BuildFlyoutPage = 	function (content, data)
							{
								try{
									content = content.replace(/\/res\/images/gi, "img");
									var pageTable = /<h5>Volume based usage meter table<\/h5>[\s]*(<table class[^`]+?>[^`]+<\/table>)/.exec(content);
									
									var accountDetails = /<table[^`]+?>([^`]+?Monthly Plan Allowance[^`]+?)<\/table>/i.exec(content);
									accountDetails[1] = accountDetails[1].replace(/<a[^`]+?<\/a>/gi, "");
									accountDetails[1] = accountDetails[1].replace(/class="[^`]+?"/gi, "");
									accountDetails[1] = "<table class=\"accountTable\">" + accountDetails[1] + "</table>";

									var pageHTML = "<h5>PLAN DETAILS</h5>" + accountDetails[1] + "<div class=\"spacer\"></div>" + pageTable[1];
									
									pageHTML = pageHTML.replace(/;jsessionid=[A-Za-z0-9]+/gi, "");
									
									return pageHTML;
								}catch(err){
									
									return '';	
								}
							}
}