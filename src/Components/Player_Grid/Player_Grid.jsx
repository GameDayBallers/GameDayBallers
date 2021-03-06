import React, { Component } from 'react';
import PlayerThumbnail from './Player_Thumbnail/Player_Thumbnail.jsx';
import { Grid, Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import PaginationAdvanced from '../Pagination/PaginationAdvanced.jsx';
import axios from 'axios';
import Loading from '../Loading/Loading.jsx';

export default class Player_Grid extends Component {
  constructor(props){
    super(props)
    this.state = {
      players: [{
        'image_url': '',
        'name': '',
        'url' : '',
        'career_stats': {
          'assists_per_game': '',
          'blocks_per_game': '',
          'field_goal_percentage': '',
          'free_throw_percentage': '',
          'minutes_per_game': '',
          'points_per_game': '',
          'rebounds_per_game': '',
          'three_point_percentage': ''
        },
        'dob': '',
        'team': '',
        'height': '',
        'jersey_number':'',
        'position':'',
        'weight':''
        }],
      activePage: 1,
      num_players_to_show: 12,
      data_loaded: false,
      sortBy: 'Name',
      order: 'Ascending',
      needToSort: false,
      positionFilter: 'Any Position',
      teamFilter: 'Any Team',
      updatePaginationAfterFiltering: false,
      numFilteredPlayers: 0,
      searchText: ''
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.handleSortType = this.handleSortType.bind(this)
    this.handleOrder = this.handleOrder.bind(this)
    this.handlePositionFilter = this.handlePositionFilter.bind(this)
    this.handleTeamFilter = this.handleTeamFilter.bind(this)
  }

  componentDidMount(){
    if(typeof this.props.players === 'undefined'){
      var url = "http://api.gamedayballers.me/players_full/";
      axios.get(url).then(response => {
        this.setState({
          players : response['data'],
          data_loaded: true
        })

      })
    }else{
      this.setState({
        players : this.props.players,
        data_loaded: true
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.players !== nextProps.players){
      this.setState({
        players: nextProps.players
      })
    }
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey,
    });
  }


  // <------------ Thumbnail Generation ------------>
  RenderPlayerThumbnail(player){
    return(
      <Link key={player.name } to= {player.url}>
        <PlayerThumbnail search={this.props.search} overlay={true} name={player.name} src={player.image_url}
          team={player.team} position={player.position} dob={player.dob} height={player.height}
          jerseyNumber={player.jersey_number} weight={player.weight}/>
      </Link>
    );
  }

  RenderPlayerThumbnails(){
    var result = []

    var upperBound = this.state.activePage * this.state.num_players_to_show
    var lowerBound = upperBound - this.state.num_players_to_show
    var players = this.state.players

    var filteredByPosition = [];
    if (this.state.positionFilter !== "Any Position") {
      for (let i = 0; i < this.state.players.length; i++) {
        var player = players[i];
        if (player.position.includes(this.state.positionFilter)) {
            filteredByPosition.push(player);
        }
      }
    } else {
      filteredByPosition = players;
    }

    var filteredByTeam = [];
    if (this.state.teamFilter !== "Any Team") {
      for (let i = 0; i < this.state.players.length; i++) {
        player = players[i];
        if (player.team === this.state.teamFilter) {
            filteredByTeam.push(player);
        }
      }

    } else {
      filteredByTeam = players;
    }

    var fPlayers = filteredByPosition.filter((n) => filteredByTeam.includes(n));

    for(let i = lowerBound; (i < fPlayers.length) && (i < upperBound); i++){
      player = fPlayers[i];
      result.push(this.RenderPlayerThumbnail(player));
    }

    if(this.state.needToSort){
      players.sort(this.determineSort())
      this.setState({
        needToSort: false
      })
    }

    if(this.state.updatePaginationAfterFiltering){
      this.setState({
        numFilteredPlayers: fPlayers.length,
        updatePaginationAfterFiltering: false
      })
    }
    return result;
  }

  determineSort(){

    var sortBy = this.state.sortBy

    switch (sortBy) {
      case 'Name':
        return ((p1, p2) => {
          var result = p2.name.localeCompare(p1.name)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'Height':
        return ((p1, p2) => {
          var result = parseFloat(p2.height) - parseFloat(p1.height)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'Age':
        return ((p1, p2) => {
          var result = Date.parse(p2.dob) - Date.parse(p1.dob)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'MPG':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.minutes_per_game) - parseFloat(p1.career_stats.minutes_per_game)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'FG%':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.field_goal_percentage) - parseFloat(p1.career_stats.field_goal_percentage)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case '3P%':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.three_point_percentage) - parseFloat(p1.career_stats.three_point_percentage)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'FT%':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.free_throw_percentage) - parseFloat(p1.career_stats.free_throw_percentage)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'PPG':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.points_per_game) - parseFloat(p1.career_stats.points_per_game)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'RPG':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.rebounds_per_game) - parseFloat(p1.career_stats.rebounds_per_game)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'APG':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.assists_per_game) - parseFloat(p1.career_stats.assists_per_game)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      case 'BPG':
        return ((p1, p2) => {
          var result = parseFloat(p2.career_stats.blocks_per_game) - parseFloat(p1.career_stats.blocks_per_game)
          return this.state.order === 'Ascending' ? result * -1 : result
        })
      default:
        return ((p1, p2) => {
          var result = p1.name.localeCompare(p2.name)
          return this.state.order === 'Ascending' ? result * -1 : result
      })
    }
  }

  handleOrder(evt) {
    this.setState({
      order: evt,
      needToSort: true
    });
  }

  handleSortType(evt){
    this.setState({
      sortBy: evt,
      needToSort: true
    });
  }

  handlePositionFilter(evt){
    this.setState({
      positionFilter: evt,
      updatePaginationAfterFiltering: true
    });
  }

  handleTeamFilter(evt){
    this.setState({
      teamFilter: evt,
      updatePaginationAfterFiltering: true
    });
  }

  render(){
    var numItemsToDisplay  = this.state.players.length
    if (this.state.numFilteredPlayers > 0) {
      numItemsToDisplay = this.state.numFilteredPlayers
    }


    var paginationToDisplay = (<PaginationAdvanced
                                  num_items={Math.ceil(numItemsToDisplay / this.state.num_players_to_show)}
                                  max_items={3}
                                  activePage={this.state.activePage}
                                  onSelect={this.handleSelect}/>)

    if(!this.state.data_loaded){
      return(<Loading/>);
    }else{
      return(
        <div className="main">
          <Row className="controls">
            <Col xs={6} className="paginate">
              {paginationToDisplay}
            </Col>
            <Col xs={6} className="sort-and-filter">
              <DropdownButton id="Team" title={this.state.teamFilter} onSelect={this.handleTeamFilter}>
              <MenuItem eventKey="Any Team">Any Team</MenuItem>
              <MenuItem eventKey="Atlanta Hawks">Atlanta Hawks</MenuItem>
              <MenuItem eventKey="Boston Celtics">Boston Celtics</MenuItem>
              <MenuItem eventKey="Brooklyn Nets">Brooklyn Nets</MenuItem>
              <MenuItem eventKey="Charlotte Hornets">Charlotte Hornets</MenuItem>
              <MenuItem eventKey="Chicago Bulls">Chicago Bulls</MenuItem>
              <MenuItem eventKey="Cleveland Cavaliers">Cleveland Cavaliers</MenuItem>
              <MenuItem eventKey="Dallas Mavericks">Dallas Mavericks</MenuItem>
              <MenuItem eventKey="Denver Nuggets">Denver Nuggets</MenuItem>
              <MenuItem eventKey="Detroit Pistons">Detroit Pistons</MenuItem>
              <MenuItem eventKey="Golden State Warriors">Golden State Warriors</MenuItem>
              <MenuItem eventKey="Houston Rockets">Houston Rockets</MenuItem>
              <MenuItem eventKey="Indiana Pacers">Indiana Pacers</MenuItem>
              <MenuItem eventKey="LA Clippers">LA Clippers</MenuItem>
              <MenuItem eventKey="Los Angeles Lakers">Los Angeles Lakers</MenuItem>
              <MenuItem eventKey="Memphis Grizzlies">Memphis Grizzlies</MenuItem>
              <MenuItem eventKey="Miami Heat">Miami Heat</MenuItem>
              <MenuItem eventKey="Milwaukee Bucks">Milwaukee Bucks</MenuItem>
              <MenuItem eventKey="Minnesota Timberwolves">Minnesota Timberwolves</MenuItem>
              <MenuItem eventKey="New Orleans Pelicans">New Orleans Pelicans</MenuItem>
              <MenuItem eventKey="New York Knicks">New York Knicks</MenuItem>
              <MenuItem eventKey="Oklahoma City Thunder">Oklahoma City Thunder</MenuItem>
              <MenuItem eventKey="Orlando Magic">Orlando Magic</MenuItem>
              <MenuItem eventKey="Philadelphia 76ers">Philadelphia 76ers</MenuItem>
              <MenuItem eventKey="Phoenix Suns">Phoenix Suns</MenuItem>
              <MenuItem eventKey="Portland Trail Blazers">Portland Trail Blazers</MenuItem>
              <MenuItem eventKey="Sacramento Kings">Sacramento Kings</MenuItem>
              <MenuItem eventKey="San Antonio Spurs">San Antonio Spurs</MenuItem>
              <MenuItem eventKey="Toronto Raptors">Toronto Raptors</MenuItem>
              <MenuItem eventKey="Utah Jazz">Utah Jazz</MenuItem>
              <MenuItem eventKey="Washington Wizards">Washington Wizards</MenuItem>
              </DropdownButton>
              <DropdownButton id="Position" title={this.state.positionFilter} onSelect={this.handlePositionFilter}>
                <MenuItem eventKey="Any Position">Any Position</MenuItem>
                <MenuItem eventKey="C">C</MenuItem>
                <MenuItem eventKey="F">F</MenuItem>
                <MenuItem eventKey="G">G</MenuItem>
              </DropdownButton>
              <DropdownButton id="Sort By" title="Sort By" onSelect={this.handleSortType}>
                <MenuItem eventKey="Name">Player Name</MenuItem>
                <MenuItem eventKey="Height">Height</MenuItem>
                <MenuItem eventKey="Age">Age</MenuItem>
                <MenuItem eventKey="MPG">MPG</MenuItem>
                <MenuItem eventKey="FG%">FG%</MenuItem>
                <MenuItem eventKey="3P%">3P%</MenuItem>
                <MenuItem eventKey="FT%">FT%</MenuItem>
                <MenuItem eventKey="PPG">PPG</MenuItem>
                <MenuItem eventKey="RPG">RPG</MenuItem>
                <MenuItem eventKey="APG">APG</MenuItem>
                <MenuItem eventKey="BPG">BPG</MenuItem>
              </DropdownButton>
              <DropdownButton id="Order" title={this.state.order} onSelect={this.handleOrder}>
                <MenuItem eventKey="Ascending">Ascending</MenuItem>
                <MenuItem eventKey="Descending">Descending</MenuItem>
              </DropdownButton>
            </Col>
          </Row>

          <Grid>
            <Row>
              {this.RenderPlayerThumbnails()}
            </Row>
          </Grid>
          <Row className="paginate">
            {paginationToDisplay}
          </Row>
        </div>
      );
    }
  }
}
