import React, {Component} from "react";

class Contents extends Component {
  render() {
    return (
      <header>
        <h1><a href="/">{this.props.title}</a></h1>
        {this.props.desc}
      </header>
    );
  }
}

export default Contents;
