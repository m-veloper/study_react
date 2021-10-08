import './App.css';
import React, {Component} from "react";
import Subject from "./Components/Subject";
import TOC from "./Components/TOC";
import Contents from "./Components/Contents";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: "read",
      subject: {
        title: "React",
        sub: "Hello, React!"
      },
      welcome: {
        title: "Welcome",
        desc: "Hello, Welcome"
      },
      contents: [
        {id: 1, title: "HTML", desc: "HTML1"},
        {id: 2, title: "CSS", desc: "CSS"},
        {id: 3, title: "JAVASCRIPT", desc: "JAVASCRIPT"}
      ]
    }
  }

  render() {
    let _title, _desc = null;

    if (this.state.mode === "Welcome") {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
    } else if (this.state.mode === "read") {
      _title = this.state.contents[0].title;
      _desc = this.state.contents[0].desc;
    }

    return (
      <div className="App">
        <Subject
          title={this.state.subject.title}
          sub={this.state.subject.sub}
          onChangePage={function () {
            this.setState({
              mode: "Welcome"
            })
          }.bind(this)}>
        </Subject>
        <TOC data={this.state.contents}></TOC>
        <Contents title={_title} desc={_desc}></Contents>
      </div>
    );
  }
}


export default App;
