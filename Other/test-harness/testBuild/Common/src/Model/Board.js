"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Space_1 = require("./Space");
const Position_1 = require("./Position");
const NumberUtils_1 = require("../Utils/NumberUtils");
const ArrayUtils_1 = require("../Utils/ArrayUtils");
// Grouping of relevant board types and functions
var Board;
(function (Board) {
    /**
     * Gets the tile on the board at the given positions
     * @throws TypeError if not given natural numbers
     * @throws RangeError if there is no tile at the given positions
     * @param board an array of tiles
     * @param position the position
     * @returns the tile at the given row and column
     */
    function getTile(board, position) {
        validateTile(board, position);
        return board.tiles[position.row][position.column];
    }
    Board.getTile = getTile;
    /**
     * Gets the number of fish on tile on the board at the given position
     * @throws TypeError if not given natural numbers
     * @throws RangeError if there is no tile at the given positions
     * @param board the board
     * @param position the position of the tile to get the fish for
     * @returns the fish at the given row and column
     */
    function getFishOnTile(board, position) {
        try {
            validateTile(board, position);
            return Space_1.Space.getFish(board.tiles[position.row][position.column]);
        }
        catch (_a) {
            return 0;
        }
    }
    Board.getFishOnTile = getFishOnTile;
    /**
     * Gets the number of rows in the given board
     * @param board the board from which to get rows
     * @return the number of rows in the board
     */
    function getRows(board) {
        return board.tiles.length;
    }
    Board.getRows = getRows;
    /**
     * Get the number of tiles per row (columns)
     * @param board the board to get the columns for
     * @return the number of columns in the board
     */
    function getColumns(board) {
        var _a;
        return _a = board.tiles[0].length, (_a !== null && _a !== void 0 ? _a : 0);
    }
    Board.getColumns = getColumns;
    /**
     * Removes a tile from the board
     *
     * @throws TypeError if not given natural numbers
     * @throws RangeError if there is no tile at the given positions
     * @param board the current board
     * @param position the position of the tile to be removed
     * @returns a new board with the tile removed
     */
    function removeTile(board, position) {
        validateTile(board, position);
        const newTiles = [...board.tiles];
        const newTileRow = Array.from(Object.create(board.tiles[position.row]));
        newTileRow[position.column] = {};
        newTiles[position.row] = newTileRow;
        return { tiles: newTiles };
    }
    Board.removeTile = removeTile;
    /**
     * Creates a copy of the given board to avoid mutation
     * @param board the board to copy
     * @return the copied board
     */
    function copyBoard(board) {
        return {
            tiles: [...board.tiles.map((row) => [...row])],
        };
    }
    Board.copyBoard = copyBoard;
    /**
     * Determines if the given boards are equal
     * @param board1 the first board
     * @param board2 the second board
     * @return true if equal, otherwise false
     */
    function areBoardsEqual(board1, board2) {
        return ArrayUtils_1.areArraysEqual(board1.tiles, board2.tiles, areRowsEqual);
    }
    Board.areBoardsEqual = areBoardsEqual;
    /**
     * Determines if the given rows are equal
     * @param row1 the first row
     * @param row2 the second row
     * @return true if equal, otherwise false
     */
    function areRowsEqual(row1, row2) {
        return ArrayUtils_1.areArraysEqual(row1, row2, Space_1.Space.areSpacesEqual);
    }
    /**
     * Creates a board that has holes in specific places and is set up with a
     * minimum number of 1-fish tiles
     *
     * @param holes locations of holes on the board
     * @param minimum1FishTiles minimum number of 1 fish tiles
     * @return a board that has holes where specified
     */
    function createBoardWithMinimum1FishTiles(holes, minimum1FishTiles) {
        const numberOfTotalTiles = holes.length + minimum1FishTiles;
        const squareRowsAndColumns = Math.ceil(Math.sqrt(numberOfTotalTiles));
        return createBoard(squareRowsAndColumns, squareRowsAndColumns, holes, 1, minimum1FishTiles);
    }
    Board.createBoardWithMinimum1FishTiles = createBoardWithMinimum1FishTiles;
    /**
     * creates a board that has the same number of fish on every tile and has no holes
     * @param numberOfTiles minimum number of tiles
     * @param fishPerTile number of fish on each tile
     */
    function createBoardNoHoles(numberOfTiles, fishPerTile) {
        NumberUtils_1.isPositiveInteger(numberOfTiles);
        const squareRowsAndColumns = Math.ceil(Math.sqrt(numberOfTiles));
        return {
            tiles: createActiveBoard(squareRowsAndColumns, squareRowsAndColumns, fishPerTile),
        };
    }
    Board.createBoardNoHoles = createBoardNoHoles;
    /**
     * Creates a board with a given number of rows and columns
     *
     * @param rows the number of rows in the board
     * @param columns the number of columns in the board
     * @param holes the list of locations of each of the hole tiles
     * @param fish the maximum number of fish that will appear on each active tile
     * @param minimumActiveTiles the minimum number of tiles with fish
     * @param areFishRandomized? If true, active tiles will have random number of fish between 1 and given fish
     * @throws TypeError if board size does not have positive rows and columns
     * @throws TypeError if fish is not a positive integer
     *
     */
    function createBoard(rows, columns, holes, fish, minimumActiveTiles, areFishRandomized) {
        validateArguments(rows, columns, fish, holes, minimumActiveTiles);
        const activeBoard = {
            tiles: createActiveBoard(rows, columns, fish, areFishRandomized),
        };
        return addHolesToBoard(activeBoard, holes);
    }
    Board.createBoard = createBoard;
    /**
     * Create board with with only tiles (no holes)
     * @param rows the number of rows to construct
     * @param columns the number of columns to construct
     * @param fish the maximum number of fish that will appear on each active tile
     * @param areFishRandomized If true, active tiles will have random number of fish between 1 and given fish
     */
    function createActiveBoard(rows, columns, fish, areFishRandomized) {
        let row;
        let board = [];
        for (row = 0; row < rows; row++) {
            board[row] = createActiveBoardRow(columns, fish, areFishRandomized);
        }
        return board;
    }
    /**
     * Create a single row of the active board
     * @param columns the number of columns to construct
     * @param fish the maximum number of fish that will appear on each active tile
     * @param areFishRandomized If true, active tiles will have random number of fish between 1 and given fish
     * @returns an array of ActiveTile with a fish amount
     */
    function createActiveBoardRow(columns, fish, areFishRandomized) {
        let column;
        const rowArray = [];
        for (column = 0; column < columns; column++) {
            rowArray[column] = { fish: numberOfFish(fish, areFishRandomized) };
        }
        return rowArray;
    }
    /**
     * The number of fish to be placed on a tile
     *
     * @param fish
     * @param areFishRandomized?
     * @returns if areFishRandomized is true, a positive integer between 1 and fish, otherwise, fish
     */
    function numberOfFish(fish, areFishRandomized) {
        if (areFishRandomized) {
            return Math.ceil(Math.random() * fish);
        }
        return fish;
    }
    /**
     * Add Empty spaces to the board as 'Holes'
     *
     * @param board a board with all active tiles
     * @param holes the positions to be replaced with holes
     */
    function addHolesToBoard(board, holes) {
        const newBoard = copyBoard(board);
        holes.forEach((posn) => {
            newBoard.tiles[posn.row][posn.column] = {};
        });
        return newBoard;
    }
    Board.addHolesToBoard = addHolesToBoard;
    /**
     * Ensures that the arguments for createBoard are acceptable numbers
     * also ensures that the
     * @param rows the number of rows in the board
     * @param columns the number of columns in the board
     * @param fish the maximum number of fish that will appear on each active tile
     * @param holes the holes to be placed on a board
     * @param minimumActiveTiles the minimum number of tiles with fish
     * @throws TypeError if board size does not have positive rows and columns
     * @throws TypeError if fish is not a positive integer
     * @thorws RangeError if the holes are not within the bounds of the board
     */
    function validateArguments(rows, columns, fish, holes, minimumActiveTiles) {
        validateNumberArguments(rows, columns, fish, minimumActiveTiles);
        validateHolePositions(rows, columns, holes);
        if (holes.length + minimumActiveTiles > rows * columns) {
            throw new RangeError(`Must have at least ${minimumActiveTiles} active tiles`);
        }
    }
    /**
     * Ensures that the number arguments for createBoard are acceptable
     * @param rows the number of rows in the board
     * @param columns the number of columns in the board
     * @param fish the maximum number of fish that will appear on each active tile
     * @param minimumActiveTiles the minimum number of tiles with fish
     * @throws TypeError if board size does not have positive rows and columns
     * @throws TypeError if fish is not a positive integer
     * @thorws TypeError if the minimum number of active tiles is too low
     */
    function validateNumberArguments(rows, columns, fish, minimumActiveTiles) {
        if (!NumberUtils_1.isPositiveInteger(rows) || !NumberUtils_1.isPositiveInteger(columns)) {
            throw new TypeError('Rows and Columns must be positive integers');
        }
        if (!NumberUtils_1.isPositiveInteger(fish)) {
            throw new TypeError('Fish Per Tile must be a positive integer');
        }
        if (!NumberUtils_1.isNaturalNumber(minimumActiveTiles)) {
            throw new TypeError('Minimum active tiles must be a natural number');
        }
    }
    /**
     * Ensures that the references tile is a valid one.
     * A tile is invalid if it is a Hole, if positions are not natural numbers, or if the row/col is out of range of the board.
     * @param board the board
     * @param position the position on the board
     * @throws Error if the tile at the given position is not an active tile
     */
    function validateTile(board, position) {
        if (!Position_1.Position.arePositionsNaturalNumbers(position)) {
            throw new TypeError('Rows and Columns must be natural numbers');
        }
        if (board.tiles[position.row] === undefined
            || board.tiles[position.row][position.column] === undefined) {
            throw new RangeError('No space at the given positions');
        }
        if (Space_1.Space.isHole(board.tiles[position.row][position.column])) {
            throw new Error('No active tile at the given positions');
        }
    }
    Board.validateTile = validateTile;
    /**
     * Validate hole positions are within the row and column range of the board
     *
     * @param rows the number of rows
     * @param columns the number of columns
     * @param holes the holes to be checked
     * @throws RangeError if any of the holes are outside the bounds of the board
     */
    function validateHolePositions(rows, columns, holes) {
        holes.forEach((hole) => {
            if (!Position_1.Position.isValidPositionInRange(rows, columns, hole)) {
                throw new RangeError('Holes must be within the range of the board');
            }
        });
    }
    Board.validateHolePositions = validateHolePositions;
})(Board = exports.Board || (exports.Board = {}));
