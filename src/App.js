import React, { Component } from "react";
import axios from "axios";
import Header from "./Header";
import Lyrics from "./Lyrics";
import Footer from "./Footer";

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
      <div
        style={{
          backgroundImage: `url("https://png.pngtree.com/background/20210714/original/pngtree-blank-design-template-pink-neon-light-background-vector-illustration-eps-jpg-picture-image_1248702.jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          height: "100vh",
        }}
      >
        <Header />
        <div className="lyrics">
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
        </div>
        {this.state.songs ? <Lyrics songs={this.state.songs} /> : null}
        {this.state.songs ? <Footer /> : null}
      </div>
    );
  }
}
