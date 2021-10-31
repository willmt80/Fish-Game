import { ArrayXY, Svg, Polygon, G } from '@svgdotjs/svg.js';

export const SIZE = 30;

/**
 * Draws the active tile in the window with its fish and penguin
 *
 * @param draw the SVG drawer
 * @param polygonOrientation the polygon orientation coordinates
 * @param fish The number of fish
 * @param tx the x translation
 * @param ty the y translation
 */
export const drawActiveTile = (
  draw: Svg,
  polygonOrientation: ArrayXY[],
  fish: number,
  penguinColor: string,
  tx: number,
  ty: number
): void => {
  draw.use(activeTilePolygon(draw, polygonOrientation)).translate(tx, ty);
  draw.use(drawFishGroup(draw, fish)).translate(tx, ty);
  //show that we can draw a penguin
  if (penguinColor !== '') {
    penguinPolygon(draw, penguinColor).translate(tx + SIZE / 2, ty + SIZE / 2);
  }
};

/**
 *  Draw a hole on the board
 *
 * @param draw the SVG drawer
 * @param polygonOrientation the polygon orientation coordinates
 */
export const drawHole = (
  draw: Svg,
  polygonOrientation: ArrayXY[],
  fish: number,
  penguinColor: string,
  tx: number,
  ty: number
): void => {
  draw.use(holePolygon(draw, polygonOrientation)).translate(tx, ty);
};

/**
 * Draw an active tile (with no fish)
 * @param draw the SVG drawer
 * @param polygonOrientation the polygon orientation coordinates
 */
export const activeTilePolygon = (
  draw: Svg,
  polygonOrientation: ArrayXY[]
): Polygon => {
  return (
    draw
      .symbol()
      // map the corners' positions to a string and create a polygon
      .polygon(polygonOrientation)
      .fill({ color: '#A5F2F3' })
      .stroke({ width: 1, color: '#999' })
  );
};

/**
 * Draw an hole
 * @param draw the SVG drawer
 * @param polygonOrientation the polygon orientation coordinates
 */
export const holePolygon = (
  draw: Svg,
  polygonOrientation: ArrayXY[]
): Polygon => {
  return draw
    .symbol()
    .polygon(polygonOrientation)
    .fill({ color: '#0077be' })
    .stroke({ width: 1, color: '#999' });
};

/**
 * Draw a group of fish
 * @param draw Svg drawer
 * @param fish number of fish to draw
 */
export const drawFishGroup = (draw: Svg, fish: number): G => {
  var fishGroup = draw.group();
  for (let i: number = 0; i < fish; i++) {
    const translateY = (i * SIZE) / 3 + 2;
    const translateX = SIZE / 3;
    fishGroup.add(fishPolygon(draw).translate(translateX, translateY));
  }
  return fishGroup;
};

/**
 * Draw a singular fish
 * @param draw Svg drawer
 */
export const fishPolygon = (draw: Svg): Polygon => {
  return draw
    .polygon(
      `0, ${(1 * SIZE) / 6} ${(2 * SIZE) / 3},${SIZE / 4} ${(5 * SIZE) / 6},${
        (7 * SIZE) / 40
      } ${SIZE},${SIZE / 4} ${SIZE},0 ${(5 * SIZE) / 6},${SIZE / 8} ${
        (2 * SIZE) / 3
      },0 0,${SIZE / 6}`
    )
    .fill({ color: '#990099' })
    .stroke({ width: 1, color: '#333' });
};

/**
 * Draw a singular penguin
 * @param draw Svg drawer
 * @param color the color of the penguin
 */
export const penguinPolygon = (draw: Svg, color: string): Polygon => {
  return draw
    .polygon(
      `0,${SIZE / 6} ${SIZE / 6},0 ${(SIZE * 3) / 6},0 ${(SIZE * 3) / 6},${
        SIZE / 6
      } ${(SIZE * 4) / 6},${(SIZE * 4) / 6} 0,${(SIZE * 4) / 6} ${SIZE / 6},${
        SIZE / 6
      }`
    )
    .fill({ color: color })
    .stroke({ width: 1, color: '#AAA' });
};
