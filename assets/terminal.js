window.addEventListener("load", function() {
    const introText = document.querySelector("#intro");
    const terminal = document.getElementById("terminal");
    const enterSection = document.getElementById("enter");

    // booting up
    const introLines = [
        "[BOOT] Initializing system...",
        "[BOOT] Loading assets...",
        "[INIT] Interface load successful.",
        "[DISPLAY] Rendering... ██████████ 100%"
    ];

    let introIndex = 0;

    function typeIntroText() {
        if (introIndex < introLines.length) {
            let line = introLines[introIndex];
            let charIndex = 0;

            const pElement = document.createElement("p");

            function typeCharacter() {
                if (charIndex < line.length) {
                    pElement.textContent += line.charAt(charIndex); 
                    introText.appendChild(pElement); 
                    charIndex++;
                    setTimeout(typeCharacter, 20); 
                } else {
                    introIndex++;
                    setTimeout(typeIntroText, 200); 
                }
            }
            typeCharacter();
        } else {
            setTimeout(showTerminal, 600);
        }
    }

    typeIntroText();

    // ascii
    function showTerminal() {
        terminal.style.display = "block"; 
        typeTerminalText();
    }

    function typeTerminalText() {
		// looked up string split - https://stackoverflow.com/questions/4539878/strange-string-split-n-behavior
        let lines = terminal.textContent.split("\n");
        terminal.textContent = ""; 
        let i = 0;

        
        function typeLine() {
            if (i < lines.length) {
                terminal.textContent += lines[i] + "\n"; 
                i++;
                setTimeout(typeLine, 50); 
            } else {
                setTimeout(typeInstructionText, 500);
            }
        }

        typeLine();
    }

    // instructions
	function typeInstructionText() {
        const instructionText = "TYPE 'ENTER' AND PRESS ENTER TO PROCEED";
        let charIndex = 0;
        enterSection.innerHTML = `<span class="instruction"></span><br><span class="user-input"></span><span class="blinking-cursor">_</span>`;
        const instructionSpan = enterSection.querySelector(".instruction");
        const userInputSpan = enterSection.querySelector(".user-input");

        function typeCharacter() {
            if (charIndex < instructionText.length) {
                instructionSpan.textContent += instructionText.charAt(charIndex);
                charIndex++;
                setTimeout(typeCharacter, 40);
            } else {
                startUserTyping();
            }
        }

        typeCharacter();
    }

    function startUserTyping() {
        const userInputSpan = enterSection.querySelector(".user-input");
        const cursor = enterSection.querySelector(".blinking-cursor");
        let typedText = "";

        document.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                if (typedText.trim().toLowerCase() === "enter") {
                    window.location.href = "main.html";
                } else {
                    typedText = "";
                    userInputSpan.textContent = "";
                }
            } else if (event.key.length === 1) {
                typedText += event.key;
                userInputSpan.textContent = typedText;
            } else if (event.key === "Backspace") {
                typedText = typedText.slice(0, -1);
                userInputSpan.textContent = typedText;
            }
        });
    }
});
