import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const ImageGallery = () => {
  const [imageIds, setImageIds] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchImageIds = async () => {
      try {
        const response = await fetch('http://localhost:5000/images');
        const data = await response.json();
        setImageIds(data);
      } catch (error) {
        console.error('Error fetching image IDs:', error);
      }
    };

    fetchImageIds();
  }, []);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrev = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : imageIds.length - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex < imageIds.length - 1 ? prevIndex + 1 : 0));
  };
  const handleDownload = () => {
    // Assuming the image URL is stored in a variable
    const imageUrl = `http://localhost:5000/image/${imageIds[selectedImageIndex]}`;

    // Create an anchor element and trigger a download
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = `image_${imageIds[selectedImageIndex]}.jpg`;
    downloadLink.click();
  };

  const handleDelete = async () => {
    if (selectedImageIndex !== null) {
      const imageIdToDelete = imageIds[selectedImageIndex];
      try {
        // Implement the logic to delete the image with the given id
        await fetch(`http://localhost:5000/delete/${imageIdToDelete}`, {
          method: 'DELETE',
        });
  
        // Update the imageIds state after deletion
        const remainingImages = [...imageIds];
        remainingImages.splice(selectedImageIndex, 1);
        setImageIds(remainingImages);
  
        // Close the modal
        closeModal();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };
  

  return (
    <div style={{marginTop:'50px'}}>
      <h2>Image Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {imageIds.map((id, index) => (
          <img
            key={id}
            src={`http://localhost:5000/image/${id}`}
            alt={`Image ${id}`}
            style={{ width: 'auto', height: '200px', margin: '10px', cursor: 'pointer' }}
            onClick={() => openModal(index)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={{
          content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            marginTop:'30px'
          },
        }}
      >
        {selectedImageIndex !== null && (
          <div style={{ position: 'relative' }}>
            <button style={styles.closeButton} onClick={closeModal}>
              X
            </button>

            <img
              src={`http://localhost:5000/image/${imageIds[selectedImageIndex]}`}
              alt={`Image ${imageIds[selectedImageIndex]}`}
              style={{ maxWidth: '80vw', maxHeight: '80vh', margin: '10px' }}
            />

            <div style={styles.buttonContainer}>
              <button style={styles.navButton} onClick={handlePrev}>
                Prev
              </button>
              <button style={styles.navButton} onClick={handleNext}>
                Next
              </button>
              <button style={styles.downloadButton} onClick={handleDownload}>
                Download
              </button>
              <button style={styles.deleteButton} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '10px',
  },
  navButton: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  downloadButton: {
    padding: '10px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  closeButton: {
    position: 'absolute',
    top: '30px',
    right: '10px',
    padding: '10px 15px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
  },
};

export default ImageGallery;