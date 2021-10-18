import React, {useState} from "react";
import {Typography, Button, Form, message, Input, Icon} from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import {useDispatch} from "react-redux";
import {upload} from "../../../_actions/user_actions";


const {Title} = Typography;
const {TextArea} = Input;

const PrivateOption = [
  {value: 0, label: "Private"},
  {value: 1, label: "Public"}
];

const CategoryOption = [
  {value: 0, label: "Film & Animation"},
  {value: 1, label: "Autos & Vehicles"},
  {value: 2, label: "Music"},
  {value: 3, label: "Pets & Animals"},
];

function VideoUploadPage() {

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  }

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  }

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  }

  const onDrop = (files) => {
    let formData = new FormData;
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])

    Axios.post('/api/video/uploadfiles', formData, config)
      .then(response => {
          if (response.data.success) {
            console.log(response.data)

            let variable = {
              url: response.data.url,
              fileName: response.data.fileName
            }
            setFilePath(response.data.url);

            Axios.post('/api/video/thumbnails', variable)
              .then(response => {
                if (response.data.success) {
                  setDuration(response.data.fileDuration);
                  setThumbnailPath(response.data.thumbsFilePath)
                } else {
                  alert("썸네일생성 실패")
                }
              });
          } else {
            alert('비디오 업로드를 실패했습니다.')
          }
        }
      )
  }

  return (
    <div style={{maxWidth: "700px", margin: "2rem auto"}}>
      <div style={{textAlign: "center", marginBottom: "2rem"}}>
        <Title level={2}>Upload Video </Title>
      < /div>
      <Form onSubmit>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          {/*Drop item*/}
          <Dropzone onDrop={onDrop}
                    multiple={false} // 파일 1개 : false, 파일 여러개 : true
                    maxSize={10000000000}>
            {({getRootProps, getInputProps}) => (
              <div style={{
                display: "flex",
                width: "300px",
                height: "240px",
                border: "1px solid lightgray",
                alignItems: "center",
                justifyContent: "center"
              }} {...getRootProps()}>
                <input {...getInputProps()}/>
                <Icon type="plus" style={{fontSize: "3rem"}}/>
              </div>
            )}
          </Dropzone>

          {/*Thumbnail*/}
          {ThumbnailPath &&
          <div>
            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="Thumbnail"/>
          </div>
          }
        </div>
        <br/>
        <br/>
        <label>Title</label>
        <Input onChange={onTitleChange}
               value={VideoTitle}/>
        <br/>
        <br/>
        <label>Description</label>
        <TextArea onChange={onDescriptionChange}
                  value={Description}/>
        <br/>
        <br/>
        <select onChange={onPrivateChange}>
          {PrivateOption.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>
        <br/>
        <br/>
        <select onChange={onCategoryChange}>
          {CategoryOption.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>
        <br/>
        <br/>
        <Button type="primary" size="large" onClick>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default VideoUploadPage;
