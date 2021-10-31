import { State } from './State';
import { Penguin } from './Penguin';
import { Position } from './Position';
import { Moves } from './Moves';
import { orMap } from '../Utils/ArrayUtils';

// contains the data definitions and functions for a Gametree
export namespace GameTree {
  /**
   * A Game is a tree of GameStates, where the top most node is the initial state,
   * and the bottom of the tree represents the end of game.
   */
  export type Game = {
    // A Node is the current state of the game.
    // A GameState where all of the penguins have already been placed
    state: State.GameState;
    // Children are Game States reachable by 1 valid move from the node gamestate
    // could be undefined if children have not been calculated yet. It is empty if there are no possible
    // moves from the current game state. The key is false if a player cannot move on a given turn.
    // It is a collection of key value pairs of moves to their resulting states
    children?: ActionGameTuple[];
  };

  /**
   * This is a key value pair, where the first element represents the move that brought you to
   * the value game state. Or it is false to represent a skipped player turn.
   *
   * This maps an action to a Game Tree result.
   */
  export type ActionGameTuple = [Moves.Move | false, Game];

  /**
   * Iteratively generates new levels of the tree. It returns the complete tree at each stage of iteration
   *
   * Use: const tree = generateStree(startState)
   * tree.next() -> generate one layer of children, you will now see one level of child states
   * tree.next() -> adds children to the last layer of children
   *
   * tree.next() returns {value: Game, done: boolean}.
   * When done returns true, there are no more values in the tree. It will continue to return {done: true, value: undefined}
   * when next is called.
   *
   * @param initialState must be a state where no more penguins will be placed
   * @return a generator that yields a Game, returns a Game, and can be passed in a Game
   */
  export function* generateTree(
    initialState: State.GameState
  ): Generator<Game, Game, Game> {
    let tree: Game = { state: initialState };
    while (areThereAnyMorePotentialGameStates(tree)) {
      const newTree = generateChildrenAtBottomOfATree(tree);
      tree = newTree;
      yield newTree;
    }
    return tree;
  }

  /**
   * Determines if more branches can be added to the game tree, in other words
   * does any state have any possible remaining moves
   *
   * @param tree the tree to check
   * @return true if more branches can be added
   */
  export function areThereAnyMorePotentialGameStates(tree: Game): boolean {
    if (tree.children) {
      return orMap<ActionGameTuple>(tree.children, ([action, game]) =>
        areThereAnyMorePotentialGameStates(game)
      );
    }

    return State.canAnyPenguinBeMoved(tree.state);
  }

  /**
   * Adds a layer of child states to the bottom of the tree.
   *
   * If there are no new child states under the tree, it will return the tree itself.
   *
   * @param tree the tree to add another layer to
   * @return the tree with a new layer of children on the bottom of the tree
   */
  function generateChildrenAtBottomOfATree(tree: Game): Game {
    if (tree.children) {
      return {
        state: tree.state,
        children: tree.children.map(([move, game]) => [
          move,
          generateChildrenAtBottomOfATree(game),
        ]),
      };
    } else if (State.canAnyPenguinBeMoved(tree.state)) {
      return {
        state: tree.state,
        children: generateChildren(tree.state),
      };
    } else {
      return tree;
    }
  }

  /**
   * Generate the children of the current state
   * If there are no children it will return []
   * If this turn must be a player skip it will return [false, updatedGameState]
   *    where the turn of state has been incremented
   * Otherwise it returns an array of children.
   * @param state the state
   * @return The array of tuples of moves to their resulting states
   */
  export function generateChildren(state: State.GameState): ActionGameTuple[] {
    const penguinTeamForNextPlayer = State.getCurrentPenguinTeam(state);
    if (!State.canAnyPenguinBeMoved(state)) {
      return [];
    }
    // do we have to skip this turn
    if (
      !State.canAnyPenguinOfPenguinTeamBeMoved(
        penguinTeamForNextPlayer,
        state
      )
    ) {
      return [[false, { state: State.incrementTurn(state) }]];
    }

    return getAllStatesForPenguinTeam(
      penguinTeamForNextPlayer,
      state.playersTurn,
      state
    );
  }

  /**
   * Get resulting states for all moves of all penguins in this penguin team
   *
   * @param penguinTeam the penguinTeam with penguins to be moved
   * @param player the index of the penguinTeam
   * @param state the game state to base moves off of
   * @return ActionGameTuple[] a tuple array connecting moves to their resulting states
   */
  function getAllStatesForPenguinTeam(
    penguinTeam: Penguin.PenguinTeam,
    player: number,
    state: State.GameState
  ): ActionGameTuple[] {
    let resultingStates: ActionGameTuple[] = [];
    penguinTeam.penguins.forEach((penguin) => {
      const allStatesForPenguin = getAllStatesForPenguin(
        penguin,
        player,
        state
      );

      // Creates a merged array of tuples
      resultingStates = [...allStatesForPenguin, ...resultingStates];
    });

    return resultingStates;
  }

