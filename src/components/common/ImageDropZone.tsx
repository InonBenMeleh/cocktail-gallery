import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { message } from 'antd';

interface ImageDropzoneProps {
    onUpload: (file: File) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onUpload }) => {
    const [image, setImage] = useState<File | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImage(file);
            message.success('Image uploaded successfully');
            onUpload(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop,
    });

    return (
        <div {...getRootProps()} style={dropzoneStyles}>
            <input {...getInputProps()} />
            {image ? (
                <div>
                    <img src={URL.createObjectURL(image)} alt="Uploaded" style={imageStyles} />
                    <p>Image: {image.name}</p>
                </div>
            ) : (
                <p>Drag & drop an image here, or click to select one</p>
            )}
        </div>
    );
};

const dropzoneStyles = {
    border: '2px dashed #4CAF50',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '8px',
    width: '460px',
    height: '160px',
};

const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    marginTop: '10px',
};

export default ImageDropzone;
