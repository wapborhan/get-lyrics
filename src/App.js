import React, { Component } from "react";
import axios from "axios";
import Header from "./Header";
import Lyrics from "./Lyrics";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
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
    this.searchLyrics();
  };

  searchLyrics = () => {
    axios
      .get(`https://api.lyrics.ovh/suggest/${this.state.search}`)
      .then((res) => {
        this.setState({ songs: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <Header />
        <div className="container">
          <div className="mt-3 mb-3">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control text-center"
                    placeholder="Search"
                    name="search"
                    value={this.state.search}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <button type="submit" className="w-100 btn btn-success">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {this.state.songs ? <Lyrics songs={this.state.songs} /> : null}
      </div>
    );
  }
}