  /**
   * Get all resulting states from moving this penguin. Returns an array of actiontuples
   * which represent moves, and the states they result in
   *
   * @param penguin the penguin to be moved
   * @param player the index of the penguinTeam with the given Penguin
   * @param state the game state to base moves off of
   * @return ActionGameTuple a tuple array of moves to their resulting states
   */
  export function getAllStatesForPenguin(
    penguin: Penguin.Penguin,
    player: number,
    state: State.GameState
  ): ActionGameTuple[] {
    const resultingStates = [] as [Moves.Move, Game][];
    const allDestinations = Moves.getAllDestinations(
      penguin.position,
      state
    );

    allDestinations.forEach((destination) => {
      const movePenguin = State.movePenguin(
        player,
        { from: penguin.position, to: destination },
        state
      );
      resultingStates.push([
        { from: penguin.position, to: destination },
        { state: movePenguin },
      ]);
    });
    return resultingStates;
  }

  /**
   * Generates an entire tree given a starting gamestate
   * @param state the starting state for the top of the tree
   * @return the whole tree
   */
  export function generateWholeTree(state: State.GameState): Game {
    const treeGenerator = generateTree(state);
    let nextTree = treeGenerator.next();
    while (!nextTree.done) {
      nextTree = treeGenerator.next();
    }
    return nextTree.value;
  }

  /**
   * Attempts to apply a list of transformations to the gamestate
   *
   * Returns the index of the action in the sequence that is illegal
   * or returns a game state result of applying legal actions
   *
   * @param state the state to determine legality for
   * @param actions is an array of functions where each function is a transformation of the state.
   * @return a number representing the action that was illegal, or the game state result of applying each action
   */
  export function queryState(
    state: State.GameState,
    actions: ((state: State.GameState) => State.GameState)[]
  ): number | State.GameState {
    let currState = state;
    let index = 0;
    for (let action of actions) {
      const nextState = action(currState);
      const currStateChildren = generateChildren(currState);
      // is any child state of currStateChildren equal to the nextState
      const isNextStateWellDefined = isStateWithinChildren(
        currStateChildren,
        nextState
      );

      if (!isNextStateWellDefined) {
        return index;
      }

      currState = nextState;
      index++;
    }
    return currState;
  }

  export function isStateWithinChildren(
    children: ActionGameTuple[],
    stateToFind: State.GameState
  ): boolean {
    return orMap<ActionGameTuple>(children, ([action, move]) => {
      return State.areGameStatesEqual(move.state, stateToFind);
    });
  }

  /**
   * Applies a given function to all of the states reachable from the given state
   *
   * (hint this is fold for trees)
   *
   * @param state the node state to begin applying from
   * @param combinator a function that combines the next state with the previous result
   * @param baseValue a base value for the function
   * @return result of applying combinator to each state
   */
  export function applyFunctionToChildren<T>(
    state: State.GameState,
    combinator: (element: State.GameState, previous: T) => T,
    baseValue: T
  ): T {
    const children = generateChildren(state);

    let newBase = combinator(state, baseValue);

    children.forEach(([action, game]) => {
      newBase = applyFunctionToChildren(game.state, combinator, newBase);
    });

    return newBase;
  }

  /**
   * Applies a given function to all of the actions reachable from the given state
   * Supplied with a max depth to search so the user does not have to traverse through the
   * entire tree
   *
   * @param tuple The action game tuple at the level of the tree
   * @param combinator the function to take the array of children and combine to one value
   * @param maxDepth how many levels down the tree the recursion will go
   */
  export function applyCombinatorToChildren<T>(
    tuple: ActionGameTuple,
    combinator: (element: ActionGameTuple, accumulator: T[]) => T,
    maxDepth: number
  ): T {
    const children = generateChildren(tuple[1].state);
    // if we have reached the end of allowed depth, return the node with no more children
    if (maxDepth === 0) {
      return combinator(tuple, []);
    }
    // else we recur and minus 1 from the depth
    const childrenValues = children.map((actionTuple) => {
      return applyCombinatorToChildren(
        actionTuple,
        combinator,
        maxDepth - 1
      );
    });

    return combinator(tuple, childrenValues);
  }
}
