"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
var State_1 = require("../../Common/src/Model/State");
var Board_1 = require("../../Common/src/Model/Board");
var Moves_1 = require("../../Common/src/Model/Moves");
var GameTree_1 = require("../../Common/src/Model/GameTree");
/**
 * Represents a strategy for an ai player. The AI places penguins in a zig zag pattern (described below),
 * and uses a minimax algorithm to pick its moves.
 */
var Strategy;
(function (Strategy) {
    /**
     * Searches for the first available penguin position by zig zagging through rows and columns in the pattern
     * described below. 1 represents the first tile searched, 2 is the second, so on and so forth
     *
     *  _____         _____
       /     \       /     \
      /  1    \_____/   2   \_____
      \       /     \       /     \
       \_____/   3   \_____/  4    \
       /     \       /     \       /
      / 5     \_____/   6   \_____/
      \       /     \       /     \
       \_____/   7   \_____/  8    \
       /     \       /     \       /
      /  9    \_____/  10   \_____/
      \       /     \       /
       \_____/       \_____/
     *
     * @param state
     */
    function penguinPlacements(state) {
        var rows = Board_1.Board.getRows(state.board);
        var columns = Board_1.Board.getColumns(state.board);
        var position = { row: 0, column: 0 };
        while (!State_1.State.isValidPenguinPlacement(position, state)) {
            if (position.row >= rows || position.column >= columns) {
                throw new Error('No valid penguin placement available');
            }
            position = getNewPosition(position, columns);
        }
        return position;
    }
    Strategy.penguinPlacements = penguinPlacements;
    /**
     * Gets the next position to check in the zig zag pattern described in ascii art above
     *
     * @param position the previous position to be incremented
     * @param maxCols the number of columns in the board
     */
    function getNewPosition(position, maxCols) {
        if (position.column < maxCols - 1) {
            return { row: position.row, column: position.column + 1 };
        }
        else {
            return { row: position.row + 1, column: 0 };
        }
    }
    Strategy.getNewPosition = getNewPosition;
    /**
     * Gets the best move that a player can make on their turn according to minimax strategy
     *
     * INVARIANT: Must be called on a state in which the current player is able to make a move
     * @param state the state on which the move will be made
     * @param levels the number of turns that the move will take
     * @throws If no move is available in the given state
     */
    function minimaxMove(state, levels) {
        var playerIndex = state.playersTurn;
        var move = minimaxPath(state, levels, playerIndex).path[0];
        if (!move) {
            throw new Error('No move is available this turn');
        }
        else {
            return move;
        }
    }
    Strategy.minimaxMove = minimaxMove;
    /**
     * Gets the move for the current player that will lead to the highest score
     * a player can make after the @param levels turns have been played—assuming
     * that all opponents pick one of the moves that minimizes the current player’s gain
     *
     * INVARIANT: This returns a list of all moves best move for the player whose turn it currently is
     *
     * @param state the current state of the game
     * @param levels the number of player actions that have yet to be taken
     * @param playerIndex the index of the player for whom we are maximizing the score
     * @return the move with the best gain after n turns
     */
    function minimaxPath(state, levels, playerIndex) {
        var children = GameTree_1.GameTree.generateChildren(state);
        var houseTeam = state.penguinTeams[playerIndex];
        if (levels === 0 || children.length === 0) {
            return { scoreSoFar: houseTeam.score, path: [] };
        }
        var isHousePlayer = state.playersTurn === playerIndex;
        var initScore = isHousePlayer ? 0 : Number.POSITIVE_INFINITY;
        var currentBest = { scoreSoFar: initScore, path: [] };
        children.forEach(function (actionTuple) {
            var nextAction = actionTuple[0];
            var node = actionTuple[1];
            var childrenBestPath = minimaxPath(node.state, levels - 1, playerIndex);
            if (!nextAction) {
                childrenBestPath.path.splice(0, 0, false);
                currentBest = childrenBestPath;
            }
            if (isHousePlayer && childrenBestPath.scoreSoFar < currentBest.scoreSoFar
                || (!isHousePlayer && childrenBestPath.scoreSoFar > currentBest.scoreSoFar
                    || !nextAction)) {
                return;
            }
            var nextMove = nextAction;
            if (currentBest.scoreSoFar === childrenBestPath.scoreSoFar && childrenBestPath.path[0]) {
                var tieBreakMove = Moves_1.Moves.moveTieBreaker(nextMove, currentBest.path[0]);
                if (!tieBreakMove || !Moves_1.Moves.areMovesEqual(nextMove, tieBreakMove)) {
                    return;
                }
            }
            childrenBestPath.path.splice(0, 0, nextMove);
            currentBest = childrenBestPath;
        });
        return currentBest;
    }
    Strategy.minimaxPath = minimaxPath;
})(Strategy = exports.Strategy || (exports.Strategy = {}));
