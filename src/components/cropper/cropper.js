import React, { useState, useRef } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";
import { Button, Form } from "react-bootstrap";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
        //height:600
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function Cropper({ setImage, w, h, isUploaded }) {
  const imgRef = useRef(null);
  const blobUrlRef = useRef("");
  const hiddenAnchorRef = useRef(null);
  const previewCanvasRef = useRef(null);
  // const [upload, uploadHandler] = useState("");
  const [crop, setCrop] = useState({});
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState("");
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(w / h);
  const [imageName, setImageName] = useState(null);
  // console.log(upload);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      setImageName(e.target.files[0].name);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error("Crop canvas does not exist");
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create blob");
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }

      // blobUrlRef.current = URL.createObjectURL(blob);
      // hiddenAnchorRef.current.href = blobUrlRef.current;
      // hiddenAnchorRef.current.click();
      setImage(new File([blob], imageName, { type: blob.type }));
    });
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  // function handleToggleAspectClick() {
  //   if (aspect) {
  //     setAspect(undefined);
  //   } else if (imgRef.current) {
  //     const { width, height } = imgRef.current;
  //     setAspect(15 / 6);
  //     setCrop(centerAspectCrop(width, height, 15 / 6));
  //   }
  // }

  return (
    <div className="App">
      <div className="Crop-Controls mb-3">
        <Form.Control
          onChange={onSelectFile}
          // required
          type="file"
          accept="image/*"
        />
      </div>
      {!isUploaded && (
        <>
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              // locked={true}
            >
              <img
                ref={imgRef}
                // style={{}}
                alt="Crop me"
                src={imgSrc}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  // width: "300px",
                  // height: "300px",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
          {!!completedCrop && (
            <>
              <div>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "1px solid black",
                    // objectFit: "contain",
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </div>
              <div>
                <Button className="mt-3" onClick={onDownloadCropClick}>Crop</Button>
                {/* <a
              ref={hiddenAnchorRef}
              download
              style={{
                position: "absolute",
                top: "-200vh",
                visibility: "hidden",
              }}
            >
              Hidden download
            </a> */}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
