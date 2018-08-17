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

// Apple was eaten and it needs to move
export function moveApple(currentCoordinates) {
  const head = currentCoordinates.headCoordinates;
  const tails = currentCoordinates.tailCoordinates;
  const rocks = currentCoordinates.rockCoordinates;
  const lastTailSegment = currentCoordinates.recentTailPop;

  // Finding new apple location
  while (true) {
    var appleX = Math.floor(Math.random() * 20);
    var appleY = Math.floor(Math.random() * 16);
    var coordinates = { x: appleX, y: appleY };

    if (head.x !== appleX && head.y !== appleY) {
      var appleNotOnTail = true;
      var appleNotOnRock = overlappingWithRock([coordinates], rocks);
      for (var i = 0; i < tails.length; i++) {
        // Make sure apple doesn't appear on tail
        if (tails[i].x === appleX && tails[i].y === appleY) {
          appleNotOnTail = false;
          break;
        }
      }
    }
    // Apple does not show up on lastTailSegment
    var appleNotOnLastSegment = false;
    if (lastTailSegment.x !== appleX && lastTailSegment.y !== appleY) {
      appleNotOnLastSegment = true;
    }

    // We found a good spot
    if (appleNotOnTail && appleNotOnRock && appleNotOnLastSegment) {
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
  - 3 Rocks
  - Apple
  - Snake head
  - Snake tail
*/
export function randomStartLocation() {
  // 1) Place 3 rocks onto screen
  var rockCoordinates = [];
  while (rockCoordinates.length < 3) {
    // Start rock by placing top left corner, then the rest
    var rockX = Math.floor(Math.random() * 18);
    var rockY = Math.floor(Math.random() * 15) + 1;

    var possibleRock = [
      { x: rockX, y: rockY },
      { x: rockX + 1, y: rockY },
      { x: rockX, y: rockY - 1 },
      { x: rockX + 1, y: rockY - 1 }
    ];

    if (rockCoordinates.length === 0) {
      rockCoordinates.push(possibleRock);
    } else {
      // Check for rock overlapping
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

  // 2) Place apple
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

  // 3) Place initial snake head
  while (true) {
    var x = Math.floor(Math.random() * 20);
    var y = Math.floor(Math.random() * 16);
    var possibleHead = { x, y };
    var validHeadLocation = true;

    const headOverlapsRock = isItOverlappingRocks(
      possibleHead,
      rockCoordinates
    );
    const headOverlapsApple =
      _.intersectionWith(appleCoordinates, possibleHead).length !== 0;

    if (headOverlapsApple || headOverlapsRock) {
      validHeadLocation = false;
    }
    if (validHeadLocation) break;
  }

  const headCoordinates = { x, y };

  // 4) Place snake tail
  while (true) {
    // Choose if tail will be in X or Y direction
    const xOrY = Math.floor(Math.random() * 2);
    if (xOrY === 0) {
      const leftRight = Math.floor(Math.random() * 2);
      const tailX = leftRight === 0 ? x + 1 : x - 1;
      // Make sure X is in scope
      if (tailX > 0 && tailX < 20 && tailX !== appleX) {
        var tailCoordinates = { x: tailX, y };
        const isTailOverlappingRock = isItOverlappingRocks(
          tailCoordinates,
          rockCoordinates
        );
        const appleNotOnTail =
          _.intersectionWith(appleCoordinates, tailCoordinates).length === 0;
        if (appleNotOnTail && !isTailOverlappingRock) {
          break;
        }
      }
    } else {
      const upDown = Math.floor(Math.random() * 2);
      const tailY = upDown === 0 ? y + 1 : y - 1;
      // Make sure Y is in scope
      if (tailY > 0 && tailY < 16 && tailY !== appleY) {
        tailCoordinates = { x, y: tailY };
        const isTailOverlappingRock = isItOverlappingRocks(
          tailCoordinates,
          rockCoordinates
        );
        const appleNotOnTail =
          _.intersectionWith(appleCoordinates, tailCoordinates).length === 0;
        if (appleNotOnTail && !isTailOverlappingRock) {
          break;
        }
      }
    }
  }

  // Our valid coordinates
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
    return false;
  }
};
