// JavaScript Document
function Misc(){
	this.id = 'misc';
	this.name = 'Misc';
	this.priority = 30;
	
	this.Initialise = 	function ()
						{
						}
	
	this.Display = 	function (tabContent)
					{
						var node = document.createElement('div');

						var useErrorLog = System.Gadget.Settings.read("useErrorLog");
						var displayAccount = System.Gadget.Settings.read("displayAccount");
						var use12hourtime = System.Gadget.Settings.read("use12hourtime");
						var hideFailedMessages = System.Gadget.Settings.read("hideFailedMessages");
						var usageAccuracy = (System.Gadget.Settings.read("usageAccuracy") ? System.Gadget.Settings.read("usageAccuracy") : 0);
						var remainingAccuracy = (System.Gadget.Settings.read("remainingAccuracy") ? System.Gadget.Settings.read("remainingAccuracy") : 1);
						
						node.innerHTML = '	<div class="row">\
												<div class="label">\
													<strong>Log Errors & Debug Messages:</strong>\
												</div>\
												<div class="field">\
													Yes <input type="radio" name="logErrors" value="1" ' + (useErrorLog ? 'CHECKED' : '') + '> \
													No<input type="radio" name="logErrors" value="0" ' + (!useErrorLog ? 'CHECKED' : '') + '>\
												</div>\
											</div>\
											<div class="row">\
												<div class="field">\
													<a href="' + System.Gadget.path + '\\logs\\">Open Log Folder</a>\
												</div>\
											</div>\
											<div class="row">\
												<div class="label">\
													<strong>Display Account Name:</strong>\
												</div>\
												<div class="field">\
													Yes <input type="radio" name="displayAccount" value="1" ' + (displayAccount ? 'CHECKED' : '') + '> \
													No<input type="radio" name="displayAccount" value="0" ' + (!displayAccount ? 'CHECKED' : '') + '>\
												</div>\
											</div>\
											<div class="row">\
												<div class="label">\
													<strong>Use 12 hour time:</strong>\
												</div>\
												<div class="field">\
													Yes <input type="radio" name="use12hourtime" value="1" ' + (use12hourtime ? 'CHECKED' : '') + '> \
													No<input type="radio" name="use12hourtime" value="0" ' + (!use12hourtime ? 'CHECKED' : '') + '>\
												</div>\
											</div>\
											<div class="row">\
												<div class="label">\
													<strong>Only "As of" Label:</strong>\
												</div>\
												<div class="field">\
													Yes <input type="radio" name="hideFailedMessages" value="1" ' + (hideFailedMessages ? 'CHECKED' : '') + '> \
													No<input type="radio" name="hideFailedMessages" value="0" ' + (!hideFailedMessages ? 'CHECKED' : '') + '>\
												</div>\
											</div>\
											<div class="row"><br></div>\
											<div class="row">\
											<strong>Value Accuracy (Decimal Places):</strong><br>\
											<table>\
												<tr class="font">\
													<td>Usage/Month</td>\
													<td>Days Remaining</td>\
												</tr>\
												<tr>\
													<td><input type="text" id="usageAccuracy" size=20 value="' + usageAccuracy + '"></td>\
													<td><input type="text" id="remainingAccuracy" size=20 value="' + remainingAccuracy + '"></td>\
												</tr>\
											</table>\
											</div>';
						
						tabContent.appendChild(node);
					}
	
	this.ValidateSettings = function(event)
							{
								if(document.getElementById('usageAccuracy').value){
									IsFound = /^-?\d+$/.test(document.getElementById('usageAccuracy').value);	
									
									if(IsFound == false || document.getElementById('usageAccuracy').value < 0){
										UsageGadgetSettings.SetStatus("Usage/Month Accuracy must be a number 0 or greater.");
										event.cancel = true;
										return;
									}
								}
								
								if(document.getElementById('remainingAccuracy').value){
									IsFound = /^-?\d+$/.test(document.getElementById('remainingAccuracy').value);	
									
									if(IsFound == false || document.getElementById('remainingAccuracy').value < 0){
										UsageGadgetSettings.SetStatus("Remaining Time Accuracy must be a number 0 or greater.");
										event.cancel = true;
										return;
									}
								}
							}
							
	this.SaveSettings = function(event)
						{
							System.Gadget.Settings.write("useErrorLog", Radio_Value_Get(document.getElementById('logErrors')));
							System.Gadget.Settings.write("displayAccount", Radio_Value_Get(document.getElementById('displayAccount')));
							System.Gadget.Settings.write("use12hourtime", Radio_Value_Get(document.getElementById('use12hourtime')));
							System.Gadget.Settings.write("hideFailedMessages", Radio_Value_Get(document.getElementById('hideFailedMessages')));
							System.Gadget.Settings.write("usageAccuracy", document.getElementById('usageAccuracy').value);
							System.Gadget.Settings.write("remainingAccuracy", document.getElementById('remainingAccuracy').value);
						}
}