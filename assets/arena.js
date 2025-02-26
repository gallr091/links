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
	// Then set their content/attributes to our data:

	let mainInfoSection = document.querySelector('.main-info');
	let descriptionHTML = window.markdownit().render(data.metadata.description);
  
	let aboutParagraph = document.createElement('p');
	aboutParagraph.id = 'about-description'; 
	aboutParagraph.innerHTML = descriptionHTML;
  
	mainInfoSection.appendChild(aboutParagraph);

	let channelInfoSection = document.createElement('section');
	channelInfoSection.id = 'channel-info-section';  

	let channelCountParagraph = document.createElement('p');
	channelCountParagraph.id = 'channel-count'; 
	channelCountParagraph.innerHTML = `◌ channel count: ${data.length}`;
	channelInfoSection.appendChild(channelCountParagraph);

	let channelLinkParagraph = document.createElement('p');
	channelLinkParagraph.id = 'channel-link';
	let link = document.createElement('a');
	link.href = `https://www.are.na/channel/${data.slug}`;
	link.target = "_blank";  
	link.innerHTML = `◌ are.na channel: ${data.title}↗`;
	channelLinkParagraph.appendChild(link);

	channelInfoSection.appendChild(channelLinkParagraph);

	mainInfoSection.appendChild(channelInfoSection);

	// renderUser(userData);
	};

  


// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('.channel-blocks');

	let getBlockImage = (blockClass) => {
		let validClasses = ["Image", "Media", "Link", "Text", "Attachment"];
		let formattedClass = blockClass.replace("block-", ""); 
		return validClasses.includes(formattedClass)
			? `assets/block-${formattedClass}.png` 
			: "assets/default.png"; // fallback 
	};
	

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
					<p id="popup-description">${block.description}</p>
				</div>
				<p class="arena-link"><a href="${ block.source.url }">see the original ↗</a></p>
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

			// set property as variable -> allows to use css specifity
			let windowSize = window.matchMedia("(max-width: 400px)");
			if (windowSize.matches) {
				popupContainer.style.setProperty('max-width', '300px');
			}
			
		
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
						<p id="popup-description">${block.description}</p>
				</div>
				<p class="arena-link"><a href="http://are.na/block/${block.id}" target="_blank">see the original ↗</a></p>

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

			// i tried set property with xpos and ypos and i didn't like it lol it was giving me more problems than this
			let windowSize = window.matchMedia("(max-width: 400px)");
			if (windowSize.matches) {
				popupContainer.style.setProperty('max-width', '300px');
			}
		
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
					<p id="popup-description">${block.description}</p>
				</div>
				<p class="arena-link"><a href="http://are.na/block/${block.id}" target="_blank">see the original ↗</a></p>
			`;      
		
			document.body.appendChild(popupContainer);
		
			// random pos
			let viewportWidth = window.innerWidth;
			let viewportHeight = window.innerHeight;
			let popupWidth = popupContainer.offsetWidth || 300;
			let popupHeight = popupContainer.offsetHeight || 200;
		
			let randomX = Math.max(10, Math.random() * (viewportWidth - popupWidth - 10));
			let randomY = Math.max(10, Math.random() * (viewportHeight - popupHeight - 10));
		
			popupContainer.style.left = `${randomX}px`;
			popupContainer.style.top = `${randomY}px`;

			let windowSize = window.matchMedia("(max-width: 400px)");
			if (windowSize.matches) {
				popupContainer.style.setProperty('max-width', '300px');
			}

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
				</div>
				<p class="arena-link"><a href="http://are.na/block/${block.id}" target="_blank">see the original ↗</a></p>

			`;
		
			document.body.appendChild(popupContainer);
		
			console.log("Attachment: ", block.attachment);
			let attachmentContent = '';

			if (block.attachment && block.attachment.content_type) {
				let attachmentType = block.attachment.content_type;
				console.log("Attachment Type: ", attachmentType);

				// audio
				if (attachmentType.includes('audio')) {
					attachmentContent = `
						<picture id="popup-image">
							<img src="${block.image.original.url}" alt="${block.title}">
						</picture>
						<a href="${block.attachment.url}" target="_blank"><p class="attachment-link">(listen)</a></p>
						<audio controls>
							<source src="${block.attachment.url}" type="${block.attachment.content_type}">
						</audio>
					`;
				} 

				// pdf
				else if (attachmentType.includes('pdf')) {
					attachmentContent = `
						<picture id="popup-image">
							<img src="${block.image.original.url}" alt="${block.title}">
						</picture>
						<a href="${block.attachment.url}" target="_blank"><p class="attachment-link">(view full pdf)</a></p>
					`;
				}

				// video
				else if (attachmentType.includes('video')){
					attachmentContent =
							`
								<video width="320" height="240" controls src="${ block.attachment.url }"></video>
								<a href="${block.attachment.url}" target="_blank"><p class="attachment-link">(watch)</a></p>

							`
							;
				}

				// etc
				else {
					attachmentContent = `
						<a href="${block.attachment.url}" target="_blank" class="attachment-link">Download or view</a>
					`;
				}

			
				console.log(popupContainer);
				popupContainer.querySelector("#popup-attachment").innerHTML = attachmentContent;	
				
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

				let windowSize = window.matchMedia("(max-width: 400px)");
				if (windowSize.matches) {
					popupContainer.style.setProperty('max-width', '300px');
					popupContainer.style.setProperty('max-height', '90%');
				}
			
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

	// linked media
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
			console.log("openMediaPopup function triggered", block);

			let embed = block.embed.type

			let popupContainer = document.createElement("div"); 
			popupContainer.classList.add("popup-content");
			popupContainer.style.position = "absolute";
			popupContainer.style.opacity = "0"; 
		
			popupContainer.innerHTML = `
				<span class="close-link-popup">&times;</span>
				<h3>${block.title}</h3>
				<div class="popup-flex-container">
					<div id="popup-embed"></div> 
					
				</div>
				<p class="arena-link"><a href="http://are.na/block/${block.id}" target="_blank">see the original ↗</a></p>
				`;      
		
			document.body.appendChild(popupContainer);

			let mediaContent = '';

			 if (embed.includes('video')) {
			
						mediaContent = `
							${block.embed.html}
						`;
					}
				popupContainer.querySelector("#popup-embed").innerHTML = mediaContent;	
			
			// random pos
				let viewportWidth = window.innerWidth;
				let viewportHeight = window.innerHeight;
				let popupWidth = popupContainer.offsetWidth || 300;
				let popupHeight = popupContainer.offsetHeight || 200;
			
				let randomX = Math.max(10, Math.random() * (viewportWidth - popupWidth - 20));
				let randomY = Math.max(10, Math.random() * (viewportHeight - popupHeight - 20));
			
				popupContainer.style.left = `${randomX}px`;
				popupContainer.style.top = `${randomY}px`;

				let windowSize = window.matchMedia("(max-width: 400px)");
				if (windowSize.matches) {
					popupContainer.style.setProperty('max-width', '300px');
					popupContainer.style.setProperty('max-height', '90%');
				}
			
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

	}



// It‘s always good to credit your work:
let renderUser = (collaborators, owner) => {
    // Ensure user data is available
    if (collaborators && collaborators[0].first_name && collaborators[0].slug && owner && owner.slug && owner.first_name) {
        let userAddress = `
            <address id="credit">
                <p>◌ website by: <a href="https://are.na/${collaborators[0].slug}" target="_blank">${collaborators[0].first_name}↗</a></p>
                <p>◌ original by: <a href="https://are.na/${owner.slug}" target="_blank">${owner.first_name}↗</a></p>
            </address>
        `;
        
        // Select the main-info section
        let mainInfoSection = document.querySelector('.main-info');

        // Append the user information to the main-info section
        mainInfoSection.insertAdjacentHTML('beforeend', userAddress);
    } else {
        console.log('null');
    }
};



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

		let collaborators = data.collaborators || {};  // Ensure user data exists
        let owner = data.owner || {};  // Assuming the owner is also in `data.user` (check API structure)

        // Call renderUser with both user and owner data
        renderUser(collaborators, owner);

	})


	