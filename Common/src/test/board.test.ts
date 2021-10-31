import { Board } from '../Model/Board';

const smallBoard: Board.Board = {
  tiles: [
    [{ fish: 2 }, { fish: 4 }],
    [{}, { fish: 1 }],
  ],
};

const boardWithNoTiles: Board.Board = {
  tiles: [],
};

test('test validateActivePosition', () => {
  expect(() =>
    Board.validateTile(smallBoard, { row: 1, column: 0 })
  ).toThrow(Error('No active tile at the given positions'));
  expect(() =>
    Board.validateTile(smallBoard, { row: 4, column: 0 })
  ).toThrow(RangeError('No space at the given positions'));

  expect(() =>
    Board.validateTile(smallBoard, { row: 0, column: 3 })
  ).toThrow(RangeError('No space at the given positions'));

  expect(() =>
    Board.validateTile(smallBoard, { row: -1, column: 0 })
  ).toThrow(TypeError('Rows and Columns must be natural numbers'));

  expect(() =>
    Board.validateTile(smallBoard, { row: 0, column: -1 })
  ).toThrow(TypeError('Rows and Columns must be natural numbers'));

  expect(() =>
    Board.validateTile(smallBoard, { row: 0, column: 0.5 })
  ).toThrow(TypeError('Rows and Columns must be natural numbers'));
});

test('test getTile from board', () => {
  expect(Board.getTile(smallBoard, { row: 0, column: 0 })).toStrictEqual({
    fish: 2,
  });

  expect(() => Board.getTile(smallBoard, { row: -1, column: 0 })).toThrow(
    TypeError('Rows and Columns must be natural numbers')
  );

  expect(() => Board.getTile(smallBoard, { row: 0, column: 0.5 })).toThrow(
    TypeError('Rows and Columns must be natural numbers')
  );

  expect(() => Board.getTile(smallBoard, { row: 0, column: 5 })).toThrow(
    RangeError('No space at the given positions')
  );

  expect(() => Board.getTile(smallBoard, { row: 4, column: 1 })).toThrow(
    RangeError('No space at the given positions')
  );

  expect(() => Board.getTile(boardWithNoTiles, { row: 0, column: 0 })).toThrow(
    RangeError('No space at the given positions')
  );
});

test('test removeTile', () => {
  expect(Board.removeTile(smallBoard, { row: 0, column: 0 })).toStrictEqual({
    tiles: [
      [{}, { fish: 4 }],
      [{}, { fish: 1 }],
    ],
  });
  expect(Board.removeTile(smallBoard, { row: 1, column: 1 })).toStrictEqual({
    tiles: [
      [{ fish: 2 }, { fish: 4 }],
      [{}, {}],
    ],
  });
  expect(() => Board.removeTile(smallBoard, { row: 1, column: 0 })).toThrow(
    Error('No active tile at the given positions')
  );
  expect(() => Board.removeTile(smallBoard, { row: 2, column: 2 })).toThrow(
    RangeError('No space at the given positions')
  );
  expect(() => Board.removeTile(smallBoard, { row: -1, column: 2 })).toThrow(
    TypeError('Rows and Columns must be natural numbers')
  );
});

