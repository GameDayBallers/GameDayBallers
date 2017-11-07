import React, {Component} from 'react'
import { Grid, Row, Col, Image, Thumbnail } from 'react-bootstrap';

export default class Team_Thumbnail extends Component {
  render(){
    return(
      <Col xs={6} sm={4} className="text-center">
          <div className="card image-card white-card team-logo">
            <div className="card-title">
              <div className="overlay">
                <div className="overlay-info">
                  {this.props.name}
                </div>
              </div>
              <img src={this.props.src}/>
            </div>
            <div className="card-body">
              {this.props.name}
            </div>
          </div>
      </Col>
    );
  }
}
