document.addEventListener("DOMContentLoaded", () => {
  const listEls = document.querySelectorAll(".categories li");
  const engine = Matter.Engine.create();
  const world = engine.world;


  let windowSize = window.matchMedia("(max-width: 400px)");
  console.log(windowSize);

    //   if (windowSize.matches) {
    //     rightWall = Matter.Bodies.rectangle(700, 250, 10, 500, { isStatic: true });
    //   }

  // const stack = Matter.Composites.stack(
    // xx, yy, columns, rows, columnGap, rowGap, cb
    // 0, 0, listEls.length, 1, 0, 0,
    // (xx, yy, i) => {
    //   const {x, y, width, height} = listEls[i].getBoundingClientRect();
    //   return Matter.Bodies.rectangle(x, y, width, height, {
        // isStatic: i === 0 || i + 1 === listEls.length
  //     });
  //   }
  // );
  
  // Matter.Composites.chain(stack, 0.5, 0, -0.5, 0, {
  //   stiffness: 0.5,
  //   length: 20
  // });

  const bodies = [];
  listEls.forEach((el, i) => {
      const { width, height } = el.getBoundingClientRect();

      let labelXMultiplier;
      let labelYMultiplier;

      if (windowSize.matches) {
         labelXMultiplier = 150;
         labelYMultiplier = 10;
      } 
      else {
         labelXMultiplier = 600;
         labelYMultiplier = 50;
      }

      // to do: fix wall in mobile

      const body = Matter.Bodies.rectangle(
          100 + Math.random() * labelXMultiplier, // xpos
          // original was 600
          50 + Math.random() * labelYMultiplier, // ypos
          width,
          height,
          {
              restitution: 0.6,
              friction: 0.5,
              density: 0.01,
          }
      );

      el.body = body;
      bodies.push(body);
      Matter.World.add(world, body);

      // filter blocks
      el.addEventListener("click", () => {
        console.log(el.textContent); 
    
        let image = document.getElementsByClassName("image-item");
        let attachment = document.getElementsByClassName("attachment-item");
        let link = document.getElementsByClassName("link-item");
        let media = document.getElementsByClassName("media-item");
        let text = document.getElementsByClassName("text-item");
    
        let allItems = [...image, ...attachment, ...link, ...media, ...text];
        allItems.forEach(item => item.style.display = "flex");


        if (el.textContent === "Images") {
            hideItems(attachment, link, media, text);
        } else if (el.textContent === "Attachments") {
            hideItems(image, link, media, text);
        } else if (el.textContent === "Links") {
            hideItems(image, attachment, media, text);
        } else if (el.textContent === "Media") {
            hideItems(image, attachment, link, text);
        } else if (el.textContent === "Text") {
            hideItems(image, attachment, link, media);
        } else if (el.textContent === "Show All") {
          allItems.forEach(item => item.style.borderBottom = "2.5px dashed black");
      }

        if (el.textContent !== "Show All") {
          removeLastItemBorder(image);
          removeLastItemBorder(attachment);
          removeLastItemBorder(link);
          removeLastItemBorder(media);
          removeLastItemBorder(text);
      }
    });


    function hideItems(...categories) {
        categories.forEach(category => {
            for (let i = 0; i < category.length; i++) {
                category[i].style.display = "none";
            }
        });
}

    // this is weird sorry lol
    function removeLastItemBorder(items) {
      if (items.length > 0) {
          items[items.length - 1].style.borderBottom = "none";
      }
    }
    
  });

  // bounds
  let ground;
  let leftWall;
  let rightWall;

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
    
  // menus are 10vw on each side
  let leftBoundary = viewportWidth * 0.1;
  let rightBoundary = viewportWidth * 0.9;
  let bottomBoundary = viewportHeight / 2;

  // params: (x, y, width, height)
  // mobile
  if (windowSize.matches) {
        ground = Matter.Bodies.rectangle(400, bottomBoundary, 5000, 20, { isStatic: true });
        leftWall = Matter.Bodies.rectangle(leftBoundary, 400, 20, 10000, { isStatic: true });
        rightWall = Matter.Bodies.rectangle(rightBoundary, 400, 20, 10000, { isStatic: true });
    } 

    // desktop
    else {
        ground = Matter.Bodies.rectangle(400, 450, 800, 20, { isStatic: true });
        leftWall = Matter.Bodies.rectangle(0, 250, 20, 500, { isStatic: true });
        rightWall = Matter.Bodies.rectangle(700, 250, 20, 500, { isStatic: true });
    }

  Matter.World.add(world, [ground, leftWall, rightWall]);

  
  // mouse
  const mouse = Matter.Mouse.create(document.querySelector(".categories"));
  const mouseConstraint = Matter.MouseConstraint.create(engine, { mouse });
  Matter.World.add(world, mouseConstraint);

  // on mouse move
  document.addEventListener("mousemove", (event) => {
      const mousePos = { x: event.clientX, y: event.clientY };

      bodies.forEach((body, i) => {
          const dx = Math.abs(mousePos.x - body.position.x);
          const dy = Math.abs(mousePos.y - body.position.y);

          if (dx < 50 && dy < 50) { 
              const forceMagnitude = 0.03;
              const directionX = (mousePos.x > body.position.x ? -1 : 1) * forceMagnitude;
              const directionY = -forceMagnitude;

              Matter.Body.applyForce(body, body.position, { x: directionX, y: directionY });
          }
      });
  });

  // reset
  const resetButton = document.createElement("button");
  resetButton.textContent = "reset blocks ↺";
  document.body.appendChild(resetButton);

  //to do: fix mobile wall sizes in reset button
  resetButton.addEventListener("click", () => {
    let labelXMultiplier, labelYMultiplier;

    if (windowSize.matches) {
        labelXMultiplier = 150;
        labelYMultiplier = 10;
    } else {
        labelXMultiplier = 600;
        labelYMultiplier = 50;
    }

    bodies.forEach((body, i) => {
        Matter.Body.setPosition(body, {
            x: 100 + Math.random() * labelXMultiplier,
            y: 50 + Math.random() * labelYMultiplier,
        });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngle(body, 0);
        Matter.Body.setAngularVelocity(body, 0);
        });
    });


  // sync
  (function update() {
      requestAnimationFrame(update);

      listEls.forEach((el, i) => {
          const body = bodies[i];
          el.style.position = "absolute";
          el.style.top = `${body.position.y}px`;
          el.style.left = `${body.position.x}px`;
          el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });

      Matter.Engine.update(engine);
  })();

  // run engine
  Matter.Runner.run(Matter.Runner.create(), engine);
});
