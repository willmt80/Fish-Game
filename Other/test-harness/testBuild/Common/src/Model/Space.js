"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Grouping of relevant tile types and functions
var Space;
(function (Space) {
    function areSpacesEqual(space1, space2) {
        return getFish(space1) === getFish(space2);
    }
    Space.areSpacesEqual = areSpacesEqual;
    /**
     * Is the following Space a hole
     *
     * (there is no empty? in typescript)
     * @param space the space to check
     */
    function isHole(space) {
        return Object.keys(space).length === 0;
    }
    Space.isHole = isHole;
    /**
     * Determines if the given Space is a tile
     *
     * @param space the Space to check
     */
    function isActiveTile(space) {
        return space.fish !== undefined;
    }
    Space.isActiveTile = isActiveTile;
    /**
     * Gets the fish at the given space
     *
     * @param space the Space from which to get fish
     * @return the fish on the space if tile, 0 if hole
     */
    function getFish(space) {
        if (isActiveTile(space)) {
            return space.fish;
        }
        else {
            return 0;
        }
    }
    Space.getFish = getFish;
})(Space = exports.Space || (exports.Space = {}));
