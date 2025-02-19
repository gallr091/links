// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'digital-brutalism-buorqfz9bag' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	// let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description');
	// let channelCount = document.querySelector('#channel-count')
	// let channelLink = document.querySelector('#channel-link')
	let popup = document.querySelector('#popup');
    let closePopup = document.querySelector('#close-popup');
    let aboutLink = document.querySelector('#about-link');

	// Then set their content/attributes to our data:
	// channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description); // Converts Markdown → HTML
	// channelCount.innerHTML = data.length
	// channelLink.href = `https://www.are.na/channel/${channelSlug}`
	
	// pop-up for "about"
    aboutLink.addEventListener('click', () => {
        popup.classList.add('visible');
    });

    closePopup.addEventListener('click', () => {
        popup.classList.remove('visible');
    });
};



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('.channel-blocks');

	let getBlockImage = (blockClass) => {
		let validClasses = ["Image", "Media", "Link", "Text", "Attachment"];
		// let formattedClass = blockClass.replace("block-","validClasses");
		let formattedClass = blockClass.replace("block-", ""); 
		return validClasses.includes(formattedClass)
			? `assets2/block-${formattedClass}.png` 
			: "assets2/default.png"; // fallback 
	};
	
	// Titles
	// let blockItem = 
	// 	`<div class="item"> 
	// 	    <img src="${getBlockImage(block.class)}" alt="${block.class}" class="block-image">
	// 		<h3>${ block.title }</h3>
	// 	</div>`
	// channelBlocks.insertAdjacentHTML('beforeend', blockItem);

	
	// Links
	if (block.class === 'Link') {
		let linkItem = `
			<div class="item link-item">
				<img src="${getBlockImage(block.class)}" alt="${block.class}" class="block-image">
				<h3>${block.title}</h3> 
			</div>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', linkItem); 

		let linkElement = document.querySelector('.link-item:last-child');
		linkElement.addEventListener('click', () => {
			openLinkPopup(block); 
		});
	}

		// open links pop-up
		let openLinkPopup = (block) => {
			console.log("openLinkPopup function triggered", block);

			let popupContainer = document.createElement("div"); 
			popupContainer.classList.add("popup-content");
			popupContainer.style.position = "absolute";
			popupContainer.style.opacity = "0"; 
			popupContainer.innerHTML = `
				<span class="close-link-popup">&times;</span>
				<h3>${block.title}</h3>
				<div class="popup-flex-container">
					<picture>
						<source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
						<source media="(max-width: 640px)" srcset="${block.image.large.url}">
						<img src="${block.image.original.url}" alt="${block.title}">
					</picture>
					<p id="popup-description">${block.description_html}</p>
					<p><a href="${ block.source.url }">see the original ↗</a></p>
				</div>
			`;		
		
			document.body.appendChild(popupContainer); 
		
			// random pos
			let viewportWidth = window.innerWidth;
			let viewportHeight = window.innerHeight;
			let popupWidth = popupContainer.offsetWidth || 300;
			let popupHeight = popupContainer.offsetHeight || 200;
			
			let randomX = Math.max(10, Math.random() * (viewportWidth - popupWidth - 20));
			let randomY = Math.max(10, Math.random() * (viewportHeight - popupHeight - 20));
			// let randomY = Math.max(10, Math.min(viewportHeight - popupHeight - 20, Math.random() * (viewportHeight - popupHeight - 20)));

			popupContainer.style.left = `${randomX}px`;
			popupContainer.style.top = `${randomY}px`;
		
			setTimeout(() => {
				popupContainer.style.opacity = "1";
			}, 50);
		
			// close
			popupContainer.querySelector(".close-link-popup").addEventListener("click", () => {
				popupContainer.style.opacity = "0";
				setTimeout(() => popupContainer.remove(), 300); 
			});
		
			makeDraggable(popupContainer);
		};
		
		// drag
		function makeDraggable(popup) {
			let offsetX = 0, offsetY = 0, isDragging = false;
		
			popup.addEventListener("mousedown", (e) => {
				isDragging = true;
				offsetX = e.clientX - popup.getBoundingClientRect().left;
				// offsetX = e.clientX - popup.getBoundingClientRect().right;
				offsetY = e.clientY - popup.getBoundingClientRect().top;
				popup.style.zIndex = 1000; 
			});
		
			document.addEventListener("mousemove", (e) => {
				if (!isDragging) return;
				popup.style.left = `${e.clientX - offsetX}px`;
				popup.style.top = `${e.clientY - offsetY}px`;
			});
		
			document.addEventListener("mouseup", () => {
				isDragging = false;
			});
		
			popup.addEventListener("mousedown", () => {
				document.querySelectorAll(".popup-content").forEach(p => p.style.zIndex = 1);
				popup.style.zIndex = 1000;
			});
		}
		//problem: empty space created below because of pop-up ypos when it's too low

	// Images!
	if (block.class === 'Image') {
		let imageItem = `
			<div class="item image-item">
				<img src="${getBlockImage(block.class)}" alt="${block.class}" class="block-image">
				<h3>${block.title}</h3> 
			</div>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', imageItem); 
	
		let imageElement = document.querySelector('.image-item:last-child');
		imageElement.addEventListener('click', () => {
			openImagePopup(block); 
		});
	}

		// open image pop-up
		let openImagePopup = (block) => {
			console.log("openImagePopup function triggered", block);

			let popupContainer = document.createElement("div"); 
			popupContainer.classList.add("popup-content");
			popupContainer.style.position = "absolute";
			popupContainer.style.opacity = "0"; 
		
			popupContainer.innerHTML = `
				<span class="close-link-popup">&times;</span>
				<h3>${block.title}</h3>
				<div class="popup-flex-container">
					<picture id="popup-image">
						<source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
						<source media="(max-width: 640px)" srcset="${block.image.large.url}">
						<img src="${block.image.original.url}" alt="${block.title}">
					</picture>
						<p id="popup-description">${block.description_html}</p>
					<p><a href="http://are.na/block/${block.id}" target="_blank">see the original ↗</a></p>
				</div>
			`;      
		
			document.body.appendChild(popupContainer);
		
			// random pos
			let viewportWidth = window.innerWidth;
			let viewportHeight = window.innerHeight;
			let popupWidth = popupContainer.offsetWidth || 300;
			let popupHeight = popupContainer.offsetHeight || 200;
		
			let randomX = Math.max(10, Math.random() * (viewportWidth - popupWidth - 20));
			let randomY = Math.max(10, Math.random() * (viewportHeight - popupHeight - 20));
		
			popupContainer.style.left = `${randomX}px`;
			popupContainer.style.top = `${randomY}px`;

			popupContainer.style.setProperty('--test-property', '100px');
			//set property as variable -> allows to use css specifity
			//left and top makes it hard on mobile
		
			setTimeout(() => {
				popupContainer.style.opacity = "1";
			}, 50);
		
			// close
			popupContainer.querySelector(".close-link-popup").addEventListener("click", () => {
				popupContainer.style.opacity = "0";
				setTimeout(() => popupContainer.remove(), 300);
			});
		
			makeDraggable(popupContainer);
		};
		
	// Text!
	 if (block.class === 'Text') {
		let textItem = `
			<div class="item text-item">
				<img src="${getBlockImage(block.class)}" alt="${block.class}" class="block-image">
				<h3>${block.title}</h3> 
			</div>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', textItem);
	
		const textElement = document.querySelector('.text-item:last-child');
		textElement.addEventListener('click', () => {
			openTextPopup(block);
		});
	}
	
		//open text pop-up
		let openTextPopup = (block) => {
			console.log("openTextPopup function triggered", block);

			let popupContainer = document.createElement("div"); 
			popupContainer.classList.add("popup-content");
			popupContainer.style.position = "absolute";
			popupContainer.style.opacity = "0"; 
		
			//block.content instead of block.content_html? or maybe just fix styling
			popupContainer.innerHTML = `
				<span class="close-link-popup">&times;</span>
				<h3>${block.title}</h3>
				<div class="popup-flex-container">
					${block.content_html}
					<p>${block.description_html || ""}</p>
				</div>
				<p><a href="http://are.na/block/${block.id}" target="_blank">see the original ↗</a></p>
			`;      
		
			document.body.appendChild(popupContainer);
		
			// random pos
			let viewportWidth = window.innerWidth;
			let viewportHeight = window.innerHeight;
			let popupWidth = popupContainer.offsetWidth || 300;
			let popupHeight = popupContainer.offsetHeight || 200;
		
			let randomX = Math.max(10, Math.random() * (viewportWidth - popupWidth - 20));
			let randomY = Math.max(10, Math.random() * (viewportHeight - popupHeight - 20));
		
			popupContainer.style.left = `${randomX}px`;

			// --x-pos: 0.5;

			// calc(var(--x-pos) * 100vh)

			popupContainer.style.top = `${randomY}px`;
		
			setTimeout(() => {
				popupContainer.style.opacity = "1";
			}, 50);
		
			// close
			popupContainer.querySelector(".close-link-popup").addEventListener("click", () => {
				popupContainer.style.opacity = "0";
				setTimeout(() => popupContainer.remove(), 300);
			});
		
			makeDraggable(popupContainer);
		};

		// let openTextPopup = (block) => {
		// 	document.getElementById("popup-title").textContent = block.title;
			
		// 	// CLEAR PREVIOUS CONTENT THIS IS ACTUALLY IMPORTANT LOL
		// 	document.getElementById("popup-embed").innerHTML = "";
		// 	document.getElementById("popup-image").innerHTML = "";
		// 	document.getElementById("popup-attachment").innerHTML = "";
		// 	document.getElementById("popup-description").textContent = "";

		// 	document.getElementById("popup-description").innerHTML = block.content_html;

		// 	let popup = document.getElementById("link-popup");
		// 	popup.classList.remove("image-popup", "link-popup");
		// 	popup.classList.add("text-popup");

		// 	document.getElementById("link-popup").classList.add("visible");
		// };

	// Attachments
	if (block.class == 'Attachment') {
		let attachmentItem = `
			<div class="item attachment-item">
				<img src="${getBlockImage(block.class)}" alt="${block.class}" class="block-image">
				<h3>${block.title}</h3> 
			</div>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', attachmentItem);

		let attachmentElement = document.querySelector('.attachment-item:last-child');
		attachmentElement.addEventListener('click', () => {
			openAttachmentPopup(block);
		});
	}

		// open attachment pop-up
		let openAttachmentPopup = (block) => {
			console.log("openAttachmentPopup function triggered", block);
		
			let popupContainer = document.createElement("div"); 
			popupContainer.classList.add("popup-content");
			popupContainer.style.position = "absolute";
			popupContainer.style.opacity = "0"; 
		
			popupContainer.innerHTML = `
				<span class="close-link-popup">&times;</span>
				<h3>${block.title}</h3>
				<div class="popup-flex-container">
					<div id="popup-attachment"></div> 
					<p id="popup-description">${block.content_html || ""}</p> 
					<p>${block.description_html || ""}</p>
					<p><a href="http://are.na/block/${block.id}" target="_blank">see the original ↗</a></p>
				</div>
			`;
		
			document.body.appendChild(popupContainer);
		
			console.log("Attachment: ", block.attachment);
			// let attachment = block.attachment.content_type 
			let attachmentContent = '';
			// let popupFlexContainer = document.getElementsByClassName("popup-flex-container");

			if (block.attachment && block.attachment.content_type) {
				let attachmentType = block.attachment.content_type;
				console.log("Attachment Type: ", attachmentType);

				// audio
				if (attachmentType.includes('audio')) {
					attachmentContent = `
						<p class="attachment-type"><em>Audio</em></p>
						<picture id="popup-image">
							<img src="${block.image.original.url}" alt="${block.title}">
						</picture>
						<audio controls>
							<source src="${block.attachment.url}" type="${block.attachment.content_type}">
						</audio>
					`;
				} 

				// pdf
				else if (attachmentType.includes('pdf')) {
					attachmentContent = `
						<p class="attachment-type"><em>PDF</em></p>
						<picture id="popup-image">
							<img src="${block.image.original.url}" alt="${block.title}">
						</picture>
						<a href="${block.attachment.url}" target="_blank" class="attachment-link">View PDF</a>
					`;
				}

				// video
				else if (attachmentType.includes('video')){
					attachmentContent =
							`
							<p class="attachment-type"><em>Video</em></p>
								<video width="320" height="240" controls src="${ block.attachment.url }"></video>
							`
							;
				}

				// etc
				else {
					attachmentContent = `
						<p><em>Attachment</em></p>
						<a href="${block.attachment.url}" target="_blank" class="attachment-link">Download or view</a>
					`;
				}

				// this is not working but i need it to
				console.log(popupContainer)
				popupContainer.querySelector("#popup-attachment").innerHTML = attachmentContent;	
				// popupFlexContainer.insertAdjacentHTML('beforeend', attachmentContent);
			}
			
				
			// random pos
			let viewportWidth = window.innerWidth;
			let viewportHeight = window.innerHeight;
			let popupWidth = popupContainer.offsetWidth || 300;
			let popupHeight = popupContainer.offsetHeight || 200;
		
			let randomX = Math.max(10, Math.random() * (viewportWidth - popupWidth - 20));
			let randomY = Math.max(10, Math.random() * (viewportHeight - popupHeight - 20));
		
			popupContainer.style.left = `${randomX}px`;
			popupContainer.style.top = `${randomY}px`;
		
			setTimeout(() => {
				popupContainer.style.opacity = "1";
			}, 50);
		
			// close
			popupContainer.querySelector(".close-link-popup").addEventListener("click", () => {
				popupContainer.style.opacity = "0";
				setTimeout(() => popupContainer.remove(), 300);
			});
		
			makeDraggable(popupContainer);
		};

		// let openAttachmentPopup = (block) => {
		// 	document.getElementById("popup-title").textContent = block.title;

		// 	// CLEAR PREVIOUS CONTENT THIS IS ACTUALLY IMPORTANT LOL
		// 	document.getElementById("popup-embed").innerHTML = "";
		// 	document.getElementById("popup-image").innerHTML = "";
		// 	document.getElementById("popup-attachment").innerHTML = "";
		// 	document.getElementById("popup-description").textContent = "";

		// 	// below doesn't work - description is null under attachment blocks???
		// 	// document.getElementById("popup-description").innerHTML = block.attachment.description || block.description_html || "";
		
		// 	let attachmentContent = '';
		// 	let originalLink = block.attachment.url; 
		
		// 	let attachment = block.attachment.content_type;
		
		// 	if (attachment.includes('audio')) {
		// 		attachmentContent = `
		// 			<p><em>Audio</em></p>
		// 			<audio controls>
		// 				<source src="${block.attachment.url}" type="${block.attachment.content_type}">
		// 			</audio>
		// 		`;
		// 	}
		
		// 	else if (attachment.includes('pdf')) {
		// 		attachmentContent = `
		// 			<p><em>PDF</em></p>
		// 			<a href="${block.attachment.url}" target="_blank" class="attachment-link">View PDF</a>
		// 		`;
		// 	}
		
		// 	else {
		// 		attachmentContent = `
		// 			<p><em>Attachment</em></p>
		// 			<a href="${block.attachment.url}" target="_blank" class="attachment-link">Download or view</a>
		// 		`;
		// 	}
		
		// 	document.getElementById("popup-attachment").innerHTML = attachmentContent;
		
		// 	let originalLinkElement = document.getElementById("popup-link");
		// 	originalLinkElement.setAttribute('href', originalLink);
		// 	originalLinkElement.textContent = 'see the original ↗';
		
		// 	document.getElementById("link-popup").classList.add("visible");
		// 	};
		
		// 	document.getElementById("close-link-popup").addEventListener("click", () => {
		// 		document.getElementById("link-popup").classList.remove("visible");
		// 	});
		
	// Linked media
	if (block.class === 'Media') {
	
		let videoItem = `
		<div class="item media-item">
			<img src="${getBlockImage(block.class)}" alt="${block.class}" class="block-image">
			<h3>${block.title}</h3>
		</div>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', videoItem);
	
		let mediaElement = document.querySelector('.media-item:last-child');
		mediaElement.addEventListener('click', () => {
		openMediaPopup(block); 
		});
	}
	
	// open media pop-up
	let openMediaPopup = (block) => {
		if (block.class !== "Media") return;
	
		document.getElementById("popup-title").textContent = block.title;

		// CLEAR PREVIOUS CONTENT THIS IS ACTUALLY IMPORTANT LOL
		document.getElementById("popup-embed").innerHTML = "";
		document.getElementById("popup-image").innerHTML = "";
		document.getElementById("popup-attachment").innerHTML = "";
		document.getElementById("popup-description").textContent = "";
	
		let mediaContent = "";
		let originalLink = block.media?.url || "#"; 
	
		// if (embed.includes('video')) {
		if (block.embed && block.embed.type && block.embed.html) {
			if (block.embed.type.includes("video")) {
				mediaContent = `
					<p><em>Linked Video</em></p>
					${block.embed.html}
				`;
			}
		}
	
		document.getElementById("popup-embed").innerHTML = mediaContent;
	
		let originalLinkElement = document.getElementById("popup-link");
		originalLinkElement.setAttribute("href", originalLink);
		originalLinkElement.textContent = "see the original ↗";
	
		document.getElementById("link-popup").classList.add("visible");
	};
	
	document.getElementById("close-link-popup").addEventListener("click", () => {
		document.getElementById("link-popup").classList.remove("visible");
	});










	}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.querySelector('#channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		// renderUser(data.user, channelUsers)

		console.log(data);
	})



	//random position: mobile %
	// use document.body.style.setProperty("--text", "world") for random position
	// standardize aesthetic: 3 conflicting ones (ascii, pixel all black)
	// dont have to use matter.js for mobile, maybe cheese it with css 

	