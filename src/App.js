import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Rooms from './components/rooms';
import Tiles from './components/tiles';
import {Map, Monster, Weapon, setItemLocations, lightControl, setExits, createRoom, randomInt} from './helper-functions/map';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: "restart",
      level: [], // x,y
      position: null,
      room: [],
      coord: [0, 0],
      player: {
        type: "player",
        level: 1,
        hp: 50,
        maxHP: 50,
        playerHunger: 100,
        playerScore: 0,
        exp: 0,
        damage: 5,
        weapon: "none"
      },
      floor: 1
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleInput);
    this.resetMap(1);
  }
  reset = () => {
    this.setState({ start: "hidden", restart: "hidden" });
    this.resetMap(1);
  };
  resetMap = floor => {
    let level = Map();
    let monsterList = [];
    let herbs = [];
    for (let i = 0; i < 5; i++) {
      herbs.push({ type: "herb", dark: "dark" });
    }
    for (let i = 0; i < randomInt(15, 30); i++) {
      monsterList.push(new Monster(floor));
    }
    //console.log(monsterList);
    if (floor == 1) {
      this.setState({
        restart: "hidden",

        player: {
          type: "player",
          level: 1,
          hp: 50,
          maxHP: 50,
          playerHunger: 100,
          playerScore: 0,
          exp: 0,
          damage: 5,
          weapon: "none"
        }
      });
    }
    if (floor > 1) {
      this.setState({ player: this.state.player });
    }
    if (floor >= 3) {
      setItemLocations(
        level,
        {
          type: "monster",
          dark: "dark",
          name: "Butcher",
          damage: 25,
          hp: 75,
          exp: 150
        },
        1,
        3
      );
    }
    if (floor < 3) {
      setItemLocations(level, { type: "stairs", dark: "dark" }, 1, 1);
    }
    setItemLocations(level, this.state.player, 1, 1);

    setItemLocations(level, new Weapon(floor), 1, 3);

    setItemLocations(level, monsterList, monsterList.length, 2);

    setItemLocations(level, herbs, herbs.length, 4);
    // have to reset player to player state, becaues the state changes through set items but indirectly. breaks flow, but since it is modified through set ItemLocations and recalled then it should be fine.

    this.setState({
      room: this.state.player.room,
      coord: this.state.player.coord
    });
    lightControl(
      level[this.state.player.room[0]][this.state.player.room[1]].tiles,
      this.state.player.coord[0],
      this.state.player.coord[1]
    );
    //
    this.setState({ level: level, floor: floor });
  };
  pickup = (player, item) => {
    if (item.type === "weapon") {
      player.damage = 5 + item.damage;
      player.weapon = item.name;
    }
    if (item.type === "herb") {
      player.hp += 10 + 5 * this.state.floor;
      if (player.hp > player.maxHP) {
        player.hp = player.maxHP;
      }
    }
    item.type = "floor";
  };
  combat = (player, monster) => {
    monster.hp = monster.hp - player.damage;
    player.hp = player.hp - monster.damage;
    if (monster.hp <= 0) {
      player.exp += monster.exp;

      monster.type = "floor";
      if (monster.name == "Butcher") {
        this.setState({ restart: "restart" });
      }
      if (player.exp >= 50 * player.level * 2) {
        player.maxHP += 25;
        player.hp = player.maxHP;
        player.level++;
        player.damage + 1;
      }
    }
    if (player.hp <= 0) {
      this.setState({ start: "restart" });
    }
  };

  handleInput = event => {
    // controls

    event.preventDefault();
    let roomx = this.state.room[0];
    let roomy = this.state.room[1];
    let x = this.state.coord[0];
    let y = this.state.coord[1];
    let level = this.state.level;
    let room = this.state.level[roomx][roomy].tiles;
    let type;

    if (event.key == "ArrowUp") {
      console.log(x - 1, y);
      if (x - 1 === -1 && roomx > 0) {
        console.log("im undefined or wall");
        room[x][y] = { type: "floor" };
        room = this.state.level[roomx - 1][roomy].tiles;
        lightControl(room, 11, y);
        room[11][y] = this.state.player;
        this.setState({
          level: level,
          room: [roomx - 1, roomy],
          coord: [11, y]
        });
      }

      if (room[x - 1][y].type === "monster") {
        console.log(this.state.player.hp, room[x - 1][y].hp);
        this.combat(this.state.player, room[x - 1][y]);
      }
      if (room[x - 1][y].type == "weapon") {
        this.pickup(this.state.player, room[x - 1][y]);
        this.setState({ level: level });
      }
      if (room[x - 1][y].type == "herb") {
        this.pickup(this.state.player, room[x - 1][y]);
        this.setState({ level: level });
      }
      if (room[x - 1][y].type == "stairs") {
        this.resetMap(this.state.floor + 1);
      } else if (room[x - 1] !== "undefined") {
        type = room[x - 1][y].type;

        if (type == "exit" || type == "floor") {
          room[x][y] = { type: "floor" };
          room[x - 1][y] = this.state.player;
          lightControl(room, x - 1, y);
          this.setState({ level: this.state.level, coord: [x - 1, y] });
        }
      }
    }
    if (event.key == "ArrowDown") {
      console.log(x + 1, y);
      if (x + 1 == 12 && roomx < 3) {
        console.log("im undefined or wall");
        room[x][y] = { type: "floor" };
        room = this.state.level[roomx + 1][roomy].tiles;
        lightControl(room, 0, y);
        room[0][y] = this.state.player;
        this.setState({
          level: level,
          room: [roomx + 1, roomy],
          coord: [0, y]
        });
      }
      if (room[x + 1][y].type === "monster") {
        console.log(this.state.player.hp, room[x + 1][y].hp);
        this.combat(this.state.player, room[x + 1][y]);
      }
      if (room[x + 1][y].type == "weapon") {
        this.pickup(this.state.player, room[x + 1][y]);
        this.setState({ level: level });
      }
      if (room[x + 1][y].type == "herb") {
        this.pickup(this.state.player, room[x + 1][y]);
        this.setState({ level: level });
      }

      if (room[x + 1][y].type == "stairs") {
        this.resetMap(this.state.floor + 1);
      } else if (room[x + 1] !== "undefined") {
        type = room[x + 1][y].type;
        if (type == "exit" || type == "floor") {
          room[x][y] = { type: "floor" };
          room[x + 1][y] = this.state.player;
          lightControl(room, x + 1, y);
          this.setState({ level: this.state.level, coord: [x + 1, y] });
        }
      }
    }
    if (event.key == "ArrowRight") {
      console.log(x, y + 1);
      if (y + 1 == 12 && roomy < 3) {
        console.log("im undefined or wall");
        room[x][y] = { type: "floor" };
        room = this.state.level[roomx][roomy + 1].tiles;
        console.log(roomx);
        lightControl(room, x, 0);
        room[x][0] = this.state.player;
        this.setState({
          level: level,
          room: [roomx, roomy + 1],
          coord: [x, 0]
        });
      }
      if (room[x][y + 1].type === "monster") {
        console.log(this.state.player.hp, room[x][y + 1].hp);
        this.combat(this.state.player, room[x][y + 1]);
      }
      if (room[x][y + 1].type == "weapon") {
        this.pickup(this.state.player, room[x][y + 1]);
        this.setState({ level: level });
      }
      if (room[x][y + 1].type == "herb") {
        this.pickup(this.state.player, room[x][y + 1]);
        this.setState({ level: level });
      }
      if (room[x][y + 1].type == "stairs") {
        this.resetMap(this.state.floor + 1);
      } else if (room[x][y + 1] !== "undefined") {
        type = room[x][y + 1].type;

        if (type == "exit" || type == "floor") {
          room[x][y] = { type: "floor" };
          room[x][y + 1] = this.state.player;
          lightControl(room, x, y + 1);
          this.setState({ level: this.state.level, coord: [x, y + 1] });
        }
      }
    }
    if (event.key == "ArrowLeft") {
      console.log(x, y - 1);
      if (y - 1 == -1 && roomy > 0) {
        room[x][y] = { type: "floor" };
        room = this.state.level[roomx][roomy - 1].tiles;
        lightControl(room, x, 11);
        room[x][11] = this.state.player;
        this.setState({
          level: level,
          room: [roomx, roomy - 1],
          coord: [x, 11]
        });
      }
      if (room[x][y - 1].type === "monster") {
        console.log(this.state.player.hp, room[x][y - 1].hp);
        this.combat(this.state.player, room[x][y - 1]);
      }
      if (room[x][y - 1].type == "weapon") {
        this.pickup(this.state.player, room[x][y - 1]);
        this.setState({ level: level });
      }
      if (room[x][y - 1].type == "herb") {
        this.pickup(this.state.player, room[x][y - 1]);
        this.setState({ level: level });
      }
      if (room[x][y - 1].type == "stairs") {
        this.resetMap(this.state.floor + 1);
      } else if (room[x][y - 1] !== "undefined") {
        type = room[x][y - 1].type;
        if (type == "exit" || type == "floor") {
          room[x][y] = { type: "floor" };
          room[x][y - 1] = this.state.player;
          lightControl(room, x, y - 1);
          this.setState({ level: this.state.level, coord: [x, y - 1] });
        }
      }
    }
  };

  render() {
    //console.log(this.state.level);

    // needs to map through 6 rows so maybe component should be row? can't tell.
    return (
      <div>
        <div className="nav">
          <ul>
            <li>Floor:</li>
            <li>{this.state.floor}</li>
            <li>Lvl:</li>
            {this.state.player.level}
            <li />
            <li>Health: </li>
            <li>{this.state.player.hp + "/" + this.state.player.maxHP}</li>
            <li> Weapon: </li>
            <li>{this.state.player.weapon}</li>
            <li> Atk: </li>
            <li>{this.state.player.damage}</li>
            <li> Experience:</li>
            <li>{this.state.player.exp}</li>
          </ul>
        </div>
        <div className={"game "}>
          {this.state.level.map(rooms => {
            return rooms.map(room => {
              return <Rooms room={room} />;
            });
          })}
          <div className={this.state.restart}>
            <h3>You Won!</h3>
            <h3 className="restartText" onClick={this.reset}>
              Restart
            </h3>
          </div>
          <div className={this.state.start}>
            <h3>Kill The Butcher On Floor 3</h3>
            <h3 className="restartText" onClick={this.reset}>
              Start
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
