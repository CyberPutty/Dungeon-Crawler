import React from 'react';

class Tiles extends React.Component {
  render() {
    return (
      <div className="room">
        {this.props.tiles.map(tile => {
          if (tile.type == "monster") {
            return (
              <div className={tile.dark + " tile " + tile.type}>
                <p>{tile.name}</p>
              </div>
            );
          }
          if (tile.type == "monster" && tile.name == "Butcher") {
            return (
              <div className={tile.dark + " tile boss"}>
                <p>{tile.name}</p>
              </div>
            );
          } else {
            return <div className={tile.dark + " tile " + tile.type} />;
          }
        })}
      </div>
    );
  }
}
export default Tiles;