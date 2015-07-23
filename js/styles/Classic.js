// JavaScript Document
function Classic(){
	this.uid = 'style_classic';
	this.timeTransition = 2;
	this.Name = 'Classic';
	this.priority = 10;
	this.flyoutData = null;
	
	this.initialise = 	function(firstRun){
							if(firstRun){
								var dockedCSS=document.createElement("link");
								dockedCSS.setAttribute("rel", "stylesheet");
								dockedCSS.setAttribute("type", "text/css");
								dockedCSS.setAttribute("href", "css/style_docked.css");
								dockedCSS.setAttribute("id", "styleDocked");
								dockedCSS.setAttribute("title", "docked");
								
								var undockedCSS=document.createElement("link");
								undockedCSS.setAttribute("rel", "stylesheet");
								undockedCSS.setAttribute("type", "text/css");
								undockedCSS.setAttribute("href", "css/style_undocked.css");
								undockedCSS.setAttribute("id", "styleUndocked");
								undockedCSS.setAttribute("title", "undocked");
								undockedCSS.setAttribute("disabled", true);
								
								document.getElementsByTagName("head")[0].appendChild(dockedCSS);
								document.getElementsByTagName("head")[0].appendChild(undockedCSS);
							}

							var that = this;
							System.Gadget.Flyout.file = "classic_flyout.html";
							System.Gadget.onUndock = function(){that.CheckDockState()};
							System.Gadget.onDock = function(){that.CheckDockState()};

							document.body.innerHTML = '	<div id="mainheader">BIGPOND USAGE</div>\
														<div id="container">\
															<span id="usageOverlay">\
																<div id="usageBlock">\
																	<div id="barEmpty1">\
																		<div id="bar1" class="barFill"><img src="img/1x1pix_trans.gif" width="1" height="1"></div>\
																	</div>\
																	<div id="usageheader">\
																		<div style="float:left">USAGE</div>\
																		<div style="float:right" id="percentUsed">0%</div>\
																	</div>\
																	<div class="font">\
																		<div id="usage" style="float:right;">0 / 0GB</div>\
																	</div>\
																</div>\
															</span>\
															<span id="monthOverlay">\
																<div id="monthBlock">\
																	<div id="barEmpty2">\
																		<div id="bar2" class="barFill"><img src="img/1x1pix_trans.gif" width="1" height="1"></div>\
																	</div>\
																	<div id="monthheader">\
																		<div style="float:left">MONTH</div>\
																		<div style="float:right" id="percentMonth">0%</div>\
																	</div>\
																	<div class="font">\
																		<div id="monthRemaining" style="float:right;">0 DAYS</div>\
																	</div>\
																</div>\
															</span>\
															<div id="controlBlock">\
																<div class="icon icon-paper" onMouseOver="UsageGadget.style.SetIconColour(\'details\', \'over\')" onMouseOut="UsageGadget.style.SetIconColour(\'details\', \'normal\')" onClick="UsageGadget.style.OpenFlyout();">\
																	<div id="icon-details" class="icon-details"><img src="img/1x1pix_trans.gif" width="9" height="9"></div>\
																	<div id="icon-details-box" class="icon-details-box"><img src="img/1x1pix_trans.gif" width="1" height="1"></div>\
																</div>\
																<div class="icon icon-down" onMouseOver="UsageGadget.style.SetIconColour(\'refresh\', \'over\')" onMouseOut="UsageGadget.style.SetIconColour(\'refresh\', \'normal\')" onClick="UsageGadget.retrieveData();">\
																	<div id="icon-refresh" class="icon-refresh"><img src="img/1x1pix_trans.gif" width="9" height="9"></div>\
																	<div id="icon-refresh-triangle" class="icon-refresh-triangle"><img src="img/1x1pix_trans.gif" width="1" height="1"></div>\
																	<div id="icon-refresh-line" class="icon-refresh-line"><img src="img/1x1pix_trans.gif" width="1" height="1"></div>\
																</div>\
																<div id="lastUpdated" class="font10"" style="float:right;"></div>\
															</div>\
														</div>\
														<div class="font10" id="accountName">' + (System.Gadget.Settings.read('displayAccount') ? System.Gadget.Settings.read('bigpondUsername') : '') + '</div>';

							if (System.Gadget.docked)
								this.setTheme("docked");
							else
								this.setTheme("undocked");

							this.SetColours();
							this.CheckDockState();
						}
		
		this.SetColours = 	function()
							{
								var bgColor = System.Gadget.Settings.read("bgcolor");
								var borderColor = System.Gadget.Settings.read("bordercolor");
								var textColor = System.Gadget.Settings.read("textcolor");
								var barTextColor = System.Gadget.Settings.read("bartextcolor");
								var bar1color = System.Gadget.Settings.read("bar1color");
								var bar2color = System.Gadget.Settings.read("bar2color");
								var baremptycolor = System.Gadget.Settings.read("baremptycolor");
								var iconcolorload = System.Gadget.Settings.read("iconcolor");
								var hideDividers = System.Gadget.Settings.read("hideDividers");

								document.body.style.backgroundColor = bgColor;
								document.body.style.borderColor = borderColor;
								document.getElementById("usageBlock").style.borderTopColor = (hideDividers) ? bgColor : borderColor;
								document.getElementById("monthBlock").style.borderTopColor = (hideDividers) ? bgColor : borderColor;
								document.getElementById("controlBlock").style.borderTopColor = (hideDividers) ? bgColor : borderColor;
							
								document.getElementById("bar1").style.backgroundColor = bar1color;
								document.getElementById("bar2").style.backgroundColor = bar2color;
								document.getElementById("barEmpty1").style.backgroundColor = baremptycolor;
								document.getElementById("barEmpty2").style.backgroundColor = baremptycolor;
								
								document.getElementById("mainheader").style.color = textColor;
								document.getElementById("usage").style.color = textColor;
								document.getElementById("monthremaining").style.color = textColor;
								document.getElementById("lastupdated").style.color = textColor;
								document.getElementById("usageheader").style.color = barTextColor;
								document.getElementById("monthheader").style.color = barTextColor;
								document.getElementById("accountName").style.color = textColor;
								
								iconcolour = iconcolorload ? iconcolorload : "#000000";
								iconcolourover = bar1color ? bar1color : "#FF6600";
								
								this.SetIconColour("details", "normal");
								this.SetIconColour("refresh", "normal");
							}
						
		this.CheckDockState = 	function() 
								{		
									System.Gadget.beginTransition();
									
									if (System.Gadget.docked)
									{		
										this.setTheme("docked");
										
										var useHeight = 120;
										if(System.Gadget.Settings.read("displayAccount")){
											useHeight = 131;
										}
										
										with (document.body.style) {
											width = 130;
											height = useHeight;
										}
									}
									else
									{
										this.setTheme("undocked");
										
										var useHeight = 185;
										if(System.Gadget.Settings.read("displayAccount")){
											useHeight = 201;
										}
								
										with (document.body.style) {
											width = 200;
											height = useHeight;
										}
									}
									System.Gadget.endTransition(System.Gadget.TransitionType.morph, this.timeTransition);
								}
		
		this.SetStatus = 	function(status)
							{
								document.getElementById("lastUpdated").innerHTML = status;
						 	}
							
		this.GetStatus = 	function()
							{
								return document.getElementById("lastUpdated").innerHTML;
							}
							
		this.setTheme = function(theme)
						{
							var styleUndocked = document.getElementById("styleUndocked");
							var styleDocked = document.getElementById("styleDocked");

							switch(theme)
							{
								case "docked":
									styleUndocked.disabled = true;
									styleDocked.disabled = false;
									break;
								
								case "undocked":
									styleUndocked.disabled = false;
									styleDocked.disabled = true;
									break;
							}	
						}
		
		this.LoadSettings = function(settingsContainer)
							{
								var scriptNode = document.createElement('script');
								scriptNode.setAttribute('src', "jscolor/jscolor.js");
								scriptNode.setAttribute('type', "text/javascript");
								document.getElementsByTagName('head')[0].appendChild(scriptNode);
								
								var bar1color = System.Gadget.Settings.read("bar1color") ? System.Gadget.Settings.read("bar1color") : "#FF6600";
								var bar2color = System.Gadget.Settings.read("bar2color") ? System.Gadget.Settings.read("bar2color") : "#3399CC";
								var baremptycolor = System.Gadget.Settings.read("baremptycolor") ? System.Gadget.Settings.read("baremptycolor") : "#CCCCCC";
								var bgcolor = System.Gadget.Settings.read("bgcolor") ? System.Gadget.Settings.read("bgcolor") : "#FFFFFF";
							
								var bordercolor = System.Gadget.Settings.read("bordercolor") ? System.Gadget.Settings.read("bordercolor") : "#000000";
								var textcolor = System.Gadget.Settings.read("textcolor") ? System.Gadget.Settings.read("textcolor") : "#000000";
								var bartextcolor = System.Gadget.Settings.read("bartextcolor") ? System.Gadget.Settings.read("bartextcolor") : "#FFFFFF";
								var iconcolor = System.Gadget.Settings.read("iconcolor") ? System.Gadget.Settings.read("iconcolor") : "#000000";
								
								var dividerDiv = document.createElement('div');
								dividerDiv.className = 'row';
								dividerDiv.innerHTML = '<div class="label"><strong>Hide Dividers:</strong></div>\
														<div class="field">Yes <input type="radio" name="hideDividers" value="1" ' + (System.Gadget.Settings.read("hideDividers") ? 'CHECKED' : '') + '> \
																		No<input type="radio" name="hideDividers" value="0" ' + (!System.Gadget.Settings.read("hideDividers") ? 'CHECKED' : '') + '></div>';
								settingsContainer.appendChild(dividerDiv);
								
								var mouseOverDiv = document.createElement('div');
								mouseOverDiv.className = 'row';
								mouseOverDiv.innerHTML = '	<div class="row">\
																<div class="label"><strong>Mouseover Details:</strong></div>\
																<div class="field">\
																	Yes <input type="radio" name="mouseoverDetails" value="1" ' + (System.Gadget.Settings.read("mouseoverDetails") ? 'CHECKED' : '') + '> \
																	No<input type="radio" name="mouseoverDetails" value="0" ' + (!System.Gadget.Settings.read("mouseoverDetails") ? 'CHECKED' : '') + '>\
																</div>\
															</div>';
								
								settingsContainer.appendChild(mouseOverDiv);
								
								var mixedUnitsDiv = document.createElement('div');
								mixedUnitsDiv.className = 'row';
								mixedUnitsDiv.innerHTML = '	<div class="row">\
																<div class="label"><strong>Use Mixed Units:</strong></div>\
																<div class="field">\
																	Yes <input type="radio" name="mixedUnits" value="1" ' + (System.Gadget.Settings.read("mixedUnits") ? 'CHECKED' : '') + '> \
																	No<input type="radio" name="mixedUnits" value="0" ' + (!System.Gadget.Settings.read("mixedUnits") ? 'CHECKED' : '') + '>\
																</div>\
															</div>';
								
								settingsContainer.appendChild(mixedUnitsDiv);

								var blankRow = document.createElement('div');
								blankRow.className = 'row';
								blankRow.innerHTML = '<br /><hr style="border:none; border-top:1px dotted black; height:1px;">';
								settingsContainer.appendChild(blankRow);
								
								var resetColours = document.createElement('strong');
								resetColours.innerHTML = 'Colours:&nbsp;&nbsp;';
								settingsContainer.appendChild(resetColours);
								
								var resetLink = document.createElement('a');
								resetLink.innerHTML = "Reset";
								resetLink.href = '#';
								var that = this;
								resetLink.onclick = function(){that.resetColours(); return false;};
								settingsContainer.appendChild(resetLink);
								
								var colourTable = document.createElement('div');
								colourTable.innerHTML = '<table width=100% cellpadding=1 callspacing=0 border=0>\
															<tr class="font">\
																<td>Bar 1</td>\
																<td>Bar 2</td>\
																<td>Bar Empty</td>\
																<td>Background</td>\
															</tr>\
															<tr>\
																<td><input class="color {hash:true}" id="bar1color" value="' + bar1color + '" size="6"></td>\
																<td><input class="color {hash:true}" id="bar2color" value="' + bar2color + '" size="6"></td>\
																<td><input class="color {hash:true}" id="baremptycolor" value="' + baremptycolor + '" size="6"></td>\
																<td><input class="color {hash:true}" id="bgcolor" value="' + bgcolor + '" size="6"></td>\
															</tr>\
															<tr class="font">\
																<td>Border</td>\
																<td>Text</td>\
																<td>Bar Text</td>\
																<td>Icons</td>\
															</tr>\
															<tr>\
																<td><input class="color {hash:true}" id="bordercolor" value="' + bordercolor + '" size="6"></td>\
																<td><input class="color {hash:true}" id="textcolor" value="' + textcolor + '" size="6"></td>\
																<td><input class="color {hash:true}" id="bartextcolor" value="' + bartextcolor + '" size="6"></td>\
																<td><input class="color {hash:true}" id="iconcolor" value="' + iconcolor + '" size="6"></td>\
															</tr>\
														</table>';
								settingsContainer.appendChild(colourTable);
							}
							
		this.ValidateSettings = function(event)
								{
									
								}
								
		this.SaveSettings = function(event)
							{
								System.Gadget.Settings.write("hideDividers", Radio_Value_Get(document.getElementById('hideDividers')));
								System.Gadget.Settings.write("mouseoverDetails", Radio_Value_Get(document.getElementById('mouseoverDetails')));
								System.Gadget.Settings.write("mixedUnits", Radio_Value_Get(document.getElementById('mixedUnits')));

								System.Gadget.Settings.write("bar1color", bar1color.value);
								System.Gadget.Settings.write("bar2color", bar2color.value);
								System.Gadget.Settings.write("baremptycolor", baremptycolor.value);
								System.Gadget.Settings.write("bgcolor", bgcolor.value);
							
								System.Gadget.Settings.write("bordercolor", bordercolor.value);
								System.Gadget.Settings.write("textcolor", textcolor.value);
								System.Gadget.Settings.write("bartextcolor", bartextcolor.value);
								System.Gadget.Settings.write("iconcolor", iconcolor.value);
							}

		this.resetColours =	function()
							{
								document.getElementById("bar1color").value = "#FF6600";
								document.getElementById("bar1color").style.backgroundColor = "#FF6600";
								document.getElementById("bar1color").style.color = "#FFFFFF";
								document.getElementById("bar2color").value = "#3399CC";
								document.getElementById("bar2color").style.backgroundColor = "#3399CC";
								document.getElementById("bar2color").style.color = "#000000";
								document.getElementById("baremptycolor").value = "#CCCCCC";
								document.getElementById("baremptycolor").style.backgroundColor = "#CCCCCC";
								document.getElementById("baremptycolor").style.color = "#000000";
								document.getElementById("bgcolor").value = "#FFFFFF";
								document.getElementById("bgcolor").style.backgroundColor = "#FFFFFF";
								document.getElementById("bgcolor").style.color = "#000000";
							
								document.getElementById("bordercolor").value = "#000000";
								document.getElementById("bordercolor").style.backgroundColor = "#000000";
								document.getElementById("bordercolor").style.color = "#FFFFFF";
								document.getElementById("textcolor").value = "#000000";
								document.getElementById("textcolor").style.backgroundColor = "#000000";
								document.getElementById("textcolor").style.color = "#FFFFFF";
								document.getElementById("bartextcolor").value = "#FFFFFF";
								document.getElementById("bartextcolor").style.backgroundColor = "#FFFFFF";
								document.getElementById("bartextcolor").style.color = "#000000";
								document.getElementById("iconcolor").value = "#000000";
								document.getElementById("iconcolor").style.backgroundColor = "#000000";
								document.getElementById("iconcolor").style.color = "#FFFFFF";
							}
	
	this.FormatUsage = 	function(info, targetUnits){
							var unitSuffix = ['', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB'];
							
							for(var i = 0; i < unitSuffix.length; i++){
								if(info[1] == unitSuffix[i]){
									info[1] = i;
								}
								
								if(targetUnits && targetUnits == unitSuffix[i]){
									targetUnits = i;	
								}
							}
							
							while((targetUnits && info[1] != targetUnits) || (!targetUnits && info[0] >= 1000)){
								info[0] /= 1000;
								info[1]++;	
							}
							
							info[1] = unitSuffix[info[1]];
						}
	
	this.DisplayData = 	function(data)
						{
							try{
								var usageAccuracy = System.Gadget.Settings.read("usageAccuracy");
								var remainingAccuracy = System.Gadget.Settings.read("remainingAccuracy");
								
								var usageDisplay = [(System.Gadget.Settings.read("usageDisplay") ? data.allowance - data.totalUsage : data.totalUsage), "MB"];
								var quotaDisplay = [data.allowance, "MB"]; //In MB
								
								if(System.Gadget.Settings.read("mixedUnits")){
									//Mix Units
									this.FormatUsage(usageDisplay);
									this.FormatUsage(quotaDisplay);
								}else{	//Don't mix the units, just make them GB
									this.FormatUsage(usageDisplay, "GB");
									this.FormatUsage(quotaDisplay, "GB");
								}
								
								quotaDisplay[0] = roundNumber(quotaDisplay[0], 3); //At most 3 decimal places.
								
								//Dynamically find max number of decimal places. Not fixed because more decimal places where possible is better
								//Particularly if usage is over 1Tb. 3 decimal places makes it accurate to nearest GB. 
								//If possible want accuracy to nearest MB
								var dPs = 10 - quotaDisplay[0].toString().length + (quotaDisplay[0] - Math.floor(quotaDisplay[0]) > 0 ? 1 : 0) - parseInt(usageDisplay[0]).toString().length;
								usageDisplay[0] = roundNumber(usageDisplay[0], Math.max(0, dPs));
								
								
								if(usageDisplay[1] == quotaDisplay[1])
									usageDisplay[1] = '';
								
								//Usage Bar																					
								document.getElementById("usage").innerHTML = usageDisplay[0] + usageDisplay[1] + " \/ " + quotaDisplay[0] + quotaDisplay[1];
								
								if(System.Gadget.Settings.read("usageDisplay")){
									document.getElementById("bar1").style.width = Math.max((data.allowance - data.totalUsage) / data.allowance * 100, 0) + "%";
									document.getElementById("percentUsed").innerHTML = Math.min(roundNumber((data.allowance - data.totalUsage) / data.allowance * 100, usageAccuracy), 100) + "%";
								}else{
									document.getElementById("bar1").style.width = Math.min(data.totalUsage / data.allowance * 100, 100) + "%";
									document.getElementById("percentUsed").innerHTML = Math.max(roundNumber(data.totalUsage / data.allowance * 100, usageAccuracy), 0) + "%";
								}
																				
								//Month Bar		
								var today = new Date();
								var startDate = new Date(data.startDate);
								startDate.setHours(0);
								startDate.setMinutes(0);
								startDate.setSeconds(0);
								
								var endDate = new Date(data.endDate + 24*60*60*1000);
								endDate.setHours(0);
								endDate.setMinutes(0);
								endDate.setSeconds(0);
															
								var monthRemaining =  (endDate.getTime()-today.getTime())/(1000*60*60*24);
								var monthPassed = (today.getTime()-startDate.getTime())/(1000*60*60*24);
								var daysInMonth = (endDate.getTime()-startDate.getTime())/(1000*60*60*24);
								var daysPassed = daysInMonth - (endDate.getTime()-today.getTime())/(1000*60*60*24);
															
								document.getElementById("monthRemaining").innerHTML = (roundNumber(monthRemaining, remainingAccuracy)) + (monthRemaining == 1 ? " DAY" : " DAYS");
								document.getElementById("bar2").style.width = Math.min(monthPassed / daysInMonth * 100 , 100) + "%";
								document.getElementById("percentMonth").innerHTML = roundNumber(monthPassed / daysInMonth * 100, usageAccuracy) + "%";
								
								//Mouseover details
								var perDayRemaining =  [Math.max(0, (data.allowance -  data.totalUsage) / ((monthRemaining < 1) ? 1 : monthRemaining)), "MB"];
								this.FormatUsage(perDayRemaining);
								perDayRemaining[0] = Math.round(perDayRemaining[0] * 1000) / 1000; //Sets to 3 decimal places (regardless of unit)
								perDayRemaining = perDayRemaining[0] + " " + perDayRemaining[1];
		
								var surplusDeficit = ["0", "MB", "Surplus"];
	
								if ((data.allowance / daysInMonth * daysPassed) >= data.totalUsage)
									surplusDeficit = [(data.allowance / daysInMonth * daysPassed) - data.totalUsage, "MB", "Surplus"];
								else
									surplusDeficit = [data.totalUsage - (data.allowance / daysInMonth * daysPassed), "MB", "Deficit"];
									
								this.FormatUsage(surplusDeficit);
								surplusDeficit[0] = Math.round(surplusDeficit[0] * 1000) / 1000; //Sets to 3 decimal places (regardless of unit)
	
								if(System.Gadget.Settings.read("mouseoverDetails")){
									document.getElementById("mainheader").setAttribute("title", UsageGadget.username);
									document.getElementById("usageOverlay").setAttribute("title", surplusDeficit[2] + ": " + surplusDeficit[0] + " " + surplusDeficit[1]);
									document.getElementById("monthOverlay").setAttribute("title", "Per Day Remaining: " + perDayRemaining);	
								}
								
								this.flyoutData = '	<div style="margin-bottom: 5px;">\
														<h5>USAGE</h5>\
														<table width="100%" class="font" style="margin-top: 5px;">\
															<tr>\
																<td width="25%" style="font-weight: bold;">Per Day Remaining</td>\
																<td>' + perDayRemaining + '</td>\
															</tr>\
															<tr>\
																<td style="font-weight:bold">' + surplusDeficit[2] + '</td>\
																<td>' + surplusDeficit[0] + " " + surplusDeficit[1] + '</td>\
															</tr>\
														</table>\
													</div>';
								this.flyoutData += data.flyoutData;
							}catch(err){
								this.flyoutData = err.message;
							}
						}
	
	this.SetIconColour =	function(iconname, status)
							{
								if (iconname == "details")
								{
									if (status == "over")
									{
										document.getElementById("icon-details").style.borderColor = iconcolourover;
										document.getElementById("icon-details-box").style.backgroundColor = iconcolourover;
									}
									else
									{
										document.getElementById("icon-details").style.borderColor = iconcolour;
										document.getElementById("icon-details-box").style.backgroundColor = iconcolour;
									}
								}
								else if (iconname == "refresh")
								{
									if (status == "over")
									{
										document.getElementById("icon-refresh").style.borderColor = iconcolourover;
										document.getElementById("icon-refresh-triangle").style.borderTopColor = iconcolourover;
										document.getElementById("icon-refresh-line").style.backgroundColor = iconcolourover;
									}
									else
									{
										document.getElementById("icon-refresh").style.borderColor = iconcolour;
										document.getElementById("icon-refresh-triangle").style.borderTopColor = iconcolour;
										document.getElementById("icon-refresh-line").style.backgroundColor = iconcolour;
									}
								}
							}
	
	this.OpenFlyout =	function ()
						{
							if (this.flyoutData)
							{
								System.Gadget.Flyout.show = !System.Gadget.Flyout.show;
								
								System.Gadget.Flyout.document.parentWindow.content = this.flyoutData;
							}
						}
}