test('test createBoard', () => {
  // tests for number exceptions
  expect(() => Board.createBoard(0, 1, [], 1, 1)).toThrow(
    TypeError('Rows and Columns must be positive integers')
  );
  expect(() => Board.createBoard(1, 0, [], 1, 1)).toThrow(
    TypeError('Rows and Columns must be positive integers')
  );
  expect(() => Board.createBoard(-1, 1, [], 1, 1)).toThrow(
    TypeError('Rows and Columns must be positive integers')
  );
  expect(() => Board.createBoard(0.5, 0.5, [], 1, 1)).toThrow(
    TypeError('Rows and Columns must be positive integers')
  );

  expect(() => Board.createBoard(1, 1, [], -1, -1)).toThrow(
    TypeError('Fish Per Tile must be a positive integer')
  );
  expect(() => Board.createBoard(1, 1, [], 0.5, 1)).toThrow(
    TypeError('Fish Per Tile must be a positive integer')
  );
  expect(() => Board.createBoard(1, 1, [], 1, 0.5)).toThrow(
    TypeError('Minimum active tiles must be a natural number')
  );
  expect(() => Board.createBoard(1, 1, [], 1, -3)).toThrow(
    TypeError('Minimum active tiles must be a natural number')
  );

  // tests for when holes cause exceptions
  expect(() => Board.createBoard(3, 3, [{ row: 1, column: 4 }], 2, 3)).toThrow(
    RangeError('Holes must be within the range of the board')
  );
  expect(() => Board.createBoard(3, 3, [{ row: 5, column: 1 }], 2, 3)).toThrow(
    RangeError('Holes must be within the range of the board')
  );
  expect(() => Board.createBoard(3, 3, [{ row: -1, column: 2 }], 2, 3)).toThrow(
    RangeError('Holes must be within the range of the board')
  );
  expect(() => Board.createBoard(3, 3, [{ row: 1, column: -4 }], 2, 3)).toThrow(
    RangeError('Holes must be within the range of the board')
  );

  // tests for when holes are > min active tiles

  expect(() => Board.createBoard(1, 1, [{ row: 0, column: 0 }], 1, 1)).toThrow(
    RangeError('Must have at least 1 active tiles')
  );

  // tests which pass
  expect(Board.createBoard(1, 1, [], 2, 1).tiles).toStrictEqual([
    [{ fish: 2 }],
  ]);
  expect(
    Board.createBoard(1, 2, [{ row: 0, column: 0 }], 4, 1).tiles
  ).toStrictEqual([[{}, { fish: 4 }]]);
  expect(
    Board.createBoard(
      2,
      2,
      [
        { row: 0, column: 1 },
        { row: 1, column: 0 },
      ],
      1,
      2
    ).tiles
  ).toStrictEqual([
    [{ fish: 1 }, {}],
    [{}, { fish: 1 }],
  ]);
});

test('test createBoardMinimum1FishTiles', () => {
  expect(Board.createBoardWithMinimum1FishTiles([], 4)).toStrictEqual({
    tiles: [
      [{ fish: 1 }, { fish: 1 }],
      [{ fish: 1 }, { fish: 1 }],
    ],
  });
  expect(Board.createBoardWithMinimum1FishTiles([], 4)).toStrictEqual({
    tiles: [
      [{ fish: 1 }, { fish: 1 }],
      [{ fish: 1 }, { fish: 1 }],
    ],
  });
  expect(
    Board.createBoardWithMinimum1FishTiles([{ row: 0, column: 0 }], 2)
  ).toStrictEqual({
    tiles: [
      [{}, { fish: 1 }],
      [{ fish: 1 }, { fish: 1 }],
    ],
  });
});

test('test createBoardNoHoles', () => {
  expect(Board.createBoardNoHoles(1, 3)).toStrictEqual({
    tiles: [[{ fish: 3 }]],
  });
  expect(Board.createBoardNoHoles(2, 2)).toStrictEqual({
    tiles: [
      [{ fish: 2 }, { fish: 2 }],
      [{ fish: 2 }, { fish: 2 }],
    ],
  });
});

test('test areBoardsEqual', () => {
  expect(
    Board.areBoardsEqual(smallBoard, {
      tiles: [
        [{ fish: 2 }, { fish: 4 }],
        [{}, { fish: 1 }],
      ],
    })
  ).toBe(true);

  expect(
    Board.areBoardsEqual(smallBoard, {
      tiles: [
        [{ fish: 3 }, { fish: 4 }],
        [{}, { fish: 1 }],
      ],
    })
  ).toBe(false);

  expect(
    Board.areBoardsEqual(smallBoard, {
      tiles: [[{ fish: 2 }, { fish: 4 }]],
    })
  ).toBe(false);

  expect(
    Board.areBoardsEqual(smallBoard, {
      tiles: [
        [{ fish: 2 }, { fish: 4 }],
        [{}, {}],
      ],
    })
  ).toBe(false);

  expect(
    Board.areBoardsEqual(smallBoard, {
      tiles: [
        [{ fish: 2 }, { fish: 4 }],
        [{}, { fish: 1 }],
        [{}, { fish: 1 }],
      ],
    })
  ).toBe(false);

  expect(
    Board.areBoardsEqual(smallBoard, {
      tiles: [],
    })
  ).toBe(false);
});
