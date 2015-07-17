// JavaScript Document
function Methods(){
	this.id = 'methods';
	this.name = 'Methods';
	this.priority = 35;
		
	this.Initialise = 	function ()
						{
						}
	
	this.Display = 	function (tabContent)
					{
						var node = document.createElement('div');
						try{
							
							var innerHTML = '';
							innerHTML = '	<div class="row"><div class="label"><b>Method</b></div><div class="field"><b>Enabled</b></div></div>';
							for(var i = 0; i < System.Gadget.document.parentWindow.UsageGadget.methods.length; i++){
								var name = System.Gadget.document.parentWindow.UsageGadget.methods[i].name;
								var uid = System.Gadget.document.parentWindow.UsageGadget.methods[i].uid;
								var enabled = System.Gadget.Settings.read("enable_" + uid);
								
								//Nothing Set. Probably means first load. Enabled all by default
								if(enabled === ""){
									enabled = true;
								}

								innerHTML += '	<div class="row">\
														<div class="label" style="font-weight: normal">\
														' + name + '\
														</div>\
														<div class="field">\
															Yes <input type="radio" name="enable_' + uid + '" value="1" ' + (enabled ? 'CHECKED' : '') + '> \
															No<input type="radio" name="enable_' + uid + '" value="0" ' + (!enabled ? 'CHECKED' : '') + '>\
														</div>\
													</div>';
							}
							
							node.innerHTML = innerHTML;
							
						}catch(err){
							node.innerHTML = err.message;
						}

						tabContent.appendChild(node);
					}
	
	this.ValidateSettings = function(event)
							{
								var anyEnabled = false;
								
								for(var i = 0; i < System.Gadget.document.parentWindow.UsageGadget.methods.length; i++){
									var uid = System.Gadget.document.parentWindow.UsageGadget.methods[i].uid
									
									if(Radio_Value_Get(document.getElementById('enable_' + uid))){
										anyEnabled = true;
										break;	
									}
								}
								
								if(!anyEnabled){
									UsageGadgetSettings.SetStatus("At least one method must be enabled.");
									event.cancel = true;
									return;	
								}
							}
							
	this.SaveSettings = function(event)
						{
							for(var i = 0; i < System.Gadget.document.parentWindow.UsageGadget.methods.length; i++){
								var uid = System.Gadget.document.parentWindow.UsageGadget.methods[i].uid;
								System.Gadget.Settings.write("enable_" + uid, Radio_Value_Get(document.getElementsByName('enable_' + uid)));
								
							}
						}
}