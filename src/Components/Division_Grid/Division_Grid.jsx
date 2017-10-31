import React, {Component} from 'react'
import Division_Thumbnail from './Division_Thumbnail/Division_Thumbnail.jsx'
import { Grid, Row, Col, Image, Thumbnail } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading.jsx';
import PaginationAdvanced from '../Pagination/PaginationAdvanced.jsx';

export default class Division_Grid extends Component {
  constructor(props){
    super(props)
    this.state = {
      divisions: [{
        'image_url': '',
        'name': '',
        'url' : ''
      }],
      data_loaded: false
    }

    var url = "https://api-dot-game-day-ballers-181000.appspot.com/divisions/"

    axios.get(url).then(response => {
      this.setState({
        divisions : response['data'],
        data_loaded: true

      })
    })
  }

  RenderDivisionThumbnail(link, division_name, img_source){
    return(
      <Link to= {link}>
        <Division_Thumbnail name={division_name} src={img_source}/>
      </Link>
    );
  }

  // Use this method to generate Thumbnails when future API is created
  RenderDivisionThumbnails(){
    var result = [];
    for(let i = 0; i < this.state.divisions.length; i++){
      var division = this.state.divisions[i]
      result.push(this.RenderDivisionThumbnail(division.url, division.name, division.image_url ));
    }
    return result;
  }

  render(){
    if(!this.state.data_loaded){
      return(<Loading/>);
    }else{
      return(
        <div className="main">
          <Grid>
            <Row>
              {/* <PaginationAdvanced num_items={Math.ceil(this.state.num_players_total / this.state.num_players_to_show)} max_items={10} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}/> */}
            </Row>
            <Row>
              {this.RenderDivisionThumbnails()}
            </Row>
          </Grid>
        </div>
      );
    }

  }
}
