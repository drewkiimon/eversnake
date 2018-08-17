import _ from "lodash";

export const MOVE_UP = "move_up";
export const MOVE_DOWN = "move_down";
export const MOVE_LEFT = "move_left";
export const MOVE_RIGHT = "move_right";
export const START_LOCATIONS = "head_location";
export const EAT_APPLE = "eat_apple";
export const MOVE_APPLE = "move_apple";
export const RESET_GAME = "reset_game";

// Increment Y by 1
export function moveUp() {
  return {
    type: MOVE_UP
  };
}

// Decrement Y by 1
export function moveDown() {
  return {
    type: MOVE_DOWN
  };
}

// Decrement X by 1
export function moveLeft() {
  return {
    type: MOVE_LEFT
  };
}

// Increment X by 1
export function moveRight() {
  return {
    type: MOVE_RIGHT
  };
}

export function eatApple() {
  return {
    type: EAT_APPLE
  };
}

// Cannot be on snake's tail or head...
// Cannot appear on an apple
export function moveApple(currentCoordinates) {
  const head = currentCoordinates.headCoordinates;
  const tails = currentCoordinates.tailCoordinates;
  const rocks = currentCoordinates.rockCoordinates;
  // Finding new location

  while (true) {
    var appleX = Math.floor(Math.random() * 20);
    var appleY = Math.floor(Math.random() * 16);
    var coordinates = { x: appleX, y: appleY };

    if (head.x !== appleX && head.y !== appleY) {
      var goodToGo = true;
      var rockColliding = overlappingWithRock([coordinates], rocks);
      for (var i = 0; i < tails.length; i++) {
        if (tails[i].x === appleX && tails[i].y === appleY) {
          goodToGo = false;
          break;
        }
      }
    }

    if (goodToGo && rockColliding) {
      break;
    }
  }
  return {
    type: MOVE_APPLE,
    payload: coordinates
  };
}

export function resetGame() {
  return { type: RESET_GAME };
}

/*
Initializing placement of:
  - Apple
  - 3 Rocks
  - Snake head
  - Snake tail
*/
// apple {x:8, y:5}
// rock [[{x: 8, y: 6},{x: 9, y: 6}, {x: 8, y: 5}, {x: 9, y: 5} ]]
export function randomStartLocation() {
  var rockCoordinates = [];
  // Need to create 3 rocks
  while (rockCoordinates.length < 3) {
    var rockX = Math.floor(Math.random() * 18);
    var rockY = Math.floor(Math.random() * 15) + 1;

    var possibleRock = [
      { x: rockX, y: rockY },
      { x: rockX + 1, y: rockY },
      { x: rockX, y: rockY - 1 },
      { x: rockX + 1, y: rockY - 1 }
    ];

    // Place initial rock since nothing else is on the board yet
    // Current problems
    // 100% overlap
    // rocks colliding
    if (rockCoordinates.length === 0) {
      rockCoordinates.push(possibleRock);
    } else {
      // Make sure rocks do not overlap
      var goodRockPlacement = true;
      for (var i = 0; i < rockCoordinates.length; i++) {
        var isGoodToPlace = overlappingWithRock(possibleRock, rockCoordinates);
        if (!isGoodToPlace) {
          goodRockPlacement = false;
          break;
        }
      }
      if (goodRockPlacement) {
        rockCoordinates.push(possibleRock);
      }
    }
  }

  // Apple cannot overlap a rock
  // This is my problem right now
  while (true) {
    for (i = 0; i < rockCoordinates.length; i++) {
      var appleX = Math.floor(Math.random() * 20);
      var appleY = Math.floor(Math.random() * 16);
      var appleCoordinates = { x: appleX, y: appleY };
      isGoodToPlace = overlappingWithRock([appleCoordinates], rockCoordinates);
      if (!isGoodToPlace) {
        break;
      }
    }
    if (isGoodToPlace) break;
  }

  // Snake head cannot overlap rocks or apple
  while (true) {
    var x = Math.floor(Math.random() * 20);
    var y = Math.floor(Math.random() * 16);
    var possibleHead = { x, y };
    var goodHead = true; // Change later

    // Come fix this hell hole later
    const checkRockOverlap = isItOverlappingRocks(
      possibleHead,
      rockCoordinates
    );
    const checkAppleOverlap =
      _.intersectionWith(appleCoordinates, possibleHead).length !== 0;
    if (checkAppleOverlap || checkRockOverlap) {
      goodHead = false;
    }

    if (goodHead) {
      break;
    }
  }

  const headCoordinates = { x, y };

  // Snake tail cannot overlap rocks, apple, or the snake head
  while (true) {
    // Is the tail going to be in the X or Y direction
    const xOrY = Math.floor(Math.random() * 2);
    if (xOrY === 0) {
      const leftRight = Math.floor(Math.random() * 2);
      const tailX = leftRight === 0 ? x + 1 : x - 1;
      // Make sure X is in scope
      if (tailX > 0 && tailX < 20 && tailX !== appleX) {
        var tailCoordinates = { x: tailX, y };
        // cross check with rocks and apple
        const isItOverlapping = isItOverlappingRocks(
          tailCoordinates,
          rockCoordinates
        );

        if (
          _.intersectionWith(appleCoordinates, tailCoordinates).length === 0 &&
          !isItOverlapping
        ) {
          break;
        }
      }
    } else {
      const upDown = Math.floor(Math.random() * 2);
      const tailY = upDown === 0 ? y + 1 : y - 1;
      // Make sure Y is in scope
      if (tailY > 0 && tailY < 16 && tailY !== appleY) {
        tailCoordinates = { x, y: tailY };
        const isItOverlapping = isItOverlappingRocks(
          tailCoordinates,
          rockCoordinates
        );

        if (
          _.intersectionWith(appleCoordinates, tailCoordinates).length === 0 &&
          !isItOverlapping
        ) {
          break;
        }
      }
    }
  }

  const coordinates = {
    headCoordinates,
    tailCoordinates,
    appleCoordinates,
    rockCoordinates
  };

  return {
    type: START_LOCATIONS,
    payload: coordinates
  };
}

const isItOverlappingRocks = (node, rockCoordinates) => {
  // Iterate over rocks
  for (var i = 0; i < rockCoordinates.length; i++) {
    var currentRock = rockCoordinates[i];
    for (var j = 0; j < currentRock.length; j++) {
      const elem = currentRock[j];
      const isOverlapping = node.x === elem.x && node.y === elem.y;
      if (isOverlapping) {
        return true;
      }
    }
  }
  return false;
};

// Make sure nothing is going into the rocks
const overlappingWithRock = (item, rocks) => {
  var good = true;
  for (var i = 0; i < rocks.length; i++) {
    const currentRock = rocks[i];
    item.forEach(el => {
      for (var j = 0; j < currentRock.length; j++) {
        var curr = currentRock[j];
        if (curr.x === el.x && curr.y === el.y) {
          good = false;
        }
      }
    });
  }
  if (good) {
    return true;
  } else {
    // bad
    return false;
  }
};
