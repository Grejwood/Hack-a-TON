import React, {useCallback} from "react";
import style from "./dropzone.module.scss";
import {useDropzone} from "react-dropzone";

const Dropzone = () => {
  const onDrop = useCallback(acceptedFiles => {
    console.log('acceptedFiles', acceptedFiles);
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className={style.container} {...getRootProps()}>
      <input className={style.input} {...getInputProps()} />
      {
        isDragActive ?
          <p className={style.dropzoneText}>Drop the files here ...</p> :
          <p className={style.dropzoneText}>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default Dropzone;