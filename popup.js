browserObj = (function () { return  window.browser || window.chrome; })();

browserObj.runtime.sendMessage(null, {greeting:"get_enable_override"}, 
	function (response) {
		if (!response) {
			return;
		}
		var checkbox = document.getElementById("enable");
		if (response === "enabled") {
			if (checkbox) {
				checkbox.checked = true;
			}
		} else if (response === "disabled") {
			if (checkbox) {
				checkbox.checked = false;
			}
		}
	});

function sendEnableOverride(enable) {

	let val = enable ? "enable" : "disable";

	if (enable) {
		console.log("Enabling insecure browsing ");		
	} else {
		console.log("Will enforce secure browsing ");
	}
	browserObj.runtime.sendMessage(null, {greeting:"set_enable_override", message:val},
	function (response) {
		console.log("Response: " + response);
	});
}


var checkbox = document.getElementById("enable");
checkbox.onclick = function () {
	if (checkbox.checked) {
		sendEnableOverride(true);
	} else {
		sendEnableOverride(false);
	}
}




