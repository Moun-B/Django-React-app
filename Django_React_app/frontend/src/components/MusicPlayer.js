import React, { Component } from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import { PlayArrowIcon, SkipNextIcon, PauseIcon } from '@material-ui/icons';

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card>
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            <img src={this.props.image_url} height="100%" width="100%" />
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              {this.props.title}
            </Typography>
            <Typography component="h5" variant="h5">
              {this.props.artist}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    );
  }
}
