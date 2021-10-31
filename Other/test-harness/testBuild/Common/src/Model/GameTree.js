"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
const Moves_1 = require("./Moves");
const ArrayUtils_1 = require("../Utils/ArrayUtils");
// contains the data definitions and functions for a Gametree
var GameTree;
(function (GameTree) {
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
    function* generateTree(initialState) {
        let tree = { state: initialState };
        while (areThereAnyMorePotentialGameStates(tree)) {
            const newTree = generateChildrenAtBottomOfATree(tree);
            tree = newTree;
            yield newTree;
        }
        return tree;
    }
    GameTree.generateTree = generateTree;
    /**
     * Determines if more branches can be added to the game tree, in other words
     * does any state have any possible remaining moves
     *
     * @param tree the tree to check
     * @return true if more branches can be added
     */
    function areThereAnyMorePotentialGameStates(tree) {
        if (tree.children) {
            return ArrayUtils_1.orMap(tree.children, ([action, game]) => areThereAnyMorePotentialGameStates(game));
        }
        return State_1.State.canAnyPenguinBeMoved(tree.state);
    }
    GameTree.areThereAnyMorePotentialGameStates = areThereAnyMorePotentialGameStates;
    /**
     * Adds a layer of child states to the bottom of the tree.
     *
     * If there are no new child states under the tree, it will return the tree itself.
     *
     * @param tree the tree to add another layer to
     * @return the tree with a new layer of children on the bottom of the tree
     */
    function generateChildrenAtBottomOfATree(tree) {
        if (tree.children) {
            return {
                state: tree.state,
                children: tree.children.map(([move, game]) => [
                    move,
                    generateChildrenAtBottomOfATree(game),
                ]),
            };
        }
        else if (State_1.State.canAnyPenguinBeMoved(tree.state)) {
            return {
                state: tree.state,
                children: generateChildren(tree.state),
            };
        }
        else {
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
    function generateChildren(state) {
        const penguinTeamForNextPlayer = State_1.State.getCurrentPenguinTeam(state);
        if (!State_1.State.canAnyPenguinBeMoved(state)) {
            return [];
        }
        // do we have to skip this turn
        if (!State_1.State.canAnyPenguinOfPenguinTeamBeMoved(penguinTeamForNextPlayer, state)) {
            return [[false, { state: State_1.State.incrementTurn(state) }]];
        }
        return getAllStatesForPenguinTeam(penguinTeamForNextPlayer, state.playersTurn, state);
    }
    GameTree.generateChildren = generateChildren;
    /**
     * Get resulting states for all moves of all penguins in this penguin team
     *
     * @param penguinTeam the penguinTeam with penguins to be moved
     * @param player the index of the penguinTeam
     * @param state the game state to base moves off of
     * @return ActionGameTuple[] a tuple array connecting moves to their resulting states
     */
    function getAllStatesForPenguinTeam(penguinTeam, player, state) {
        let resultingStates = [];
        penguinTeam.penguins.forEach((penguin) => {
            const allStatesForPenguin = getAllStatesForPenguin(penguin, player, state);
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
    function getAllStatesForPenguin(penguin, player, state) {
        const resultingStates = [];
        const allDestinations = Moves_1.Moves.getAllDestinations(penguin.position, state);
        allDestinations.forEach((destination) => {
            const movePenguin = State_1.State.movePenguin(player, { from: penguin.position, to: destination }, state);
            resultingStates.push([
                { from: penguin.position, to: destination },
                { state: movePenguin },
            ]);
        });
        return resultingStates;
    }
    GameTree.getAllStatesForPenguin = getAllStatesForPenguin;
    /**
     * Generates an entire tree given a starting gamestate
     * @param state the starting state for the top of the tree
     * @return the whole tree
     */
    function generateWholeTree(state) {
        const treeGenerator = generateTree(state);
        let nextTree = treeGenerator.next();
        while (!nextTree.done) {
            nextTree = treeGenerator.next();
        }
        return nextTree.value;
    }
    GameTree.generateWholeTree = generateWholeTree;
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
    function queryState(state, actions) {
        let currState = state;
        let index = 0;
        for (let action of actions) {
            const nextState = action(currState);
            const currStateChildren = generateChildren(currState);
            // is any child state of currStateChildren equal to the nextState
            const isNextStateWellDefined = isStateWithinChildren(currStateChildren, nextState);
            if (!isNextStateWellDefined) {
                return index;
            }
            currState = nextState;
            index++;
        }
        return currState;
    }
    GameTree.queryState = queryState;
    function isStateWithinChildren(children, stateToFind) {
        return ArrayUtils_1.orMap(children, ([action, move]) => {
            return State_1.State.areGameStatesEqual(move.state, stateToFind);
        });
    }
    GameTree.isStateWithinChildren = isStateWithinChildren;
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
    function applyFunctionToChildren(state, combinator, baseValue) {
        const children = generateChildren(state);
        let newBase = combinator(state, baseValue);
        children.forEach(([action, game]) => {
            newBase = applyFunctionToChildren(game.state, combinator, newBase);
        });
        return newBase;
    }
    GameTree.applyFunctionToChildren = applyFunctionToChildren;
    /**
     * Applies a given function to all of the actions reachable from the given state
     * Supplied with a max depth to search so the user does not have to traverse through the
     * entire tree
     *
     * @param tuple The action game tuple at the level of the tree
     * @param combinator the function to take the array of children and combine to one value
     * @param maxDepth how many levels down the tree the recursion will go
     */
    function applyCombinatorToChildren(tuple, combinator, maxDepth) {
        const children = generateChildren(tuple[1].state);
        // if we have reached the end of allowed depth, return the node with no more children
        if (maxDepth === 0) {
            return combinator(tuple, []);
        }
        // else we recur and minus 1 from the depth
        const childrenValues = children.map((actionTuple) => {
            return applyCombinatorToChildren(actionTuple, combinator, maxDepth - 1);
        });
        return combinator(tuple, childrenValues);
    }
    GameTree.applyCombinatorToChildren = applyCombinatorToChildren;
})(GameTree = exports.GameTree || (exports.GameTree = {}));
