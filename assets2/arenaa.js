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

		const linkElement = document.querySelector('.link-item:last-child');
		linkElement.addEventListener('click', () => {
			openLinkPopup(block); 
		});
	}

		// open links pop-up
		let openLinkPopup = (block) => {
			document.getElementById("popup-title").textContent = block.title;
			document.getElementById("popup-description").innerHTML = block.description_html;

			let pictureElement = document.getElementById("popup-image");
			pictureElement.innerHTML = `
				<picture>
					<source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
					<source media="(max-width: 640px)" srcset="${block.image.large.url}">
					<img src="${block.image.original.url}" alt="${block.title}">
				</picture>
			`;

			let linkElement = document.getElementById("popup-link");
			linkElement.href = block.source.url;
			linkElement.textContent = "see the original ↗";

			document.getElementById("link-popup").classList.add("visible");
		};

		document.getElementById("close-link-popup").addEventListener("click", () => {
			document.getElementById("link-popup").classList.remove("visible");
		});

	// Images!
	if (block.class === 'Image') {
		let imageItem = `
			<div class="item image-item">
				<img src="${getBlockImage(block.class)}" alt="${block.class}" class="block-image">
				<h3>${block.title}</h3> 
			</div>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', imageItem); 
	
		const imageElement = document.querySelector('.image-item:last-child');
		imageElement.addEventListener('click', () => {
			openImagePopup(block); 
		});
	}
	
		// open image pop-up
		let openImagePopup = (block) => {
			document.getElementById("popup-title").textContent = block.title;
		
			let pictureElement = document.getElementById("popup-image");
			pictureElement.innerHTML = `
				<picture>
					<source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
					<source media="(max-width: 640px)" srcset="${block.image.large.url}">
					<img src="${block.image.original.url}" alt="${block.title}">
				</picture>
			`;
		
			document.getElementById("popup-description").innerHTML = block.description_html || "";
		
			document.getElementById("link-popup").classList.add("visible");
		};
		
		document.getElementById("close-link-popup").addEventListener("click", () => {
			document.getElementById("link-popup").classList.remove("visible");
		});

	// Text!
	

	









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