// JavaScript Document
function gm2k300(){
	this.uid = 'gm2k300';
	this.name = 'GM2K 3.0.0';
	this.priority = 10;
	this.enabled = true;
	
	this.accountId = '';
	this.serviceId = '';
	
	this.Run =	function()
				{
					UsageGadget.logger.LogMessage("INFO", "Running method: " + this.name);

					var that = this;
					var servicesPage = new WebLoading(UsageGadget.logger);
					servicesPage.onsuccess = function(responseText){that.ServicesPageLoaded(responseText);};
					servicesPage.onfail = function(){that.FailedPageLoading();};
					servicesPage.url = 'https://www.my.telstra.com.au/myaccount/overview';
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
										var overviewPage = document.createElement('div');
										overviewPage.innerHTML = responseText;
										var internetRows = overviewPage.getElementsByTagName("a");
										var urlOfUsage = 'internet-daily-usage.json';
										for(var i = 0; i < internetRows.length; i++){
											try{
												if(internetRows[i].getElementsByTagName('i').length < 1)
													continue;

												if(internetRows[i].getElementsByTagName('i')[0].innerHTML == UsageGadget.username){
													var url = internetRows[i].href;
													
													var regex = new RegExp("accountId=([a-zA-Z0-9]+).*?serviceId=([a-zA-Z0-9]+)", "g");
													var details = regex.exec(url);
													
													this.accountId = details[1];
													this.serviceId = details[2];
													break;
												}
											}catch(err){
											}
										}
										
										//Throw an error if details not found.
										//Sometimes caused it to get stuck on 'REFRESHING'
										if(this.accountId == '' || this.serviceId == ''){
											UsageGadget.logger.LogMessage("ERROR", "Couldn't find accountId or serviceId.");
											UsageGadget.CheckNextMethod();
											return;									
										}
										
										var that = this;
										var detailsPage = new WebLoading(UsageGadget.logger);
										detailsPage.onsuccess = function(responseText){that.DetailsLoaded(responseText);};
										detailsPage.onfail = function(){that.FailedPageLoading();};
										detailsPage.url = 'https://www.my.telstra.com.au/myaccount/internet-daily-usage.json?accountId=' + this.accountId + '&serviceId=' + this.serviceId;
										detailsPage.LoadPage();
									}catch(err){
										UsageGadget.logger.LogMessage("ERROR", "Couldn't find accountId or serviceId.");
										UsageGadget.CheckNextMethod();
										return;
									}
								}
								
	this.DetailsLoaded =	function(responseText)
							{
								UsageGadget.logger.LogMessage("INFO", "Getting usage info and passing it to the gadget to display!");
								try{
									var usageInfo = JSON.parse(responseText);
									var data = new DataToDisplay();
									var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
									
									data.totalUsage = usageInfo.result.totalUsage;
									data.allowance = usageInfo.result.allowanceUsage;
									
									//Sometimes the start/end dates are wrong (Turns out it's to do with timezones)
									//Try a messy (but more accurate) way first but
									//fall back to Telstra provided values if necessary
									try{
										var Period = /^\(([0-9]+ [a-z]+) - ([0-9]+ [a-z]+)\)$/i.exec(usageInfo.result.headerDateRange);
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
									}catch(err){
										data.startDate = usageInfo.result.startDate;
										data.endDate = usageInfo.result.endDate;
									}
																											
									//Try to avoid some Telstra issues.
									if(data.allowance > 0){
										System.Gadget.Settings.write("lastGoodAllowance", data.allowance);
										System.Gadget.Settings.write("lastGoodStart", data.startDate);
										System.Gadget.Settings.write("lastGoodEnd", data.endDate);
									}else{
										data.allowance = System.Gadget.Settings.read("lastGoodAllowance");
										data.startDate = System.Gadget.Settings.read("lastGoodStart");
										data.endDate = System.Gadget.Settings.read("lastGoodEnd");
									}
																	
									var unratedUsage = 0;
									try{
										for(var i = 0; i < usageInfo.result.usageList.length; i++){
											unratedUsage += usageInfo.result.usageList[i].unratedUsage;
										}
									}catch(err){
										UsageGadget.logger.LogMessage("ERROR", "Couldn't get 'Unrated Usage'. Error: " + err.message);
									}
									
									data.unratedUsage = unratedUsage;
									
									data.flyoutData = this.BuildFlyoutPage(usageInfo, data);
									data.raw = responseText;
									
									UsageGadget.DisplayData(data);
								}catch(err){
									UsageGadget.logget.LogMessage("ERROR", "Error getting the usage data. Message: " + err.message);	
								}
							}
	
	this.BuildFlyoutPage = 	function (usageInfo, data)
							{
								var usageGb = usageInfo.result.totalUsage / 1000;
								var unratedGb = data.unratedUsage / 1000;
								var allowanceGb = usageInfo.result.allowanceUsage / 1000;
								
								var maxYLabel = (usageInfo.result.maxYAxis > 1000 ? usageInfo.result.maxYAxis / 1000 + 'GB' : usageInfo.result.maxYAxis + 'MB');
								var halfYLabel = (usageInfo.result.maxYAxis / 2 > 1000 ? usageInfo.result.maxYAxis / 2 / 1000 + 'GB' : usageInfo.result.maxYAxis / 2 + 'MB');		
								
								var output = '	<div style="margin-bottom: 10px;">\
													<h5>PLAN DETAILS</h5>\
													<table width="100%" class="font" style="margin-top: 5px;">\
														<tr>\
															<td width="25%" style="font-weight: bold;">Current Account Usage</td>\
															<td>' + usageGb + 'GB (+ ' + unratedGb + 'GB Unrated Usage)</td>\
														</tr>\
														<tr>\
															<td style="font-weight:bold">Current Usage Allowance</td>\
															<td>' + allowanceGb + 'GB</td>\
														</tr>\
														<tr>\
															<td style="font-weight:bold">Account Usage Status</td>\
															<td>' + (usageInfo.result.speedSlowed ? 'Slowed' : 'In Allowance') + '</td>\
														</tr>\
														<tr>\
															<td style="font-weight:bold">Current Bill Period</td>\
															<td>' + usageInfo.result.headerDateRange.substring(1, usageInfo.result.headerDateRange.length - 1) + '</td>\
														</tr>\
													</table>\
												</div>';

								output += '		<div style="margin-top:10px;">\
													<table class="breakdown_table">\
														<thead>\
															<tr>\
																<td>Date</td>\
																<td>Download (MB)</td>\
																<td>Upload (MB)</td>\
																<td>Total (MB)</td>\
																<td>Unmetered (MB)</td>\
																<td>Unrated (MB)</td>\
															</tr>\
														</thead>\
														<tbody>';
								
								var row = 0;
								
								for(var i = 0; i < usageInfo.result.usageList.length; i++){
									output += '				<tr class="row' + (row++ % 2) + '">\
																<td>' + usageInfo.result.usageList[i].usageDisplayDate + '</td>\
																<td>' + usageInfo.result.usageList[i].downloadUsage + '</td>\
																<td>' + usageInfo.result.usageList[i].uploadUsage + '</td>\
																<td>' + usageInfo.result.usageList[i].totalUsage + '</td>\
																<td>' + usageInfo.result.usageList[i].freeUsage + '</td>\
																<td>' + usageInfo.result.usageList[i].unratedUsage + '</td>\
															</tr>';	
								}
								
								output += '				</tbody>\
														<tfoot style="font-weight: bold;">\
															<tr>\
																<td>Total</td>\
																<td>' + usageInfo.result.downloadUsage + '</td>\
																<td>' + usageInfo.result.uploadUsage + '</td>\
																<td>' + usageInfo.result.totalUsage + '</td>\
																<td>' + usageInfo.result.freeUsage + '</td>\
																<td>' + data.unratedUsage + '</td>\
															</tr>\
														</tfoot>\
													</table>\
												</div>';

								return output;	
							}
}