import React from 'react';
import ReactDOM from 'react-dom';
import { getPreNba } from '../json/pre_nba_data.js';

export default class PreNba extends React.Component {
  render() {
    var url = window.location.href;
    var schoolName = url.split('/')[url.split('/').length - 1];
    var preNba = getPreNba(schoolName);

    var players = preNba.players.map((player) =>
    <div className="grid-element col-md-4 col-6" key={player.toLowerCase().replace(/\s+/g, '')}>
      <a href={ "/players/" + player.toLowerCase().replace(/\s+/g, '') }>
        { player }
      </a>
    </div>
    );

    return (
      <div className="main">
        <div className="row">
          <div className="col-md-4">
            <div className="card image-card white-card">
              <div className="card-title">
                <img src={preNba.logo}/>
              </div>
              <div className="card-body">
                <ul>
                  <li>
                    <b>{ preNba.name }</b>
                  </li>
                  <li>
                    {preNba.city}, {preNba.state}
                  </li>
                </ul>
              </div>
            </div>
            <div className="card image-card full-image">
              <div className="card-title">
                Mascot
                <img src={preNba.mascot_img}/>
              </div>
              <div className="card-body">
                <b>{preNba.mascot}</b>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card grid-card">
              <div className="card-title">
                Players
              </div>
              <div className="card-body">

                <div className="roster-wrapper">
                  <div className="roster row">
                    { players }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <PreNba/>,
  document.getElementById('preNba')
);
