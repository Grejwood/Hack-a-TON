import React, { useState, useEffect, useCallback } from "react";
import cx from "classnames";
import style from "./dropzone.module.scss";
import { useDropzone } from "react-dropzone";
import PreviewImg from "../PreviewImg";

const Dropzone = ({ files, setFiles }) => {
  const [value, setValue] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      console.log("acceptedFiles", acceptedFiles);

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  // const onUpload = (data) => {
  //   setValue(prevValue => [data, ...prevValue]);
  // };

  // const onDrop = useCallback(acceptedFiles => {
  //   acceptedFiles.map(file => uploadAcceptedFile(file));
  // }, []);

  // const thumbs = files.map(file => (
  //   <div className={style.thumb} key={file.name}>
  //     <div className={style.thumbInner}>
  //       <img
  //         className={style.img}
  //         src={file.preview}
  //         onLoad={() => {URL.revokeObjectURL(file.preview)}}
  //         alt="image"
  //       />
  //     </div>
  //   </div>
  // ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <>
      <div
        className={cx(style.container, { [style.dragActive]: isDragActive })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className={style.dropzoneText}>Drop the files here ...</p>
        ) : (
          <p className={style.dropzoneText}>
            Drag & drop your photos here, or click to select them
          </p>
        )}
      </div>

      {/*{!!files.length && (*/}
      {/*  <PreviewImg*/}
      {/*    className={style.thumbsContainer}*/}
      {/*    files={files}*/}
      {/*  />*/}
      {/*)}*/}

      {/*<aside className={style.thumbsContainer}>*/}
      {/*  {thumbs}*/}
      {/*</aside>*/}
    </>
  );
};

export default Dropzone;
