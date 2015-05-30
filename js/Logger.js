// JavaScript Document
function Logger() 
{
	this.opened = false;
	this.logger = null;
	this.user = '';
	
	//Open Log File
	this.Open = 		function(){
							if(this.opened){
								//Log opened. Close the current log before continuing.
								this.Close();
							}

							//Open a log file
							try{
								var fso = new ActiveXObject("Scripting.FileSystemObject");
								try{
									this.logger = fso.OpenTextFile(System.Gadget.path + "\\logs\\log_" + this.user + ".txt", 8, true, 0);
									this.opened = true;
								}catch(err){
									this.opened = false;
								}
							}catch(err){
								this.opened = false;
							}
						}
	
	//Close Log File
	this.Close = 		function(){
							if(this.opened){
								this.logger.Close();
								this.opened = false;
							}
						}
	
	//Log a Message
	this.LogMessage = 	function(prefix, message){
							if(this.opened){
								var currentdate = new Date(); 
								var datetime = currentdate.getDate() + "/"
											+ (currentdate.getMonth()+1)  + "/" 
											+ currentdate.getFullYear() + " "  
											+ (currentdate.getHours() < 10 ? "0" : "") + currentdate.getHours() + ":"  
											+ (currentdate.getMinutes() < 10 ? "0" : "") + currentdate.getMinutes() + ":" 
											+ (currentdate.getSeconds() < 10 ? "0" : "") + currentdate.getSeconds();
											
								this.logger.WriteLine("[" + datetime + " " + prefix + "] " + message);
							}
						}
}