import React from 'react';
import { State } from './Model/State';
import { ViewBoard } from './View/ViewBoard';
import * as HoneyComb from 'honeycomb-grid';
import { SVG, ArrayXY, Svg, Polygon } from '@svgdotjs/svg.js';
import { drawActiveTile, drawHole, SIZE } from './View/DrawElements';
import { GameColor } from './Model/GameColor';

/**
 * Extended Type for HoneyComb Grid
 *
 * Note: This allows us to dynamically draw
 */
type GridType = HoneyComb.GridFactory<
  HoneyComb.Hex<fishHex>
>;

/**
 * A series of possible attributes that a Space can have
 * toDraw is a function with instructions of how to draw this space as hexagon on the board
 */
type fishHex = {
  x: number;
  y: number;
  size: number;
  orientation: 'flat';
  toDraw: (
    draw: Svg,
    polyGone: ArrayXY[],
    fish: number,
    penguinColor: string,
    x: number,
    y: number
  ) => void;
  fish: number;
  penguinColor: string,
}

// Example renderings because app is not yet fully integrated

let sampleGame = State.createGameState([GameColor.BLACK, GameColor.RED], 4, 3);

sampleGame = State.placePenguin(
  0,
  { row: 1, column: 1 },
  sampleGame
);

sampleGame = State.placePenguin(
  1,
  { row: 1, column: 2 },
  sampleGame
);

const hexList = ViewBoard.convertGameToViewSpaceList(sampleGame);

/**
 * Acts as an empty parameter for Hex
 *
 * @param draw The SVG drawer
 * @param hexagonStartingPositions The upper corners of the polygons to be rendered
 * @param fish the number of fish
 * @param x the x position in the viewBoard
 * @param y the y position in the Viewboard
 */
const toDraw = (
  draw: Svg,
  hexagonStartingPositions: ArrayXY[],
  fish: number,
  penguinColor: string,
  x: number,
  y: number,
): void => { };

/**
 * An Extension of a HoneyComb Hex Representation containing x and y coordinate,
 * orientation, tile size, a to draw, a number of fish, and a penguinColor
 */
const Hex = HoneyComb.extendHex({
  x: 0,
  y: 0,
  size: SIZE,
  orientation: 'flat',
  toDraw: toDraw,
  fish: 0,
  penguinColor: '',
});

const normalHex = HoneyComb.extendHex({
  size: SIZE,
  orientation: 'flat',
});

function App() {
  const draw = SVG().addTo('body').size('100vw', '100vh');

  const Grid = HoneyComb.defineGrid(Hex);
  // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
  const corners = Hex().corners();

  const hexagonStartingPositions: ArrayXY[] = corners.map(({ x, y }) => [x, y]);
  // an SVG symbol can be reused
  const hexSymbol = draw
    .symbol()
    // map the corners' positions to a string and create a polygon
    .polygon(hexagonStartingPositions)
    .fill('none')
    .stroke({ width: 1, color: '#999' });

  renderGrid(draw, Grid, hexSymbol, hexagonStartingPositions);


  //TODO: actual logic
  return <body></body>;
}

/**
 * Draws all of the hexagons on the grid
 *
 * @param draw the SVG drawer
 * @param Grid A factory for the hexagon type
 * @param hexSymbol the hexagon shape
 * @param polyGone x and y positions where each hexagon will be rendered
 */
const renderGrid = (
  draw: Svg,
  Grid: GridType,
  hexSymbol: Polygon,
  polyGone: ArrayXY[]
): void => {
  Grid(viewSpaceListToHexList(hexList)).forEach((hex: any) => {
    const { x, y } = normalHex(hex.x, hex.y).toPoint();
    // use hexSymbol and set its position for each hex
    draw.use(hexSymbol).translate(x, y);
    hex.toDraw(draw, polyGone, hex.fish, hex.penguinColor, x, y);
  });
};

/**
 * Convert the viewBoard hexList to list of Hex
 * @param spaceList the list of viewSpace from the viewBoard
 */
const viewSpaceListToHexList = (spaceList: ViewBoard.ViewSpaceList): HoneyComb.Hex<fishHex>[] => {
  return spaceList.map((space: ViewBoard.ViewSpace) => {
    return viewSpaceToHex(space);
  });
};

/**
 * Convert the ViewSpace to a Hex with appropriate drawing instructions
 * @param space the Viewspace to be converted
 */
const viewSpaceToHex = (space: ViewBoard.ViewSpace): HoneyComb.Hex<fishHex> => {
  let fish = 0;
  let drawer = drawHole;
  let color = '';
  // if active tile, setup data
  if (space.isTile) {
    fish = space.fish;
    drawer = drawActiveTile;
    if (space.penguin) {
      color = space.penguin;
    }
  }

  // return hexagon with desired properties
  return Hex(space.coord.x, space.coord.y, {
    size: SIZE,
    orientation: 'flat',
    toDraw: drawer,
    x: space.coord.x,
    y: space.coord.y,
    fish: fish,
    penguinColor: color,
  });
}

export default App;
