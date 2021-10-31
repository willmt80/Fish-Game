import { HousePlayer } from "../../Player/src/Player";
import { Manager } from "../src/Manager";
import { PlayerInterface } from "../../Common/src/Interface/player-interface";
import { Board } from "../../Common/src/Model/Board";

describe("The Tournament Manager", () => {
  let housePlayer;
  let tenYearOldContestant: PlayerInterface.Player;
  let fifteenYearOldContestant: PlayerInterface.Player;
  let otherFifteenYearOldContestant: PlayerInterface.Player;
  let twentyYearOldContestant: PlayerInterface.Player;
  let otherTwentyYearOldContestant: PlayerInterface.Player;
  let thirtyYearOldContestant: PlayerInterface.Player;
  let otherThirtyYearOldContestant: PlayerInterface.Player;
  let fourtyYearOldContestant: PlayerInterface.Player;
  let fiftyYearOldContestant: PlayerInterface.Player;
  let fourByFourBoard: Board.Board;
  let threeByFourBoard: Board.Board;
  let flatBoard: Board.Board;

  // Setting the ages of the house players to not all be 20
  beforeEach(() => {
    housePlayer = HousePlayer;
    tenYearOldContestant = {
      ...housePlayer,
      age: 10,
      username: "ten",
      tournamentOver: (didIWin: boolean) => false,
    };
    fifteenYearOldContestant = {
      ...housePlayer,
      age: 15,
      username: "fifteen",
      tournamentOver: (didIWin: boolean) => {
        throw new Error("sore winner?");
      },
    };
    otherFifteenYearOldContestant = {
      ...housePlayer,
      age: 15,
      username: "other_fifteen",
    };
    twentyYearOldContestant = { ...housePlayer, age: 20, username: "twenty" };
    otherTwentyYearOldContestant = {
      ...housePlayer,
      age: 20,
      username: "other_twenty",
    };
    thirtyYearOldContestant = { ...housePlayer, age: 30, username: "thirty" };
    otherThirtyYearOldContestant = {
      ...housePlayer,
      age: 30,
      username: "other_thirty",
    };
    fourtyYearOldContestant = { ...housePlayer, age: 40, username: "fourty" };
    fiftyYearOldContestant = { ...housePlayer, age: 50, username: "fifty" };
    fourByFourBoard = {
      tiles: [
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
      ],
    };

    threeByFourBoard = {
      tiles: [
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
      ],
    };

    flatBoard = {
      tiles: [
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 2 }],
        [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 3 }, { fish: 2 }],
      ],
    };
  });

  test("play game successfully plays one game and returns the end game results", () => {
    const play2PlayerGame = Manager.playGame(
      [tenYearOldContestant, fifteenYearOldContestant],
      fourByFourBoard
    );

    play2PlayerGame.then((data) =>
      expect(data.winners).toStrictEqual([
        {
          player: tenYearOldContestant,
          score: 4,
        },
        {
          player: fifteenYearOldContestant,
          score: 4,
        },
      ])
    );

    const play3PlayerGame = Manager.playGame(
      [
        tenYearOldContestant,
        fifteenYearOldContestant,
        otherFifteenYearOldContestant,
      ],
      fourByFourBoard
    );

    play3PlayerGame.then((data) =>
      expect(data.winners).toStrictEqual([
        {
          player: tenYearOldContestant,
          score: 3,
        },
      ])
    );
  });

  test("play round successfully plays one round of games", () => {
    const play2PlayerRound = Manager.playRound(
      [tenYearOldContestant, fifteenYearOldContestant],
      fourByFourBoard
    );

    expect(play2PlayerRound).resolves.toStrictEqual({
      remainingPlayers: [tenYearOldContestant, fifteenYearOldContestant],
      losers: [],
    });

    const play9PlayerRound = Manager.playRound(
      [
        fiftyYearOldContestant,
        fourtyYearOldContestant,
        thirtyYearOldContestant,
        tenYearOldContestant,
        otherThirtyYearOldContestant,
        otherFifteenYearOldContestant,
        twentyYearOldContestant,
        fifteenYearOldContestant,
        otherTwentyYearOldContestant,
      ],
      flatBoard
    );

    play9PlayerRound.then((data) => {
      expect(data.remainingPlayers).toStrictEqual([
        fiftyYearOldContestant,
        otherTwentyYearOldContestant,
        otherThirtyYearOldContestant,
      ]);

      //next round
      const nextRound = Manager.playRound(data.remainingPlayers, flatBoard);

      nextRound.then((final) => {
        expect(final.remainingPlayers).toStrictEqual([fiftyYearOldContestant]);
      });
    });
  });

  test("test that runTournament runs a tournament and returns the correct winner(s)", () => {
    // tournament where first game has fewer players than the max # of players
    expect(
      Manager.runTournament(
        [tenYearOldContestant, fifteenYearOldContestant],
        fourByFourBoard
      )
    ).resolves.toStrictEqual({
      remainingPlayers: [tenYearOldContestant, fifteenYearOldContestant],
      losers: [],
    });

    // flat board where each game has a single winner
    const run9PlayerTournament = Manager.runTournament(
      [
        fiftyYearOldContestant,
        fourtyYearOldContestant,
        thirtyYearOldContestant,
        tenYearOldContestant,
        otherThirtyYearOldContestant,
        otherFifteenYearOldContestant,
        twentyYearOldContestant,
        fifteenYearOldContestant,
        otherTwentyYearOldContestant,
      ],
      flatBoard
    );

    run9PlayerTournament.then((data) => {
      expect(data.losers).toHaveLength(8);

      expect(data.remainingPlayers).toStrictEqual([fiftyYearOldContestant]);
    });

    // 4 by 4 board where each game is a tie
    const run8PlayerTournament = Manager.runTournament(
      [
        tenYearOldContestant,
        fiftyYearOldContestant,
        fourtyYearOldContestant,
        thirtyYearOldContestant,
        otherThirtyYearOldContestant,
        otherFifteenYearOldContestant,
        twentyYearOldContestant,
        fifteenYearOldContestant,
      ],
      threeByFourBoard
    );

    expect(run8PlayerTournament).resolves.toStrictEqual({
      remainingPlayers: [
        tenYearOldContestant,
        thirtyYearOldContestant,
        fourtyYearOldContestant,
        fiftyYearOldContestant,
        fifteenYearOldContestant,
        otherFifteenYearOldContestant,
        twentyYearOldContestant,
        otherThirtyYearOldContestant,
      ],
      losers: [],
    });
  });

  test("test runTournamentWithResults", () => {

    const fourGoodContestants = [
      twentyYearOldContestant,
      thirtyYearOldContestant,
      fourtyYearOldContestant,
      fiftyYearOldContestant,
    ];

    expect(
      Manager.runTournamentWithResults(fourGoodContestants, fourByFourBoard)
    ).resolves.toStrictEqual([
      twentyYearOldContestant,
      thirtyYearOldContestant,
      fourtyYearOldContestant,
      fiftyYearOldContestant,
    ]);

    const twoGoodTwoBad = [
      thirtyYearOldContestant,
      tenYearOldContestant,
      fiftyYearOldContestant,
      fifteenYearOldContestant,
    ];

    expect(
      Manager.runTournamentWithResults(twoGoodTwoBad, fourByFourBoard)
    ).resolves.toStrictEqual([thirtyYearOldContestant, fiftyYearOldContestant]);
  });

  test("test that allocatePlayersToGames allocates correctly", () => {
    const threeContestants = [
      tenYearOldContestant,
      twentyYearOldContestant,
      fifteenYearOldContestant,
    ];
    const otherThreeContestants = [
      fiftyYearOldContestant,
      otherTwentyYearOldContestant,
      otherThirtyYearOldContestant,
    ];
    const fiveContestants = [
      tenYearOldContestant,
      fourtyYearOldContestant,
      twentyYearOldContestant,
      thirtyYearOldContestant,
      fifteenYearOldContestant,
    ];
    const nineContestants = [
      twentyYearOldContestant,
      twentyYearOldContestant,
      thirtyYearOldContestant,
      fifteenYearOldContestant,
      tenYearOldContestant,
      fourtyYearOldContestant,
      twentyYearOldContestant,
      thirtyYearOldContestant,
      fifteenYearOldContestant,
    ];

    expect(Manager.allocatePlayersToGames(threeContestants)).toHaveLength(1);
    expect(Manager.allocatePlayersToGames(threeContestants)).toEqual([
      [tenYearOldContestant, fifteenYearOldContestant, twentyYearOldContestant],
    ]);

    expect(Manager.allocatePlayersToGames(otherThreeContestants)).toHaveLength(
      1
    );
    expect(Manager.allocatePlayersToGames(otherThreeContestants)).toEqual([
      [
        otherTwentyYearOldContestant,
        otherThirtyYearOldContestant,
        fiftyYearOldContestant,
      ],
    ]);

    expect(Manager.allocatePlayersToGames(fiveContestants)).toHaveLength(2);
    expect(Manager.allocatePlayersToGames(fiveContestants)).toEqual([
      [tenYearOldContestant, fifteenYearOldContestant, twentyYearOldContestant],
      [thirtyYearOldContestant, fourtyYearOldContestant],
    ]);
    expect(Manager.allocatePlayersToGames(nineContestants)).toHaveLength(3);
    expect(Manager.allocatePlayersToGames(nineContestants)).toEqual([
      [
        fifteenYearOldContestant,
        twentyYearOldContestant,
        twentyYearOldContestant,
        thirtyYearOldContestant,
      ],
      [tenYearOldContestant, fifteenYearOldContestant, twentyYearOldContestant],
      [thirtyYearOldContestant, fourtyYearOldContestant],
    ]);
  });

  test("test that tellPlayersTheyWon correctly checks for player response", () => {
    const fourGoodContestants = [
      twentyYearOldContestant,
      thirtyYearOldContestant,
      fourtyYearOldContestant,
      fiftyYearOldContestant,
    ];

    expect(
      Manager.tellPlayersTheyWon(fourGoodContestants)
    ).resolves.toStrictEqual({
      remainingPlayers: [
        twentyYearOldContestant,
        thirtyYearOldContestant,
        fourtyYearOldContestant,
        fiftyYearOldContestant,
      ],
      losers: [],
    });

    const twoGoodTwoBad = [
      thirtyYearOldContestant,
      tenYearOldContestant,
      fiftyYearOldContestant,
      fifteenYearOldContestant,
    ];

    expect(
      Manager.tellPlayersTheyWon(twoGoodTwoBad)
    ).resolves.toStrictEqual({
      remainingPlayers: [thirtyYearOldContestant, fiftyYearOldContestant],
      losers: [tenYearOldContestant, fifteenYearOldContestant],
    });
  });

  test("test that arePlayerArraysTheSame correctly determines that arrays have the same items", () => {
    const threeContestantsAscending = [
      tenYearOldContestant,
      fifteenYearOldContestant,
      twentyYearOldContestant,
    ];
    const threeContestantsDescending = [
      twentyYearOldContestant,
      fifteenYearOldContestant,
      tenYearOldContestant,
    ];
    const threeContestantsDifferentName = [
      tenYearOldContestant,
      otherFifteenYearOldContestant,
      twentyYearOldContestant,
    ];
    const fourContestants = [
      tenYearOldContestant,
      fifteenYearOldContestant,
      twentyYearOldContestant,
      thirtyYearOldContestant,
    ];

    expect(
      Manager.arePlayerArraysTheSame(
        threeContestantsAscending,
        threeContestantsAscending
      )
    ).toBe(true);
    expect(
      Manager.arePlayerArraysTheSame(
        threeContestantsAscending,
        threeContestantsDescending
      )
    ).toBe(true);
    expect(
      Manager.arePlayerArraysTheSame(
        threeContestantsAscending,
        threeContestantsDifferentName
      )
    ).toBe(false);
    expect(
      Manager.arePlayerArraysTheSame(threeContestantsAscending, fourContestants)
    ).toBe(false);
  });
});
