// JavaScript Document
// JavaScript Document
function gm2k201(){
	this.uid = 'gm2k201';
	this.name = 'GM2K 2.0.1';
	this.priority = 20;
	
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
					loginPage.url = 'https://signon.bigpond.com/login';
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
							
						var that = this;
						var servicesPage = new WebLoading(UsageGadget.logger);
						servicesPage.onsuccess = function(responseText){that.ServicesPageLoaded(responseText);};
						servicesPage.onfail = function(){that.FailedPageLoading();};
						servicesPage.url = 'https://myaccount.bigpond.com/MyServices.do';
						servicesPage.LoadPage();
					}
	
	this.FailedPageLoading =	function()
								{
									UsageGadget.logger.LogMessage("WARNING", "Failed to load the webpage.");
									UsageGadget.CheckNextMethod();
								}
	
	this.ServicesPageLoaded =	function(responseText)
								{
									try{
										UsageGadget.logger.LogMessage("INFO", "'My Services' page loaded. Loading usage page. Method: " + this.name);
										
										var doc = document.createElement('div');
										doc.innerHTML = responseText;
										
										var pTags = doc.getElementsByTagName("p");
										var usageURL = '';

										for(var i = 0; i < pTags.length; i++){
											if(pTags[i].innerHTML == 'Username: ' + UsageGadget.username){
												if(/view usage/ig.exec(pTags[i].parentNode.innerHTML)){
													var linkItems = pTags[i].parentNode.getElementsByTagName('a');
													for(var j = 0; j < linkItems.length; j++)
														if(linkItems[j].innerHTML == 'View usage'){
															usageURL = linkItems[j].href.replace("x-gadget://", "");
															break;	
														}
												}
											}
										}

										if(usageURL == ''){
											UsageGadget.logger.LogMessage("ERROR", "Couldn't find usage URL.");
											UsageGadget.CheckNextMethod();
											return;
										}

										usageURL = "https://myaccount.bigpond.com" + usageURL;

										var that = this;
										var detailsPage = new WebLoading(UsageGadget.logger);
										detailsPage.onsuccess = function(responseText){that.DetailsLoaded(responseText);};
										detailsPage.onfail = function(){that.FailedPageLoading();};
										detailsPage.url = usageURL;
										detailsPage.LoadPage();										
									}catch(err){
										UsageGadget.logger.LogMessage("ERROR", "Couldn't find usage URL. Message: " + err.message);
										UsageGadget.CheckNextMethod();
									}
								}
								
	this.DetailsLoaded =	function(responseText)
							{
								UsageGadget.logger.LogMessage("INFO", "Getting usage info and passing it to the gadget to display!");
								try{
									var data = new DataToDisplay();
									var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
									var result = 1;

									var Usage = /<tr class=\"trStyleTotal\">[^`]+?<!-- total usage shown as bold -->[^`]+?>([0-9\-]+)<\/b>/i.exec(responseText);
									var Quota = /Monthly Allowance[^`]+?([0-9:]+\s*(?:G|M|h))/i.exec(responseText);
									var Period = /<tbody>[^`]+?<!-- date column -->[^`]+?>([0-9]{2} [A-Za-z]{3} [0-9]{4})<[^`]+>([0-9]{2} [A-Za-z]{3} [0-9]{4})[^`]+<\/tbody>/i.exec(responseText);
	
									if(Usage != null)
										data.totalUsage = (Usage[1] == '-' ? 0 : Usage[1]);
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
										var UnratedUsage = document.getElementsByClassName("usage bottom_margin")[0];
										UnratedUsage = UnratedUsage.getElementsByTagName('tfoot')[0];
										UnratedUsage = UnratedUsage.getElementsByTagName('td')[UnratedUsage.getElementsByTagName('td').length].innerHTML;
										data.unratedUsage = UnratedUsage;
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
	
	this.BuildFlyoutPage = 	function (content, data)
							{
								try{
									content = content.replace(/\/res\/images/gi, "img");
		
									var pageTable = /<h5>Volume based usage meter table<\/h5>[\s]*(<table class[^`]+?>[^`]+<\/table>)/.exec(content);
									
									var accountDetails = /<table[^`]+?>([^`]+?Monthly Allowance[^`]+?)<\/table>/i.exec(content);
									accountDetails[1] = accountDetails[1].replace(/<a[^`]+?<\/a>/gi, "");
									accountDetails[1] = accountDetails[1].replace(/class="[^`]+?"/gi, "");
									accountDetails[1] = "<table class=\"accountTable\">" + accountDetails[1] + "</table>";

									var pageHTML = "<h5>PLAN DETAILS</h5>" + accountDetails[1] + "<div class=\"spacer\"></div>" + pageTable[1];
									
									return pageHTML;
								}catch(err){
									return '';	
								}
							}
}