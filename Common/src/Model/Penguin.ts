import { GameColor } from './GameColor';
import { Position } from './Position';
import { State } from './State';
import { Moves } from './Moves';
import { orMap, areArraysEqual, andMap } from '../Utils/ArrayUtils';

export namespace Penguin {
  /**
   * A Penguin is a game piece with a position on the board
   *
   * (making its own object to allow multiple kinds of penguins in the future)
   */
  export type Penguin = {
    // a position is a position on the board with row and column natural numbers
    // within board size
    position: Position.position;
  };

  /**
   *  PenguinTeam is a grouping of penguins which are on the same team in a game
   */
  export type PenguinTeam = {
    // a color that acts as a key for a team
    // the hexadecimal value that will be used for rendering penguins
    color: GameColor;
    // a grouping of penguins representing the penguins belonging to one player
    // invariant: No two penguins on a team can be at the same position
    penguins: Penguin[];
    // a natural number representing the number of fish the penguin team has consumed
    score: number;
  };

  /**
   * Gets the current score of the penguinTeam
   * @param teams1
   */

  /**
   * Determines if the given PenguinTeam lists are equal
   * @param teams1 the first PenguinTeams
   * @param teams2 the second PenguinTeams
   * @return true if equal, false otherwise
   */
  export function arePenguinTeamArraysEqual(
    teams1: PenguinTeam[],
    teams2: PenguinTeam[]
  ): boolean {
    return areArraysEqual<PenguinTeam>(teams1, teams2, arePenguinTeamsEqual);
  }

  /**
   * Determines if the given penguinTeams are equal
   * @param team1 the first penguintTeam
   * @param team2 the second penguinTeam
   * @return true if equal, false otherwise
   */
  function arePenguinTeamsEqual(
    team1: PenguinTeam,
    team2: PenguinTeam
  ): boolean {
    return (
      areArraysEqual<Penguin>(
        Array.from(team1.penguins),
        Array.from(team2.penguins),
        arePenguinsEqual
      ) &&
      team1.score === team2.score &&
      team1.color === team2.color
    );
  }

  /**
   * Determines if the given penguins are equal
   * @param penguin1 the first penguin
   * @param penguin2 the second penguin
   * @return true if equal, false otherwise
   */
  function arePenguinsEqual(penguin1: Penguin, penguin2: Penguin): boolean {
    return Position.arePositionsEqual(penguin1.position, penguin2.position);
  }

  /**
   * adds a penguin to the given Penguins
   * @param penguins A list of penguin
   * @param position the position which a penguin will be given
   * @return The new Array of penguins
   */
  export function placePenguinTeamMember(
    penguins: Penguin[],
    position: Position.position
  ): Array<Penguin> {
    let newPenguins: Penguin[] = [...penguins, { position: position }];
    return newPenguins;
  }

  /**
   * Sets the position of the penguin to the given position
   * @param penguin The penguin
   * @param position the position that the penguin will get
   * @return A penguin with the new position
   */
  export function setPenguinPosition(
    penguin: Penguin.Penguin,
    position: Position.position
  ): Penguin.Penguin {
    return {
      position: position,
    } as Penguin.Penguin;
  }

  /**
   * Gets the PenguinTeam with the given color from a list of PenguinTeam
   * throws if no PenguinTeam has the given color
   * @param penguinTeams the Penguinteams to search
   * @param color the color
   */
  export function getTeamFromColor(
    penguinTeams: PenguinTeam[],
    color: GameColor
  ) {
    const found = penguinTeams.find((penguinTeam) => penguinTeam.color === color);
    if (found === undefined) {
      throw new Error('No PenguinTeam with the given color');
    }
  }

  /**
   * Get the penguin at the given position from penguinTeam or undefined if no penguin is found
   * @param penguinTeam The penguin team to check
   * @param position the position
   * @return Penguin if there is a penguin at the position otherwise null
   */
  export function getPenguinFromTeam(
    penguinTeam: PenguinTeam,
    position: Position.position
  ): Penguin | null {
    return penguinTeam.penguins.find((penguin) => 
      Position.arePositionsEqual(penguin.position, position)
    ) || null; //sets to null if no penguin is found
  }

  /**
   * Replace a penguin on a team (used to update penguin position)
   *
   * @param oldPenguinPosition where the penguin used to reside (used for identification)
   * @param newPenguin The penguin to be added to the penguinTeam
   * @param penguinTeam the team of penguins
   * @param addScore number to add to score
   * @return A penguinTeam with the updated penguin,
   * If no penguin at oldPenguinPosition, returns given penguinTeam
   */
  export function replacePenguin(
    oldPenguinPosition: Position.position,
    newPenguin: Penguin,
    penguinTeam: PenguinTeam,
    addScore: number
  ): PenguinTeam {
    const newPenguins: Penguin[] = penguinTeam.penguins.map((penguin) => {
      if (Position.arePositionsEqual(penguin.position, oldPenguinPosition)) {
        return newPenguin;
      }
      return penguin;
    });
    return {
      penguins: newPenguins,
      score: penguinTeam.score + addScore,
      color: penguinTeam.color,
    };
  }

  /**
   * Makes a copy of the penguinTeams to avoid mutation
   * @param penguinTeams the penguinTeams to copy
   */
  export function copyPenguinTeams(penguinTeams: PenguinTeam[]): PenguinTeam[] {
    return penguinTeams.map((team) => copyPenguinTeam(team));
  }

  function copyPenguinTeam(penguinTeam: PenguinTeam): PenguinTeam {
    return {
      score: penguinTeam.score,
      color: penguinTeam.color,
      penguins: penguinTeam.penguins.map((penguin) => copyPenguin(penguin)),
    };
  }

  function copyPenguin(penguin: Penguin): Penguin {
    return {
      position: Position.copyPosition(penguin.position),
    };
  }
}
