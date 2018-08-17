import React, { Component } from "react";
import { connect } from "react-redux";
import "./Grid.css";

// Comprised of 16 rows and 20 columns
class Grid extends Component {
  componentDidUpdate(prevProps) {
    var snake = this.props.snake;
    if (
      snake.headCoordinates !== prevProps.snake.headCoordinates ||
      snake.tailCoordinates.length !== prevProps.snake.tailCoordinates.length
    ) {
      const head = snake.headCoordinates;
      const tails = snake.tailCoordinates;
      const apple = snake.appleCoordinates;
      const rocks = snake.rockCoordinates;

      var grid = document.getElementById("grid-holder");
      // We clear the grid when we get new head / tail coorindates
      while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
      }

      // If head exists on board
      if (head) {
        // Go backwards for our grid
        for (var y = 15; y > -1; y--) {
          var container = document.createElement("div");
          container.classList.add("container");
          // Appending divs and class names to each container div
          for (var x = 0; x < 20; x++) {
            var element = document.createElement("div");
            // Check for snake head
            if (head.x === x && head.y === y) {
              element.classList.add("snake-head");
            }
            // Check for apple
            else if (apple.x === x && apple.y === y) {
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
            // Everything else gets a open space
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
  // Took ID off of this div
  render() {
    return <div />;
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
