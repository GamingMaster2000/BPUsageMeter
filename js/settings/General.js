// JavaScript Document
function General(){
	this.id = 'general';
	this.name = 'General';	
	this.priority = 10; //Lower number == Higher priority
	
	this.usernameField = null;
	this.passwordField = null;
	this.refreshIntervalField = null;
	this.overrideQuotaField = null;
		
	this.Initialise = 	function ()
						{
							this.usernameField = document.createElement('input');
							this.usernameField.type = 'text';
							this.usernameField.id = "bigpondUsername";
							this.usernameField.title = "Username";
							this.usernameField.size = 20;
							this.usernameField.value = System.Gadget.Settings.read("bigpondUsername");
							
							this.passwordField = document.createElement('input');
							this.passwordField.type = 'password';
							this.passwordField.id = 'bigpondPassword';
							this.passwordField.title = 'Password';
							this.passwordField.size = 20;
							this.passwordField.value = System.Gadget.Settings.read("bigpondPassword");
							
							this.refreshIntervalField = document.createElement('input');
							this.refreshIntervalField.type = 'text';
							this.refreshIntervalField.id = 'refreshInterval';
							this.refreshIntervalField.title = 'Refresh Interval';
							this.refreshIntervalField.size = 20;
							this.refreshIntervalField.value = (System.Gadget.Settings.read("refreshInterval") ? System.Gadget.Settings.read("refreshInterval") : 60);
							
							this.overrideQuotaField = document.createElement('input');
							this.overrideQuotaField.type = 'text';
							this.overrideQuotaField.id = 'overrideQuota';
							this.overrideQuotaField.title = 'Override Quota';
							this.overrideQuotaField.size = 20;
							this.overrideQuotaField.value = System.Gadget.Settings.read("overrideQuota");
						}
	
	this.CreateRow = 	function(label, input)
						{
							var rowDiv = document.createElement('div');
							rowDiv.className = 'row';
							
							var labelDiv = document.createElement('div');
							labelDiv.className = 'label';
							labelDiv.innerHTML = "<strong>" + label + ":</strong>";
							
							var fieldDiv = document.createElement('div');
							fieldDiv.className = 'field';
							fieldDiv.appendChild(input);
							
							rowDiv.appendChild(labelDiv);
							rowDiv.appendChild(fieldDiv);
							
							return rowDiv;
						}
	
	this.Display = 	function (tabContent)
					{
						var node = document.createElement('div');
						
						node.appendChild(this.CreateRow('Username', this.usernameField));
						node.appendChild(this.CreateRow('Password', this.passwordField));
						node.appendChild(this.CreateRow('Refresh Interval (mins)', this.refreshIntervalField));
						node.appendChild(this.CreateRow('Override Quota (GB)', this.overrideQuotaField));
						
						//I.E. handles radio buttons stupidly so just manually handle them
						var radioButtons = document.createElement('div');
						radioButtons.className = 'row';
						radioButtons.innerHTML = '	<div class="label"><strong>Usage Display:</strong></div>\
													<div class="field">	Used <input type="radio" name="usageDisplay" value="0"' + (!System.Gadget.Settings.read("usageDisplay") ? 'CHECKED' : '') + '> \
																		Remaining <input type="radio" name="usageDisplay" value="1"' + (System.Gadget.Settings.read("usageDisplay") ? 'CHECKED' : '') + '>\
													</div>';
						node.appendChild(radioButtons);	
						
						var unratedButtons = document.createElement('div');
						unratedButtons.className = 'row';
						unratedButtons.innerHTML = '	<div class="label"><strong>Unrated as Metered:</strong></div>\
														<div class="field">	Yes <input type="radio" name="includeUnrated" value="1"' + (System.Gadget.Settings.read("includeUnrated") ? 'CHECKED' : '') + '> \
																			No <input type="radio" name="includeUnrated" value="0"' + (!System.Gadget.Settings.read("includeUnrated") ? 'CHECKED' : '') + '>\
													</div>';
						node.appendChild(unratedButtons);	
											
						tabContent.appendChild(node);
					}
	
	this.ValidateSettings =	function (event)
							{
								//validate fields	
								if (this.usernameField.value == "")
								{
									UsageGadgetSettings.SetStatus('Please enter your username!');
									event.cancel = true;
									return;
								}
								
								if(this.usernameField.value.indexOf("@") < 0){
									UsageGadgetSettings.SetStatus('Please enter your full username. E.g. user@bigpond.com');
									event.cancel = true;
									return;
								}
								
								if (this.passwordField.value == "")
								{
									UsageGadgetSettings.SetStatus("Please enter your password!");
									event.cancel = true;
									return;
								}
								
								if (/^-?\d+$/.test(this.refreshIntervalField.value) == false || this.refreshIntervalField.value < 15)
								{
									UsageGadgetSettings.SetStatus("Refresh interval must be a whole number >= 15!");
									event.cancel = true;
									return;
								}
								
								if (this.overrideQuotaField.value)
								{									
									if (/^\d+(\.\d{1,1})?$/.test(this.overrideQuotaField.value) == false || this.overrideQuotaField.value < 1)
									{
										UsageGadgetSettings.SetStatus("Override Quota must be a number >= 1!");
										event.cancel = true;
										return;
									}
								}
							}
	
	this.SaveSettings = function(event)
						{
							System.Gadget.Settings.write("bigpondUsername", this.usernameField.value.toLowerCase());
							System.Gadget.Settings.write("bigpondPassword", this.passwordField.value);
							System.Gadget.Settings.write("refreshInterval", this.refreshIntervalField.value);
							System.Gadget.Settings.write("overrideQuota", this.overrideQuotaField.value);
							System.Gadget.Settings.write("usageDisplay", Radio_Value_Get(document.getElementsByName('usageDisplay')));
							System.Gadget.Settings.write("includeUnrated", Radio_Value_Get(document.getElementsByName('includeUnrated')));
						}
}