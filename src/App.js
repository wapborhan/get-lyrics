import React, { Component } from "react";
import axios from "axios";
import Header from "./Header";
import Lyrics from "./Lyrics";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "valobasa",
      songs: null,
      songTitle: null,
      artist: null,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // console.log(this.state);
  };
  componentDidMount() {
    axios
      .get(`https://api.lyrics.ovh/suggest/${this.state.search}`)
      .then((res) => {
        this.setState({ songs: res.data.data });
      });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Header />
        <div className="container">
          <div className="mt-3 mb-3">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                className="form-control text-center"
                placeholder="Search"
                name="search"
                value={this.state.search}
                onChange={this.handleChange}
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>

        {this.state.songs ? <Lyrics songs={this.state.songs} /> : "Loading"}
      </div>
    );
  }
}
