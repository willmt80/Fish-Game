# Overview

This project is a tournament system for the game "hey that's my fish". The game consists of 2-4 players moving their pieces, which are represented by penguins, around a hexagonal board. The tiles on this board have various amounts of fish. The goal of the game is to get as many fish as possible.

The tournament system allows many people to enter a tournament (for a fee) with their age and an AI player which will make moves. We will develop out own AI as well in the hope of defeating the player's AI and taking all of their money.

Our board representation:

```

      _____         _____
     /     \       /     \
    /  0, 0 \_____/ 0, 1  \_____
    \       /     \       /     \
     \_____/ 1 ,0  \_____/  1, 1 \
     /     \       /     \       /
    / 2, 0  \_____/ 2 , 1 \_____/
    \       /     \       /     \
     \_____/ 3, 0  \_____/  3,1  \
     /     \       /     \       /
    /  4,0  \_____/  4,1  \_____/
    \       /     \       /
     \_____/       \_____/
```

## Running tests

Make sure you have node 10 enabled. You can use scl enable rh-nodejs10 bash to do so. Or add source /opt/rh/rh-nodejs10/enable to the end of our .bash_profile

### Unit Tests

First run `make`. Run `./xtest` in the command line. Alternatively run `npm run test` from the Common Directory and `npm run test` from the Player Directory

### XBoard Integration Tests

Navigate to the repo level directory 3, run `make`. Then run `./xboard`
Input should be a Board-Posn.

```
    Board-Posn is
      { "position" : Position,
        "board" : Board}

    Board is a JSON array of JSON arrays where each element is either 0 or a number between 1 and 5.
    The size of the board may not exceed a total of 25 tiles.
    INTERPRETATION A 0 denotes a hole in the board configuration.
    All other numbers specify the number of fish displayed on the tile.

    Position is a JSON array that contains two natural numbers: [board-row,board-column].
    INTERPRETATION The position uses the computer graphics coordinate system meaning the Y axis points downwards.
    The position refers to a tile with at least one fish on it.
```

### XState integration tests

Navigate to the repo level directory 4, run `make`. Then run
`./xstate`

Input should be a State.

```
    State is
      { "players" : Player*,
        "board" : Board }

    Player* is
      [Player, ..., Player]

    INTERPRETATION The array lists all players and specifies the order in which they take turns.

    Player is
      { "color" : Color,
        "score" : Natural,
        "places" : [Position, ..., Position] }

    INTERPRETATION The color identifies a player's penguins on the board, the score represents how many fish the player has collected so far, and the last field shows where the player's penguins are located.

    CONSTRAINT All penguins must occupy distinct tiles on the board.
```

### XTree integration tests

Navigate to the repo level directory 5, run `make`. Then run
`./xtree`

Input should be a Move Response Query.

```
    Move-Response-Query is

     { "state" : State,

       "from" : Position,

       "to" : Position }

    INTERPRETATION The object describes the current state and the move that the

    currently active player picked. CONSTRAINT The object is invalid, if the

    specified move is illegal in the given state.
```

### XRef integration tests

Navigate to the repo level directory 8, run `make`. Then run
`./xref`

Input should be a Game Description.

```
    Game Description is

      { "row"     : Natural in [2,5],

        "column"  : Natural in [2,5],

        "players" : [[String, D], ,,,, [String, D]]

        "fish"    : Natural in [1,5] }

    The "players" field specifies an array whose length is in [2,4]. The pairwise distinct strings in this array are non-empty and consist of at most 12 alphabetical ASCII characters. Finally, the player specifications in this array are arranged in ascending order of age
```

# Running the game

First run `make` then from the Common directory run `./fish`

# Folder Structure

## Admin

### src

Contains code for running of games and tournaments

**Manager.ts**

Contains functions which run a tournament of games of fish from beginning to end including running multiple games in a round, allocating players to games, and determining winners

**Referee.ts**

Contains functions which run a game of fish from beginning to end including making moves selected by players, kicking out players who violate the rules, and determining the winners

#### Interface

**manager-interface**

Contains type with the functions that are necessary to implement to create a tournament management system

### tests

contains our jest test scripts for files in Admin/src

## Common

### src

Contains the code to be shared by players and the referee

**App.tsx**

Creates the board and handles the drawing of the board, fish, and players to the browser DOM

**index.tsx**

Is the starting point for the application, renders the app

**react-app-end**, **serviceWorker**, **setupTests**

React files which support typescript, performance, and testing DOM elements (Latter 2 not currently used but may be necessary depending on future milestones).

#### Interface

**player-interface**

Contains methods for communication between the players and the referee

#### Model

Contains files for the data and the current state of the game

**Board.ts**

The board data definition and functions which create boards with different parameters

**GameColor.ts**

The colors that penguins can have

**GameTree.ts**

The data definitions and functions for all of the possible sequences of moves and resulting GameStates that can occur from the start of a game of Fish

**Moves.ts**

Functions which determine which moves are available

**Penguin.ts**

Data definitions and functions for the game pieces and for groups of pieces with the same color that represent a single player's status in the game;
Where their pieces are places and what their current score is

**Position.ts**

Data definitions and functions for a (row, column) position for the board

**Space.ts**

Data definitions and functions for an individual tiles and holes on the board

**State.ts**

Representation of the game at the current moment. What the board looks like, where the penguins are located, and what the scores are

#### Utils

contains the general utility functions that are used throughout the application

**ArrayUtils.ts**

functions for Arrays used throughout the application

**ConvertBoard.ts**

functions for converting rows and columns from the model board to the x and y positions on ViewBoard

**NumberUtils.ts**

functions to enforce correct number inputs which are widely used in the application like natural numbers and integers

#### View

Contains the elements to be rendered on screen and a version of the board to be rendered

**DrawElements.ts**

Draws the different kinds of tiles from board Contains the polygons for fish and penguins

**ViewBoard.ts**

Data definitions and functions related to the representation of the board used by view (to view action from model mutation)

### build

Contains the Javascript files which were created upon running `npm run build`. The .ts files are converted to .js files.

#### test

contains our jest test scripts

## Other

### test-harness

test harness contains the code to make the test harness in 3/ run. It additionally contains built code from transpiling typescript within test-harness/testBuild.

It additionally contains a tsconfig.json file to configure the transpiling correctly. This was done because we had to integrate our typescript code for the test harness with the code for the Fish Project, but could not reference the code outside of folder.

**boardTest.ts**

Script which contains functions which interpret well-formed board and position inputs which we transform to our own data representations and use test functionality.

**conversionUtils**

Contains utility functions for converting between JSON representations and our data representations.

**parseJson.ts**

Contains function to parse JSON inputs to tests.

**refereeTest.ts**

Script which contains function that interpret well-formed
game description JSON inputs which we transform into our own data representation to test Referee functionality

**stateTest.ts**

Script which contains functions that interpret well-formed
game state JSON inputs which we transform into our own data representation to test State functionality.

**strategyTest**

Script with functions that interpret well-formed game state and depth JSON inputs which we transform into our interpretation to test our "best" strategy for making turns in a game of fish

**treeTest.ts**

Script with functions that interpret well-formed game tree JSON inputs
which we transform into our own interpretation to test functionality of GameTree creation and
application of functions over the tree's children

## Player

Contains functionality related to players of the game.

### src

**Strategy.ts**
Contains the functionality for the player strategy

### tests

Contains tests related to players
