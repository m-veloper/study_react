import './App.css';
import React, {Component} from "react";
import Subject from "./Components/Subject";
import TOC from "./Components/TOC";
import ReadContent from "./Components/ReadContent";
import Control from "./Components/Control";
import CreateContent from "./Components/CreateContent";
import UpdateContent from "./Components/UpdateContent";
import DeleteContent from "./Components/DeleteContent";


class App extends Component {

  constructor(props) {
    super(props);
    this.max_content_id = 3
    this.state = {
      mode: "create",
      selected_content_id: 2,
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

  getReadContent() {
    for (let i = 0; i < this.state.contents.length; i++) {
      let data = this.state.contents[i];
      if (data.id === this.state.selected_content_id) {
        return data;
      }
    }
  }

  getContent() {
    let _title, _desc, _article, _content = null;

    if (this.state.mode === "Welcome") {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>;
    } else if (this.state.mode === "read") {
      _content = this.getReadContent();
      _article = <ReadContent title={_content.title} desc={_content.desc}></ReadContent>;
    } else if (this.state.mode === "create") {
      _article = <CreateContent onSubmit={function (_title, _desc) {
        this.max_content_id = this.max_content_id + 1;
        let _contents = Array.from(this.state.contents);
        _contents.push({id: this.max_content_id, title: _title, desc: _desc})
        // let _content = this.state.contents.concat({id: this.max_content_id, title: _title, desc: _desc});
        this.setState({
          contents: _contents,
          mode: "read",
          selected_content_id: this.max_content_id
        })
      }.bind(this)}></CreateContent>;
    } else if (this.state.mode === "update") {
      _content = this.getReadContent();
      _article = <UpdateContent data={_content} onSubmit={
        function (_id, _title, _desc) {
          let _contents = Array.from(this.state.contents);
          for (let i = 0; i < _contents.length; i++) {
            if (_contents[i].id === _id) {
              _contents[i] = {id: _id, title: _title, desc: _desc}
            }
          }
          this.setState({
            contents: _contents,
            mode: "read"
          })
        }.bind(this)}></UpdateContent>;
    } else if (this.state.mode === "delete") {
      _article = <DeleteContent></DeleteContent>;
    }
    return _article;
  }

  render() {
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
        <TOC
          data={this.state.contents}
          onChangePage={function (id) {
            this.setState({
              mode: "read",
              selected_content_id: Number(id)
            })
          }.bind(this)}></TOC>
        <Control onChangeMode={function (_mode) {
          this.setState({
            mode: _mode
          })
        }.bind(this)}></Control>
        {this.getContent()}
      </div>
    );
  }
}


export default App;
