import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      selectedFiles.forEach((file, index) => {
        formData.append(`image${index + 1}`, file);
      });

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      // You can handle the response as needed, such as displaying a success message.
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle error, display error message, etc.
    }
  };

  return (
    <div style={styles.container}>
       <label htmlFor="fileInput" style={styles.label}>
      Choose files:
    </label>
    <input
      type="file"
      id="fileInput"
      name="images"
      onChange={handleFileChange}
      multiple
      style={styles.fileInput}
    />
      <button onClick={handleUpload} style={styles.uploadButton}>
        Upload
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '20px',
  },label: {
    marginBottom: '0',
    fontSize: '16px',
    backgroundColor:'blue',
    marginRight:'15px'
  },
  fileInput: {
    display:'none'
  },
  uploadButton: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ImageUpload;
