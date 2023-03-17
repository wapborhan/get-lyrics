import React from "react";

const Lyrics = (props) => {
  const songs = props.songs.map((item) => {
    return (
      <div className="col-md-4" key={item.id}>
        <div className="card mt-4">
          <img className="card-img-top" src={item.album.cover_big} />
          <div className="card-body">
            <h4 className="card-title mt-3">{item.title}</h4>
            <div className="meta">Artist: {item.artist.name}</div>
            <div className="card-text">Album: {item.album.title}</div>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="container">
      <div className="row mb-5">{songs}</div>
    </div>
  );
};

export default Lyrics;
