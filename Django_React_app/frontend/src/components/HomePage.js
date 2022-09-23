import React, { Component } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import { Grid, Button, ButtonGroup, Typography, Box, Stack } from '@material-ui/core';
import Room from './Room';
import Info from "./Info";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this)
  }

  async componentDidMount() {
    fetch('/api/user-in-room')
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        roomCode: data.code
      });
    });
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  renderHomePage() {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Spotify Room App
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Box m={1} pt={1}>
            <Button variant="contained" color="secondary" to='/create' component={Link}>
              Create a Room
            </Button>
          </Box>
          <Box m={1} pt={1}>
            <Button variant="contained" color="primary" to='/join' component={Link}>
              Join a Room
            </Button>
          </Box>
          <Box m={1} pt={1}>
            <Button variant="contained" color="default" to='/info' component={Link}>
              Info
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={this.state.roomCode ? (<Navigate replace to={`/room/${this.state.roomCode}`} />) : this.renderHomePage()} />
        <Route path="/join/*" element={<RoomJoinPage />} />
        <Route path="/info" element={<Info />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path='/room/:roomCode' element={<Room clearRoomCodeCallback={this.clearRoomCode} />} />
      </Routes>
    </BrowserRouter>
    )
  };
}
