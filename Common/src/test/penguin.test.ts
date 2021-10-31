import { GameColor } from '../Model/GameColor';
import { Penguin } from '../Model/Penguin';

const smallTeams: Penguin.PenguinTeam[] = [
  {
    penguins: [
      { position: { row: 1, column: 1 } },
      { position: { row: 2, column: 1 } },
    ],
    score: 0,
    color: GameColor.BLACK,
  },
  {
    penguins: [
      { position: { row: 0, column: 0 } },
      { position: { row: 1, column: 0 } },
    ],
    score: 0,
    color: GameColor.BROWN,
  },
];

test('test for placePenguinTeamMember', () => {
  expect(
    Penguin.placePenguinTeamMember([], { row: 1, column: 1 })
  ).toStrictEqual([{ position: { row: 1, column: 1 } }]);

  expect(
    Penguin.placePenguinTeamMember([{ position: { row: 1, column: 1 } }], {
      row: 1,
      column: 2,
    })
  ).toStrictEqual([
    { position: { row: 1, column: 1 } },
    { position: { row: 1, column: 2 } },
  ]);

  // expect(() =>
  //   Penguin.placePenguinTeamMember([], { row: 1, column: 2 })
  // ).toThrow(Error('No more penguins to place'));

  // expect(() =>
  //   Penguin.placePenguinTeamMember(
  //     [
  //       { color: GameColor.RED, position: { row: 1, column: 1 } },
  //       { color: GameColor.RED, position: { row: 1, column: 2 } },
  //     ],
  //     { row: 2, column: 1 }
  //   )
  // ).toThrow(Error('No more penguins to place'));
});

test('test for setPenguinPosition', () => {
  // expect(
  //   Penguin.setPenguinPosition(
  //     { color: GameColor.BLACK },
  //     { row: 1, column: 2 }
  //   )
  // ).toStrictEqual({ color: GameColor.BLACK, position: { row: 1, column: 2 } });

  expect(
    Penguin.setPenguinPosition(
      { position: { row: 0, column: 0 } },
      { row: 1, column: 2 }
    )
  ).toStrictEqual({ position: { row: 1, column: 2 } });
});

test('test for replacePenguin', () => {
  const smallTeam: Penguin.PenguinTeam = {
    penguins: [
      { position: { row: 1, column: 1 } },
      { position: { row: 2, column: 1 } },
    ],
    score: 0,
    color: GameColor.BLACK,
  };

  //console.log(smallTeam.penguins.has({ position: { row: 1, column: 1 } }));

  expect(
    Penguin.replacePenguin(
      { row: 2, column: 1 },
      { position: { row: 0, column: 0 } },
      smallTeam,
      1
    )
  ).toStrictEqual({
    penguins: [
      { position: { row: 1, column: 1 } },
      { position: { row: 0, column: 0 } },
    ],
    score: 1,
    color: GameColor.BLACK,
  });

  expect(
    Penguin.replacePenguin(
      { row: 1, column: 1 },
      {
        position: { row: 0, column: 0 },
      },
      smallTeam,
      2
    )
  ).toStrictEqual({
    penguins: [
      { position: { row: 0, column: 0 } },
      { position: { row: 2, column: 1 } },
    ],
    score: 2,
    color: GameColor.BLACK,
  });
});

test('test for arePenguinTeamRecordsEqual', () => {
  expect(
    Penguin.arePenguinTeamArraysEqual(smallTeams, [
      {
        penguins: [
          { position: { row: 1, column: 1 } },
          { position: { row: 2, column: 1 } },
        ],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [
          { position: { row: 0, column: 0 } },
          { position: { row: 1, column: 0 } },
        ],
        score: 0,
        color: GameColor.BROWN,
      },
    ])
  ).toBe(true);

  expect(
    Penguin.arePenguinTeamArraysEqual(smallTeams, [
      {
        penguins: [
          { position: { row: 1, column: 1 } },
          { position: { row: 2, column: 1 } },
        ],
        score: 0,
        color: GameColor.BLACK,
      },
    ])
  ).toBe(false);

  expect(
    Penguin.arePenguinTeamArraysEqual(smallTeams, [
      {
        penguins: [
          { position: { row: 1, column: 1 } },
          { position: { row: 2, column: 1 } },
        ],
        score: 0,
        color: GameColor.BROWN,
      },
      {
        penguins: [
          { position: { row: 0, column: 0 } },
          { position: { row: 1, column: 0 } },
        ],
        score: 0,
        color: GameColor.BLACK,
      },
    ])
  ).toBe(false);

  expect(
    Penguin.arePenguinTeamArraysEqual(smallTeams, [
      {
        penguins: [
          { position: { row: 1, column: 1 } },
          { position: { row: 2, column: 1 } },
        ],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [{ position: { row: 0, column: 0 } }],
        score: 0,
        color: GameColor.BROWN,
      },
    ])
  ).toBe(false);

  expect(
    Penguin.arePenguinTeamArraysEqual(smallTeams, [
      {
        penguins: [
          { position: { row: 1, column: 1 } },
          { position: { row: 2, column: 2 } },
        ],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [
          { position: { row: 0, column: 0 } },
          { position: { row: 1, column: 0 } },
        ],
        score: 0,
        color: GameColor.BROWN,
      },
    ])
  ).toBe(false);

  expect(
    Penguin.arePenguinTeamArraysEqual(smallTeams, [
      {
        penguins: [
          { position: { row: 1, column: 1 } },
          { position: { row: 2, column: 1 } },
        ],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [
          { position: { row: 0, column: 0 } },
          { position: { row: 1, column: 0 } },
        ],
        score: 1,
        color: GameColor.BROWN,
      },
    ])
  ).toBe(false);
});
