"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Position_1 = require("./Position");
const ArrayUtils_1 = require("../Utils/ArrayUtils");
var Penguin;
(function (Penguin) {
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
    function arePenguinTeamArraysEqual(teams1, teams2) {
        return ArrayUtils_1.areArraysEqual(teams1, teams2, arePenguinTeamsEqual);
    }
    Penguin.arePenguinTeamArraysEqual = arePenguinTeamArraysEqual;
    /**
     * Determines if the given penguinTeams are equal
     * @param team1 the first penguintTeam
     * @param team2 the second penguinTeam
     * @return true if equal, false otherwise
     */
    function arePenguinTeamsEqual(team1, team2) {
        return (ArrayUtils_1.areArraysEqual(Array.from(team1.penguins), Array.from(team2.penguins), arePenguinsEqual) &&
            team1.score === team2.score &&
            team1.color === team2.color);
    }
    /**
     * Determines if the given penguins are equal
     * @param penguin1 the first penguin
     * @param penguin2 the second penguin
     * @return true if equal, false otherwise
     */
    function arePenguinsEqual(penguin1, penguin2) {
        return Position_1.Position.arePositionsEqual(penguin1.position, penguin2.position);
    }
    /**
     * adds a penguin to the given Penguins
     * @param penguins A list of penguin
     * @param position the position which a penguin will be given
     * @return The new Array of penguins
     */
    function placePenguinTeamMember(penguins, position) {
        let newPenguins = [...penguins, { position: position }];
        return newPenguins;
    }
    Penguin.placePenguinTeamMember = placePenguinTeamMember;
    /**
     * Sets the position of the penguin to the given position
     * @param penguin The penguin
     * @param position the position that the penguin will get
     * @return A penguin with the new position
     */
    function setPenguinPosition(penguin, position) {
        return {
            position: position,
        };
    }
    Penguin.setPenguinPosition = setPenguinPosition;
    /**
     * Gets the PenguinTeam with the given color from a list of PenguinTeam
     * throws if no PenguinTeam has the given color
     * @param penguinTeams the Penguinteams to search
     * @param color the color
     */
    function getTeamFromColor(penguinTeams, color) {
        const found = penguinTeams.find((penguinTeam) => penguinTeam.color === color);
        if (found === undefined) {
            throw new Error('No PenguinTeam with the given color');
        }
    }
    Penguin.getTeamFromColor = getTeamFromColor;
    /**
     * Get the penguin at the given position from penguinTeam or undefined if no penguin is found
     * @param penguinTeam The penguin team to check
     * @param position the position
     * @return Penguin if there is a penguin at the position otherwise null
     */
    function getPenguinFromTeam(penguinTeam, position) {
        return penguinTeam.penguins.find((penguin) => Position_1.Position.arePositionsEqual(penguin.position, position)) || null; //sets to null if no penguin is found
    }
    Penguin.getPenguinFromTeam = getPenguinFromTeam;
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
    function replacePenguin(oldPenguinPosition, newPenguin, penguinTeam, addScore) {
        const newPenguins = penguinTeam.penguins.map((penguin) => {
            if (Position_1.Position.arePositionsEqual(penguin.position, oldPenguinPosition)) {
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
    Penguin.replacePenguin = replacePenguin;
    /**
     * Makes a copy of the penguinTeams to avoid mutation
     * @param penguinTeams the penguinTeams to copy
     */
    function copyPenguinTeams(penguinTeams) {
        return penguinTeams.map((team) => copyPenguinTeam(team));
    }
    Penguin.copyPenguinTeams = copyPenguinTeams;
    function copyPenguinTeam(penguinTeam) {
        return {
            score: penguinTeam.score,
            color: penguinTeam.color,
            penguins: penguinTeam.penguins.map((penguin) => copyPenguin(penguin)),
        };
    }
    function copyPenguin(penguin) {
        return {
            position: Position_1.Position.copyPosition(penguin.position),
        };
    }
})(Penguin = exports.Penguin || (exports.Penguin = {}));
