"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("./Board");
const State_1 = require("./State");
const NumberUtils_1 = require("../Utils/NumberUtils");
const Space_1 = require("./Space");
const Position_1 = require("./Position");
/**
 * A Namespace to group functions related to moves
 */
var Moves;
(function (Moves) {
    /**
     * Checks if two moves are equal
     * @param move1
     * @param move2
     * @returns { Boolean } whether the two moves are equal
     */
    function areMovesEqual(move1, move2) {
        return Position_1.Position.arePositionsEqual(move1.from, move2.from)
            && Position_1.Position.arePositionsEqual(move1.to, move2.to);
    }
    Moves.areMovesEqual = areMovesEqual;
    /**
     * Get the positions of every tile that can be moved to from the current position
     *
     * @param position the position to be moved from
     * @param state the state
     * @return a list of positions
     */
    function getAllDestinations(position, state) {
        let allDestinations = [];
        return allDestinations.concat(...getAllDestinationsGroupedByDirection(position, state));
    }
    Moves.getAllDestinations = getAllDestinations;
    /**
     * Get the positions of every tile that can be moved to from the current position
     * Grouped by direction of movement
     *
     * @param position the position to be moved from
     * @param state the state
     * @return a list of positions
     */
    function getAllDestinationsGroupedByDirection(position, state) {
        Board_1.Board.validateTile(state.board, position);
        return [
            getAllDirectionHelper(position, state, getUp),
            getAllDirectionHelper(position, state, getDiagonalLeftUp),
            getAllDirectionHelper(position, state, getDiagonalRightUp),
            getAllDirectionHelper(position, state, getDiagonalLeftDown),
            getAllDirectionHelper(position, state, getDiagonalRightDown),
            getAllDirectionHelper(position, state, getDown)
        ];
    }
    Moves.getAllDestinationsGroupedByDirection = getAllDestinationsGroupedByDirection;
    /**
     * Gets all of the positions of tiles that are not blocked by other penguins
     * using the given direction function
     *
     * @param position the position to be moved from
     * @param state the state
     * @param getDirection Get tile position in a certain direction or {} if no tile is at that position
     */
    function getAllDirectionHelper(position, state, getDirection) {
        const board = state.board;
        let positionArray = [];
        let nextPosition = getDirection(position, board);
        while (nextPosition != null && State_1.State.getPenguinAtPosition(state, nextPosition) === null) {
            positionArray.push(nextPosition);
            nextPosition = getDirection(nextPosition, board);
        }
        return positionArray;
    }
    Moves.getAllDirectionHelper = getAllDirectionHelper;
    /**
     *  Get tile position diagonally down to the right.
     *
     *  If the tile is valid then return it's position, else return empty object
     *
     * @param position the position to be moved from
     * @param board the board
     * @return either a position or an empty object
     */
    function getDiagonalRightDown(position, board) {
        return getDiagonal(position, board, false, true);
    }
    Moves.getDiagonalRightDown = getDiagonalRightDown;
    /**
     *  Get tile position diagonally down to the left.
     *
     *  If the tile is valid then return it's position, else return empty object
     *
     * @param position the position to be moved from
     * @param board the board
     * @return either a position or an empty object
     */
    function getDiagonalLeftDown(position, board) {
        return getDiagonal(position, board, true, true);
    }
    Moves.getDiagonalLeftDown = getDiagonalLeftDown;
    /**
     *  Get tile position diagonally up to the right.
     *
     *  If the tile is valid then return it's position, else return empty object
     *
     * @param position the position to be moved from
     * @param board the board
     * @return either a position or an empty object
     */
    function getDiagonalRightUp(position, board) {
        return getDiagonal(position, board, false, false);
    }
    Moves.getDiagonalRightUp = getDiagonalRightUp;
    /**
     *  Get tile position diagonally up to the left.
     *
     *  If the tile is valid then return it's position, else return empty object
     *
     * @param position the position to be moved from
     * @param board the board
     * @return either a position or an empty object
     */
    function getDiagonalLeftUp(position, board) {
        return getDiagonal(position, board, true, false);
    }
    Moves.getDiagonalLeftUp = getDiagonalLeftUp;
    /**
     *  Get tile position vertically above the given tile
     *
     *  If the tile is valid then return it's position, else return empty object
     *
     * @param position the position to be moved from
     * @param board the board
     * @return either a position or an empty object
     */
    function getUp(position, board) {
        return getTileAtCoordinate(position.row - 2, position.column, board);
    }
    Moves.getUp = getUp;
    /**
     *  Get tile position vertically below the given tile
     *
     *  If the tile is valid then return it's position, else return empty object
     *
     * @param position the position to be moved from
     * @param board the board
     * @return either a position or an empty object
     */
    function getDown(position, board) {
        return getTileAtCoordinate(position.row + 2, position.column, board);
    }
    Moves.getDown = getDown;
    /**
     * Abstracted function to get the tile in a diagonal direction from the current position
     * @param position the position to be moved from
     * @param board the board
     * @param left if true, the tile to the left, else the tile to the right
     * @param down if true, the tile downwards, else the tile upwards
     */
    function getDiagonal(position, board, left, down) {
        const newRow = down ? position.row + 1 : position.row - 1;
        let newCol = position.column;
        const evenRow = NumberUtils_1.isEven(position.row);
        if (evenRow && left) {
            newCol = newCol - 1;
        }
        else if (!evenRow && !left) {
            newCol = newCol + 1;
        }
        return getTileAtCoordinate(newRow, newCol, board);
    }
    /**
     * Return tile or lack there of at the given position
     * @param row the row of the new tile
     * @param column the column of the tile
     * @param board the board where the tile resides
     */
    function getTileAtCoordinate(row, column, board) {
        const isMoveValid = Position_1.Position.isValidPositionInRange(board.tiles.length, board.tiles[0].length, { row: row, column: column });
        if (isMoveValid) {
            const tileAtMove = !Space_1.Space.isHole(board.tiles[row][column]);
            return tileAtMove ? { row: row, column: column } : null;
        }
        return null;
    }
    /**
     * If several different actions can realize the same gain, the strategy moves the penguin
     * that has the lowest row number for the place from which the penguin is moved and,
     * within this row, the lowest column number. In case this still leaves the algorithm
     * with more than one choice, the process is repeated for the target field to which the
     * penguins will move. This process is gauranteed to land on one move because if two moves
     * are exactly equal then they are identical moves
     *
     * @param move1
     * @param move2
     * @param this is guaranteed to return a move (in the context of minimax) because
     * if both tie breaker to and from are false then the positions are exactly equal. Which is not possible
     * in a game tree
     */
    function moveTieBreaker(move1, move2) {
        if (move1 === undefined) {
            return move2;
        }
        if (move2 === undefined) {
            return move1;
        }
        const tieBreakerFrom = positionToMoveTieBreaker(move1, move2, move1.from, move2.from);
        const tieBreakerTo = positionToMoveTieBreaker(move1, move2, move1.to, move2.to);
        if (tieBreakerFrom) {
            return tieBreakerFrom;
        }
        return tieBreakerTo;
    }
    Moves.moveTieBreaker = moveTieBreaker;
    /**
     * Compares 2 positions and returns the move with the same number (1 or 2)
     * positions with the lowest row number and, within this row, the lowest column number.
     *
     * @param move1 the move to return if pos1 is smaller
     * @param move2 the move to return if pos 2 is smaller than pos 1
     * @param pos1 the first position
     * @param pos2 the second position
     */
    function positionToMoveTieBreaker(move1, move2, pos1, pos2) {
        if (pos1.row < pos2.row) {
            return move1;
        }
        if (pos1.row > pos2.row) {
            return move2;
        }
        if (pos1.column < pos2.column) {
            return move1;
        }
        if (pos1.column > pos2.column) {
            return move2;
        }
        return false;
    }
})(Moves = exports.Moves || (exports.Moves = {}));
