import React from "react";
import Tiles from './tiles';

class Rooms extends React.Component {
    render() {
      return (
        <div className="altroom">
          {this.props.room.tiles.map(room => {
            return <Tiles tiles={room} />;
          })}
        </div>
      );
    }
  }

  export default Rooms;