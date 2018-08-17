import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import Grid from "./components/Grid";

import {
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  randomStartLocation,
  eatApple,
  moveApple,
  resetGame
} from "./actions";

// Key codes of arrows and W, A, S, D for movement
const keyCodes = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  87: "up",
  65: "left",
  83: "down",
  68: "right"
};

class App extends Component {
  constructor(props) {
    super(props);

    this.moveSnake = this.moveSnake.bind(this);
  }

  // Initialize event listener and item locations
  componentDidMount() {
    document.addEventListener("keydown", this.moveSnake);
    this.props.randomStartLocation();
  }

  // Called once we get an update from Redux
  componentDidUpdate(prevProps) {
    // If the head moved, we check
    if (this.props.snake.headCoordinates !== prevProps.snake.headCoordinates) {
      if (this.didEatApple()) {
        this.props.eatApple();
        this.props.moveApple(this.props.snake);
      }
    }
  }

  didEatApple() {
    const toEatOrNotToEat = _.isEqual(
      this.props.snake.headCoordinates,
      this.props.snake.appleCoordinates
    ); // that is the question
    return toEatOrNotToEat;
  }

  // Check to see if snake does not move onto tail
  movedOntoTail(head, tails, notMovingBackwards) {
    for (var i = 0; i < tails.length - 1; i++) {
      const headIsOnTail = _.isEqual(head, tails[i]);
      if (headIsOnTail && notMovingBackwards) {
        return true;
      }
    }
    return false;
  }

  // Check if next move is valid
  isValidMove(direction) {
    var state = this.props.snake;
    var head = state.headCoordinates;
    const tails = state.tailCoordinates;
    const rocks = state.rockCoordinates;
    const firstTailSegment = tails[0];

    if (direction === "up") {
      head = { x: head.x, y: head.y + 1 };
    } else if (direction === "down") {
      head = { x: head.x, y: head.y - 1 };
    } else if (direction === "left") {
      head = { x: head.x - 1, y: head.y };
    } else if (direction === "right") {
      head = { x: head.x + 1, y: head.y };
    }

    // Logic to see if snake head is trying to move to first tail segment
    const notMovingBackwards = !_.isEqual(head, firstTailSegment);

    var gameOver = false;
    gameOver = this.movedOntoTail(head, tails, notMovingBackwards);

    const hitRock = isItOverlappingRocks(head, rocks);

    // If the snake goes out of bounds or hits a rock
    if (head.x < 0 || head.x > 19 || head.y < 0 || head.y > 15 || hitRock) {
      gameOver = true;
    }

    if (!gameOver) {
      return notMovingBackwards;
    } else {
      // The user made a move
      this.props.resetGame();
      this.props.randomStartLocation();
    }
  }

  // W, S, A, R
  // Up, Down, Left, Right
  moveSnake(event) {
    const keyCode = event.keyCode;
    const direction = keyCodes[keyCode];

    if (this.isValidMove(direction)) {
      if (direction === "up") {
        this.props.moveUp();
      } else if (direction === "down") {
        this.props.moveDown();
      } else if (direction === "left") {
        this.props.moveLeft();
      } else if (direction === "right") {
        this.props.moveRight();
      }
    }
  }

  render() {
    return (
      <div id="grid-holder">
        <Grid />
      </div>
    );
  }
}

const isItOverlappingRocks = (node, rockCoordinates) => {
  var rockChecker = [];
  for (var i = 0; i < rockCoordinates.length; i++) {
    var currentRock = rockCoordinates[i];
    for (var j = 0; j < currentRock.length; j++) {
      const elem = currentRock[j];
      const helper = node.x === elem.x && node.y === elem.y;
      if (helper) {
        rockChecker.push(helper);
      }
    }
  }
  return rockChecker.length !== 0;
};

const mapStateToProps = state => {
  return {
    snake: state.snake
  };
};

export default connect(
  mapStateToProps,
  {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    randomStartLocation,
    eatApple,
    moveApple,
    resetGame
  }
)(App);
