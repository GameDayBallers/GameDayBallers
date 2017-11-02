import React, {Component} from 'react';
import {Carousel, Row, Col} from 'react-bootstrap';
import { Timeline } from 'react-twitter-widgets';

export default class Home extends Component {
  render(){
    var timeline =  (
      <Timeline
        dataSource={{
          sourceType: 'profile',
          screenName: 'NBA'
        }}
        options={{
          username: 'TwitterDev',
          height: '400'
        }}/>
      );

    return(
      <div className="main">
        <div id="home-background"></div>
          <div className="home-title">
            {/*<h1 className="display-3">WELCOME TO GAME DAY BALLERS</h1>
            <h2>I hope you are ready to ball.</h2>*/}
          </div>
        </div>
    );

    /*
    <div className="main">
      <h1 className="display-3">Welcome to Gameday Ballers!</h1>
      <p className="lead">I hope you are ready to ball.</p>

      <Row>
        <Col md={9}>
        <Carousel>
          <Carousel.Item>
            <img  alt="900x500" src="https://cdn.vox-cdn.com/uploads/chorus_image/image/56042635/632531402.0.jpg"/>
          </Carousel.Item>

          <Carousel.Item>
            <img  alt="900x500" src="http://www.fbschool.org/_assets/images/basketball.jpg"/>
          </Carousel.Item>

          <Carousel.Item>
            <img  alt="900x500" src="https://cdn.nba.net/nba-drupal-prod/styles/landscape/s3/2017-08/victor-oladipo-africa.jpg?itok=kmfNF8l8"/>
          </Carousel.Item>
        </Carousel>
        </Col>
        <Col md={3}>
          {timeline}
        </Col>
      </Row>
    </div>
    */
  }
}
