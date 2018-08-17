import React, { Component } from "react";
import { connect } from "react-redux";
import "./Grid.css";

// Comprised of 16 rows and 20 columns
class Grid extends Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.snake.headCoordinates !== prevProps.snake.headCoordinates ||
      this.props.snake.tailCoordinates.length !==
        prevProps.snake.tailCoordinates.length
    ) {
      const snakeState = this.props.snake;
      const head = snakeState.headCoordinates;
      const tails = snakeState.tailCoordinates;
      const apple = snakeState.appleCoordinates;
      const rocks = snakeState.rockCoordinates;
      var grid = document.getElementById("grid-holder");
      while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
      }
      if (head) {
        for (var y = 15; y > -1; y--) {
          var container = document.createElement("div");
          container.classList.add("container");
          for (var x = 0; x < 20; x++) {
            var element = document.createElement("div");
            // Snake head
            if (head.x === x && head.y === y) {
              element.classList.add("snake-head");
            } else if (apple.x === x && apple.y === y) {
              element.classList.add("apple");
            }
            // Iterate through tails
            for (var i = 0; i < tails.length; i++) {
              if (tails[i].x === x && tails[i].y === y) {
                element.classList.add("snake-tail");
                break;
              }
            }
            // Iterate through rocks
            for (i = 0; i < rocks.length; i++) {
              var currentRock = rocks[i];
              for (var j = 0; j < currentRock.length; j++) {
                if (currentRock[j].x === x && currentRock[j].y === y) {
                  element.classList.add("rock");
                  break;
                }
              }
            }
            if (element.classList === "") {
              element.classList.add("open-space");
            }
            container.appendChild(element);
          }
          grid.appendChild(container);
        }
      }
    }
  }

  componentDidMount() {}

  render() {
    return <div id="grid-holder" />;
  }
}

const mapStateToProps = state => {
  return {
    snake: state.snake
  };
};

export default connect(
  mapStateToProps,
  {}
)(Grid);
