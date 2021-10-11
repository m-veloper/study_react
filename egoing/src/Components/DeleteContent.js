import React, {Component} from "react";

class ReadContent extends Component {
  render() {
    return (
      <article>
        <h2>Create</h2>
        <form>
          <p><input type={"text"} name={"title"} placeholder={"title"}/></p>
        </form>
      </article>
    );
  }
}

export default ReadContent;
