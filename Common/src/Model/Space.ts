// Grouping of relevant tile types and functions
export namespace Space {
  // An empty space on the board
  export type Hole = {};

  // A tile that a player can move to or be on
  export type Tile = Hole & {
    // Fish is a positive integer that represents the number of fish on a tile
    fish: number;
  };

  // A space on the board
  export type Space = Hole | Tile;

  export function areSpacesEqual(space1: Space, space2: Space): boolean {
    return getFish(space1) === getFish(space2);
  }

  /**
   * Is the following Space a hole
   *
   * (there is no empty? in typescript)
   * @param space the space to check
   */
  export function isHole(space: Space): space is Hole {
    return Object.keys(space).length === 0;
  }


  /**
   * Determines if the given Space is a tile
   * 
   * @param space the Space to check
   */
  export function isActiveTile(space: Space): space is Tile {
    return (space as Tile).fish !== undefined;
  }

  /**
   * Gets the fish at the given space
   * 
   * @param space the Space from which to get fish
   * @return the fish on the space if tile, 0 if hole
   */
  export function getFish(space: Space): number {
    if (isActiveTile(space)) {
      return space.fish;
    } else {
      return 0;
    }
  }
}
