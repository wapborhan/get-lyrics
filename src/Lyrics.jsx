import React, { Component } from "react";
import axios from "axios";

export default class Lyrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: null,
    };
  }

  searchLyricsDetails = (artist, songTitle) => {
    axios
      .get(`https://api.lyrics.ovh/v1/${artist}/${songTitle}`)
      .then((res) => {
        this.setState({ lyrics: res });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    console.log(this.state.lyrics);
    const songs = this.props.songs.map((item) => {
      return (
        <div
          className="col-md-4 cursor-pointer"
          key={item.id}
          onClick={this.searchLyricsDetails(item.artist.name, item.title)}
        >
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
      <div
        className="s"
        style={{
          background: "rgb(70 8 85 / 73%)",
        }}
      >
        <div className="container">
          <div className="row p b-5">{songs}</div>
        </div>
      </div>
    );
  }
}
