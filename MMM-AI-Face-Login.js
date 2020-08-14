/* global Module */

/* Magic Mirror
 * Module: MMM-AI-Face-Login
 *
 * By James Macdonald
 * MIT Licensed.
 */

Module.register("MMM-AI-Face-Login", {
	defaults: {
		updateInterval: 10000,
		retryDelay: 5000,
		width: "200px",
		position: "lower_third",
		useMMMFaceRecoDNN: false,
		interval: 2000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		this.userName = "Mr. Nobody";
		this.userImage = "guest.gif";
		this.timer = null;

		// Are we logged in or not
		this.loggedIn = false;

		//Flag for check if module is loaded
		this.loaded = false;
	},

	// This will be called every update and update the image based on:
	//	.userId
	//	.userName
	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.translate('TITLE');;
		wrapper.className = "face-image";

		// Ceate the image element and show gif by default.
		var imgHolderElement = document.createElement("p");
		imgHolderElement.innerHTML = this.translate('WELCOME'); + " " + this.userName;
		imgHolderElement.classList.add(this.config.position);
		imgHolderElement.style.width = this.config.width;
		
		// Asychronoulsy load either GIF or face (as name).
		var img = document.createElement("img");
		var newImg = new Image;
		newImg.onload = function()
		{
			img.src = this.src;
		}
		newImg.src = "modules/MMM-AI-Face-Login/public/" + this.userImage;
		imgHolderElement.appendChild(img);

		wrapper.appendChild(imgHolderElement);
		return wrapper;

	},
	
	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-AI-Face-Login.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json",
			en: "translations/ko.json"
		};
	},

	notificationReceived: function(notification, payload, sender) {
		var self = this;

		// Log.log("Got Notificaiton: " + notification + " Payload: " + payload);
		switch (notification)
		{
			case "USERS_LOGIN":
			{
				// Face Rec sends multiple notifications even if user is already logged in and logout timer still active.
				if (this.config.useMMMFaceRecoDNN === true && this.loggedIn == false )
				{
					Log.log("Notificaiton: " + notification + " from Mirror. Logging in " + payload);
					
					// Fetch the users image.
					this.loggedIn = true;
					this.userName = payload;
					this.userImage = payload + ".jpg"; //Assume for now.
					self.updateDom(100);

					// Clear existing timer and reset.
					// This is only required if MMM-Face-Reco-DNN module not updated with new Notification for lougout.
//					if ( this.timer != null ) clearInterval(this.timer);
//					this.timer = setTimeout(()=>{
//						Log.log("Logging out. Reset image.");
//						
//						this.loggedIn = false;
//						this.userName = "Mr. Nobody";
//						this.userImage = "guest.gif";
//						self.updateDom(100);
//					}, 25000);
				}
				break;
			}
			case "USERS_LOGOUT_MODULES":
			{
				Log.log("Notificaiton: " + notification + " from Mirror. Logging out " + payload);
				
				this.loggedIn = false;
				this.userName = "Mr. Nobody";
				this.userImage = "guest.gif";
				self.updateDom(100);
				
				break;
			}
		}		
	},

});
