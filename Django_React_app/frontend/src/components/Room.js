
import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate, redirect } from "react-router-dom";
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";


export default function Room(props) {

  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

  const { roomCode } = useParams();

  useEffect(() => {
    getCurrentSong();
    fetch(`/api/get-room?code=${roomCode}`)
    .then(response => {
      if (!response.ok) {
        props.clearRoomCodeCallback();
        redirect("/");
      }
      return response.json();
    })
    .then(data => {
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
    });
    if (isHost) {
      authenticateSpotify();
    };
    }, [song, isHost, showSettings]);

    const getCurrentSong = () => {
      fetch('/spotify/current-song')
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      }).then((data) => {
        setTimeout(() => {
          setSong(data)
        }, 250);
      })
    }

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

    const noMusic = () => {
      return (
        <Typography variant="h5" component="h5">
          No song for now...
        </Typography>
      )
    }

    const musicCard = () => {
      return (
        <Grid item xs={11} md={7} align="center">
          <MusicPlayer song={ song } />
        </Grid>
        )
    }

    const authenticateSpotify = () => {
      fetch('/spotify/is-authenticated')
        .then((response) => response.json())
          .then((data) => {
            setSpotifyAuthenticated(data.status)
            if (!data.status) {
              fetch('/spotify/get-auth-url')
              .then((response) => response.json())
              .then((data) => {
                window.location.replace(data.url)
                });
            }
          });
    }

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

    { if (showSettings) {
      return renderSettings();
    }};

    return (
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Room Code: { roomCode }
          </Typography>
        </Grid>
        {(Object.keys(song).length === 0) ? noMusic() : musicCard()}
        {isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={ Link } onClick={leaveButtonPressed}>
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
}
