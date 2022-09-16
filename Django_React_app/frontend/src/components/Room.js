import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate, Route } from "react-router-dom";
import { Grid, Button, Typography } from '@material-ui/core';

export default function Room(props) {

    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);

    const { roomCode } = useParams();

    useEffect(() => {
      fetch(`/api/get-room?code=${roomCode}`)
          .then(response => {
              if (!response.ok) {
                  props.clearRoomCodeCallback(); // clears roomCode state in HomePage
                  Navigate("/");
              } else {
                  return response.json();
              }
          })
          .then(data => {
                  setVotesToSkip(data.votes_to_skip);
                  setGuestCanPause(data.guest_can_pause);
                  setIsHost(data.is_host);
          });
    }, []);

    const leaveButtonPressed = () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json"}
      };
      fetch(`/api/leave-room`, requestOptions)
        .then(_response => {
          props.clearRoomCodeCallback();
          Navigate("/");
        });
    }


    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: { roomCode }
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {String(guestCanPause)}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {String(isHost)}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={ Link } onClick={leaveButtonPressed}>
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
}
