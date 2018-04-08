 export function randomInt(min, max) {
    return min + Math.floor(Math.random() * (Math.floor(max) - min));
  }
 export function setExits(map) {
    // tiles,directions
    console.log(map);
    //console.log(exit);
    let wallTile = { type: "wall", dark: "dark" };
    let exitTile = { type: "exit", dark: "dark" };
  
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map.length; j++) {
        let tiles = map[i][j].tiles;
        for (let x = 0; x < 2; x++) {
          let exit = map[i][j].exits[randomInt(0, map[i][j].exits.length)];
          map[i][j].exits.splice(map[i][j].exits.indexOf(exit), 1);
          for (let k = 0; k < 2; k++) {
            if (exit == "north") {
              // all rooms wil be 12 tiles long, unshift so tiles[[undeifined,exit,undefined][1,2,3][1,2,3]]
              for (let p = 0; p < tiles[k].length; p++) {
                tiles[k][p] = { type: "wall", dark: "dark" };
              }
  
              tiles[k][Math.floor(tiles[0].length / 2)] = {
                type: "exit",
                dark: "dark"
              };
              if (typeof map[i - 1] !== "undefined") {
                console.log(map[i - 1]);
                map[i - 1][j].tiles[tiles.length - 1 - k][
                  Math.floor(tiles[0].length / 2)
                ] = { type: "exit", dark: "dark" };
              }
            }
            if (exit == "south") {
              // all rooms wil be 12 tiles long, push so tiles[[1,2,3][1,2,3][undeifined,exit,undefined]]
              for (let p = 0; p < tiles[k].length; p++) {
                tiles[tiles.length - 1 - k][p] = { type: "wall", dark: "dark" };
              }
              tiles[tiles.length - 1 - k][Math.floor(tiles[0].length / 2)] = {
                type: "exit",
                dark: "dark"
              };
              if (typeof map[i + 1] !== "undefined") {
                map[i + 1][j].tiles[k][Math.floor(tiles[0].length / 2)] = {
                  type: "exit",
                  dark: "dark"
                };
              }
            }
            if (exit == "east") {
              for (let p = 0; p < tiles[k].length; p++) {
                tiles[p][tiles[0].length - 1 - k] = {
                  type: "wall",
                  dark: "dark"
                };
              }
              // all rooms wil be 12 tiles long, push so tiles[[1,2,3][1,2,3,exit,exit][1,2,3]]
              tiles[Math.floor(tiles.length / 2)][tiles[0].length - 1 - k] = {
                type: "exit",
                dark: "dark"
              };
              if (typeof map[i][j + 1] !== "undefined") {
                map[i][j + 1].tiles[Math.floor(tiles.length / 2)][k] = {
                  type: "exit",
                  dark: "dark"
                };
              }
            }
            if (exit == "west") {
              for (let p = 0; p < tiles[k].length; p++) {
                tiles[p][k] = { type: "wall", dark: "dark" };
              }
              // all rooms wil be 12 tiles long, push so tiles[[1,2,3][1,2,3,exit,exit][1,2,3]]
              tiles[Math.floor(tiles.length / 2)][k] = {
                type: "exit",
                dark: "dark"
              };
              if (typeof map[i][j - 1] !== "undefined") {
                map[i][j - 1].tiles[Math.floor(tiles.length / 2)][
                  tiles[0].length - 1 - k
                ] = { type: "exit", dark: "dark" };
              }
            }
          }
        }
      }
    }
  }
 export function setItemLocations(map, item, qty, limit) {
    // item should be item object/ limit is items per room,qty is # of items, if the total is greater than the capacity error checking
    if (qty > map.length * map[0].length * limit) {
      console.log(
        "quantity greater than room capacity increase your limit per room or reduce the quantity "
      );
      return;
    } else {
      let i = qty;
  
      while (i > 0) {
        let mapX = randomInt(0, map.length);
        let mapY = randomInt(0, map[0].length);
        let room = map[mapX][mapY];
        let locX = randomInt(0, room.tiles.length);
        let locY = randomInt(0, room.tiles[0].length);
        let location = room.tiles[locX][locY];
        if (location.type == "floor") {
          // console.log(location.type);
          if (Array.isArray(item)) {
            // console.log(i);
            item[i - 1].room = [mapX, mapY];
            item[i - 1].coord = [locX, locY];
            map[mapX][mapY].tiles[locX][locY] = item[i - 1];
            i--;
            room.limit++;
          } else {
            item.room = [mapX, mapY];
            item.coord = [locX, locY];
            map[mapX][mapY].tiles[locX][locY] = item;
            i--;
            room.limit++;
          }
  
          //  console.log(room);
        }
      }
    }
  }
  // should really pass floor parameters.
 export function createRoom(roomX, roomY, lvl) {
    let room = {
      tiles: [],
      limit: 0,
      size: [12, 12],
      wall: 2,
      exits: []
    };
  
    //if roomX>3 if (exit== 'north'){tile[randomInt(5,tile[0].length)][tile[0][0].length]={type: floor}}; if the exit is north pick a random location and add an extra tile in that direction. for max length while tile.length< max size continue to add floor tiles.
    //set floor tiles,
    let floor = { type: "floor", dark: "dark" };
    let wall = { type: "wall", dark: "dark" };
    for (let i = 0; i < room.size[0]; i++) {
      room.tiles.push([]);
      for (let j = 0; j < room.size[1]; j++) {
        if (
          i === 0 ||
          j === 0 ||
          i == room.size[0] - 1 ||
          j == room.size[0] - 1
        ) {
          room.tiles[i].push({ type: "wall", dark: "dark" });
        } else {
          room.tiles[i].push({ type: "floor", dark: "dark" });
        }
      }
    }
    // set items first before adding exits to avoid placing items on undefined values. since we aren't defining wall tiles.may need to setup in different phase.
    //setItemLocation(room.tiles,Monster(lvl),room.enemies);
    //setItemLocation(room.tiles,weapon(lvl),room.enemies);
    /*
    roomX,roomY
    0,0|0,1|0,2|0,3
    1,1|1,1|1,2|1,3
    2,2|2,1|2,2|2,3
    3,3|3,1|3,2|3,3
    */
    // create array of direction
  
    if (roomX > 0) {
      room.exits.push("north");
    }
    if (roomX < 3) {
      room.exits.push("south");
    }
    if (roomY > 0) {
      room.exits.push("west");
    }
    if (roomY < 3) {
      room.exits.push("east");
    }
  
    return room;
  }
  export function Monster(lvl) {
    let names = [
      "Bugbear",
      "Bugbear",
      "Troll",
      "Troll",
      "Giant Wasp",
      "Giant Wasp",
      "Giant Wasp",
      "Giant Wasp",
      "Golem",
      "Golem"
    ];
    this.type = "monster";
    this.dark = "dark";
    this.room;
    this.coord;
  
    this.name = names[randomInt(1, 10)];
    switch (this.name) {
      case "Bugbear":
        this.hp = 10 * lvl;
        this.damage = 3 * lvl;
        this.exp = 10 * lvl;
        break;
      case "Troll":
        this.hp = 6 * lvl;
        this.damage = 6 * lvl;
        this.exp = 15 * lvl;
        break;
      case "Giant Wasp":
        this.hp = 4 * lvl;
        this.damage = 2 * lvl;
        this.exp = 5 * lvl;
        break;
      case "Golem":
        this.hp = 15 * lvl;
        this.damage = 8 * lvl;
        this.exp = 20 * lvl;
    }
  }
 export function Weapon(lvl) {
    let weaponNames = ["sword", "axe", "brass knuckles"];
    this.dark = "dark";
    this.type = "weapon";
    switch (lvl) {
      case 1:
        this.name = "brass knuckles";
        this.damage = 6;
        break;
      case 2:
        this.name = "sword";
        this.damage = 12;
        break;
      case 3:
        this.name = "axe";
        this.damage = 20;
        break;
    }
  }
  
 export function Map() {
    // functional Class
    let map = [];
  
    for (let i = 0; i < 4; i++) {
      map.push([]);
      for (let j = 0; j < 4; j++) {
        map[i][j] = createRoom(i, j);
      }
    } // by closure we can just bind the current map to the function.
  
    setExits(map);
    return map;
  }
  
  export function lightControl(room, x, y) {
    for (let i = x - 2; i <= x + 2; i++) {
      for (let j = y - 2; j <= y + 2; j++) {
        if (room[i] && room[i][j]) {
          room[i][j].dark = "";
        }
      }
    }
  }

