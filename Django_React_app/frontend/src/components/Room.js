import React, { useState, useEffect } from "react";
import { useParams, Link, navigate } from "react-router-dom";
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from "./CreateRoomPage";

export default function Room(props) {

  const[votesToSkip, setVotesToSkip] = useState(2);
  const[guestCanPause, setGuestCanPause] = useState(false);
  const[isHost, setIsHost] = useState(false);
  const[showSettings, setShowSettings] = useState(false)

  const { roomCode } = useParams();

  useEffect(() => {
      fetch(`/api/get-room?code=${roomCode}`)
      .then(response => {
        if (!response.ok) {
          props.clearRoomCodeCallback(); // clears roomCode state in HomePage
          navigate("/");
        }
        return response.json();

      })
      .then(data => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      })
    }, [showSettings]);

    // useEffect(() => {
    //     function renderSettings() {
    //       return (
    //         <Grid container spacing={1}>
    //           <Grid item xs={12} align="center">
    //             <CreateRoomPage
    //               update={true}
    //               votesToSkip={status.votesToSkip}
    //               guestCanPause={status.guestCanPause}
    //               roomCode={status.roomCode}
    //             />
    //           </Grid>
    //           <Grid item xs={12} align="center">
    //             <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
    //               Close
    //             </Button>
    //           </Grid>
    //         </Grid>
    //       )
    //     };
    // }, [])

    const renderSettings = () => {
      return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
        </Grid>
      </Grid>
    )}

    const renderSettingsButton = () => {
      return (
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
            Settings
          </Button>
        </Grid>
      );
    }

    const leaveButtonPressed = () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json"}
      };
      fetch(`/api/leave-room`, requestOptions)
        .then(_response => {
          props.clearRoomCodeCallback();
          navigate("/");
        });
    }


    { if (showSettings) {
      return renderSettings();
    }};

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
        {isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={ Link } onClick={leaveButtonPressed}>
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
}
