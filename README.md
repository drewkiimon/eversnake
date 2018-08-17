# Eversnake

My coding task for this project was to essentially recreate the classic game Snake, but with a minor twist. The snake will now eat apples and has to avoid hitting rocks. This project was created as a coding challenge for Everlaw in Berkeley, CA.

## Getting Started

Below are some simple instructions to make sure you're able to run this project.

### Prerequisites

To run this, you will need to have Nodejs installed to use npm. Once you've navigated to the folder with the project, run the action below.

```
npm i
```

This will allow your computer to download all the dependencies I use throughout the project.

### Running the Program

To run the Eversnake game, you will need to run the following command

```
npm start
```

This will open a tab in your default browser with the `http://localhost:3000` as the address.

## How to Play the Game

The game is fairly simple to play. There are three different objects on the board:

- Snake
- 3 Rock
- Apple

The goal of the game is to eat as many apples as possible without hitting a rock, hitting the sides of the grid, or your own tail!

### How to Move

The snake can only move in four directions:

- Up
- Down
- Left
- Right

The user can move the snake by using the arrow keys on their keyboard, or if you're a PC gamer you are able to us "WASD" to move the snake around.

Also, it is important to point out that the snake cannot move back to it's most recent spot after moving.

### The Snake

The snake is comprised of a head (shown with a dark green) and a tail (shown with a lighter green). Below, you will read how the snake's length increases over the game.

### The Apple

When the snake's head touches an apple, it's length last tail segment no longer fades away, and is not added to the length of the snake. Therefore, as the snake eats more and more, the longer it gets.

### What to Avoid

As stated above, you're going to want to avoid hitting these things, otherwise the game will reset:

- One of the three rocks
- The sides of the grid
- Yourself (aka your snake tail)

## Future Improvements

When creating this game, I created what the instructions provided by Everlaw stated. So in the future, here are some things I want to implement and how I would implement them.

#### Winning the Game

Right now, there is no way to win the game. You can eat apples forever and ever until you eventually hit a wall. However, there's an easy way to check if the user wins.

To check if the user wins, we can look at our Redux state, get the length of the current tail, and if its the length of the grid minus the head and 3 rocks, then the user can be declared as the victor!

#### Auto Moving Snake

The snake currently moves by the user's key inputs, while in the original game the snake moves in a certain direction until it is given a new direction to make in by the user.

The way I would accomplish this is by using the window feature setInterval that allows us to do a certain action after ever **x** milliseconds. We would have to include a variable in our state called **direction** that is either positive or negative x / y. So after each interval, the snake moves in said direction and only changes when the user clicks the keyboard, changing our direction state variable.

## Built With

- [create-react-app](https://github.com/facebook/create-react-app) - Boiler plate for React
- [React](https://reactjs.org/) - JavaScript frontend framework
- [Redux](https://redux.js.org/) - Application state
- [React-Redux](https://github.com/reduxjs/react-redux) - Ability to use Redux with React

## Author

- **Andrew Pagan**

## Acknowledgements

- Thank you to my cat Bud for keeping me company
