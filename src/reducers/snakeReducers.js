import {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  START_LOCATIONS,
  EAT_APPLE,
  MOVE_APPLE,
  RESET_GAME
} from "../actions";

const initialState = {
  headCoordinates: null,
  recentTailPop: null,
  tailCoordinates: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MOVE_UP:
      return {
        ...state,
        recentTailPop: state.tailCoordinates.pop(),
        tailCoordinates: [state.headCoordinates, ...state.tailCoordinates],
        headCoordinates: {
          x: state.headCoordinates.x,
          y: state.headCoordinates.y + 1
        }
      };
    case MOVE_DOWN:
      return {
        ...state,
        recentTailPop: state.tailCoordinates.pop(),
        tailCoordinates: [state.headCoordinates, ...state.tailCoordinates],
        headCoordinates: {
          x: state.headCoordinates.x,
          y: state.headCoordinates.y - 1
        }
      };
    case MOVE_LEFT:
      return {
        ...state,
        recentTailPop: state.tailCoordinates.pop(),
        tailCoordinates: [state.headCoordinates, ...state.tailCoordinates],
        headCoordinates: {
          x: state.headCoordinates.x - 1,
          y: state.headCoordinates.y
        }
      };
    case MOVE_RIGHT:
      return {
        ...state,
        recentTailPop: state.tailCoordinates.pop(),
        tailCoordinates: [state.headCoordinates, ...state.tailCoordinates],
        headCoordinates: {
          x: state.headCoordinates.x + 1,
          y: state.headCoordinates.y
        }
      };
    case EAT_APPLE:
      return {
        ...state,
        tailCoordinates: [...state.tailCoordinates, state.recentTailPop]
      };
    case MOVE_APPLE:
      return { ...state, appleCoordinates: action.payload };
    case RESET_GAME:
      return initialState;
    case START_LOCATIONS:
      return {
        ...state,
        headCoordinates: action.payload.headCoordinates,
        tailCoordinates: [
          ...state.tailCoordinates,
          action.payload.tailCoordinates
        ],
        appleCoordinates: action.payload.appleCoordinates,
        rockCoordinates: action.payload.rockCoordinates
      };
    default:
      return state;
  }
}
