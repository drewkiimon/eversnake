import React, { Component } from "react";
import _ from "lodash";
// import "./App.css";
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

  componentDidMount() {
    document.addEventListener("keydown", this.moveSnake);
    this.props.randomStartLocation();
  }

  // Called once we get an update from Redux
  componentDidUpdate(prevProps) {
    // If the head moved, we check
    if (this.props.snake.headCoordinates !== prevProps.snake.headCoordinates) {
      if (this.snakeAteApple()) {
        this.props.eatApple();
        this.props.moveApple(this.props.snake);
      }
    }
  }

  snakeAteApple() {
    const toEatOrNotToEat = _.isEqual(
      this.props.snake.headCoordinates,
      this.props.snake.appleCoordinates
    ); // that is the question
    return toEatOrNotToEat;
  }

  // Stops user from moving back to most recent tail spot
  // Use it to check if it's on it's tail either
  validMove(direction) {
    var head = this.props.snake.headCoordinates;
    const tails = this.props.snake.tailCoordinates;
    const rocks = this.props.snake.rockCoordinates;
    const closestTail = tails[0];
    // Depending on direction
    if (direction === "up") {
      head = { x: head.x, y: head.y + 1 };
    } else if (direction === "down") {
      head = { x: head.x, y: head.y - 1 };
    } else if (direction === "left") {
      head = { x: head.x - 1, y: head.y };
    } else if (direction === "right") {
      head = { x: head.x + 1, y: head.y };
    }

    const isMovingBackwards = !_.isEqual(head, closestTail);
    var gameOver = false;
    // Does new head move onto tail?
    for (var i = 0; i < tails.length - 1; i++) {
      if (_.isEqual(head, tails[i]) && isMovingBackwards) {
        gameOver = true;
      }
    }

    const hitRock = isItOverlappingRocks(head, rocks);
    if (head.x < 0 || head.x > 19 || head.y < 0 || head.y > 15 || hitRock) {
      gameOver = true;
    }

    if (!gameOver) {
      return isMovingBackwards;
    } else {
      this.props.resetGame();
      this.props.randomStartLocation();
    }
  }

  // W, S, A, R
  // Up, Down, Left, Right
  moveSnake(event) {
    const keyCode = event.keyCode;
    const direction = keyCodes[keyCode];

    if (this.validMove(direction)) {
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
