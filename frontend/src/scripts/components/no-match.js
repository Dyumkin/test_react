import React, { Component } from 'react';

class NoMatch extends Component {

  render() {
    return (
      <section className="min-section__wr garages-section">
        <div className="container">
          <div className="vertical-center-block">
            <div className="display-tb-sm display-tb_full-ht">
              <div className="display-tc-sm">
                <header className="min-section__header text-center">
                  <h1 className="min-section__title">404 Not found</h1>
                  <div className="separator"></div>
                </header>
                <div className="min-section__body"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default NoMatch;
