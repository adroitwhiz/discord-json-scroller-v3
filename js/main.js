const elemIds = {
	"messageArea":"messages",
	"channelArea":"channel-list",
	"renderButton":"render-btn",
	"messageRenderRangeMin":"msg-range-min",
	"messageRenderRangeMax":"msg-range-max",
	"messageJumpNumber":"msg-num",
	"messageJumpContext":"msg-context",
	"jumpButton":"jump-btn",
	"findFilterTextCheckbox":"find-filter-by-text",
	"findFilterText":"find-filter-text",
	"findFilterUsernameCheckbox":"find-filter-by-username",
	"findFilterUsername":"find-filter-username",
	"findButton":"find-btn",
	"messageTemplate":"message-template",
	"channelTemplate":"channel-template",
	"JSONFilePicker":"json-file-picker"
},
      elems = {};

let loadedServer = null;
let loadedUsers = null;

let activeChannel = null;
let channelMessages = null;

function jump(array, n, ctx) {return array.slice(Math.max(0, n-ctx), n+ctx+1)};

document.addEventListener("DOMContentLoaded", event => {
	const elems = {};
	
	for (let i in elemIds) {
		if (elemIds.hasOwnProperty(i)) {
			let elem = document.getElementById(elemIds[i]);
			if (elem === null) throw new Error(`Could not find element with ID ${elemIds[i]}`);
			elems[i] = elem;
		}
	}
	
	window.messageTemplate = Handlebars.compile(elems.messageTemplate.innerText);
	window.channelTemplate = Handlebars.compile(elems.channelTemplate.innerText);
	
	//window.mt = messageTemplate;
	
	elems.JSONFilePicker.addEventListener("change", event => {
		console.log(event.target.files[0]);
		
		if (event.target.files[0]) {
			var reader = new FileReader();
			reader.onload = event => {
				loadedServer = JSON.parse(event.target.result);
				return reinit();
				
			};
			
			reader.readAsText(event.target.files[0]);
		}
	});
	
	elems.renderButton.addEventListener("click", event => {
		let messagesToRender = channelMessages.slice(parseInt(elems.messageRenderRangeMin.value), parseInt(elems.messageRenderRangeMax.value));
		
		renderMessages(messagesToRender, messageTemplate, elems.messageArea);
	});
	
	elems.jumpButton.addEventListener("click", event => {
		let jumpID = elems.messageJumpNumber.value;
		
		let messageToJumpTo = channelMessages.findIndex(message => message.id === jumpID);
		let messageJumpContext = parseInt(elems.messageJumpContext.value);
		
		let messagesToRender = channelMessages.slice(Math.max(0, messageToJumpTo-messageJumpContext), messageToJumpTo+messageJumpContext+1);
		
		renderMessages(messagesToRender, elems.messageArea);
	});
	
	//elems.findButton
});

function reinit() {
	loadedUsers = {};
	for (let i = 0; i < loadedServer.members.length; i++) {
		let user = loadedServer.members[i].user;
		
		loadedUsers[user.id] = user;
	}
	
	renderChannels(loadedServer.channels, elems.channelArea);
}

function renderChannels(channels, channelArea) {
	for (let i = 0; i < loadedServer.channels.length; i++) {
		const createdElement = document.createElement(null);
		
		createdElement.innerHTML = channelTemplate({
			channelName:loadedServer.channels[i].name
		});
		
		createdElement.addEventListener("click", event => {
			setActiveChannel(loadedServer.channels[i].name);
		});
		
		createdElement.setAttribute("data-channel", loadedServer.channels[i].name);
		
		elems.channelArea.appendChild(createdElement);
	}
}

function setActiveChannel(channelName) {
	activeChannel = channelName;
	
	channelMessages = loadedServer.channels.find(channel => channel.name === channelName).messages;
	
	const channelElements = elems.channelArea.children;
	
	for (let i = 0; i < channelElements.length; i++) {
		channelElements[i].children[0].classList.remove("selected");
	}
	
	let activeChannelButton = Array.prototype.find.call(channelElements, (elem => elem.getAttribute("data-channel") === channelName));
	
	console.log(activeChannelButton);
	
	activeChannelButton.children[0].classList.add("selected");
}

function renderMessages(messages, messageArea) {
	const renderedMessages = [];
	
	for (let i = 0, len = messages.length; i < len; i++) {
		renderedMessages.push(renderMessage(messageTemplate, messages[i]));
	}
	
	renderedMessages.reverse();
	
	elems.messageArea.innerHTML = renderedMessages.join("");
	
	Array.from(elems.messageArea.getElementsByClassName("message-text")).forEach(messageText => {
		linkifyElement(messageText);
	});
}

function renderMessage(template, message) {
	return template({
		text:message.content,
		attachments:message.attachments,
		username:loadedUsers[message.author] ? loadedUsers[message.author].username : `<@${message.author}>`,
		timestamp:moment(parseInt(message.createdTimestamp)).format("MMM D Y h:mm:ss A"),
		isEdited:message.editedTimestamp !== null,
		index:message.id
	});
}

