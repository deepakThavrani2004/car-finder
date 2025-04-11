import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Card, Button, Spinner, Form, Pagination, Modal
} from 'react-bootstrap';
import { motion } from 'framer-motion';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedCarType, setSelectedCarType] = useState('');
  const [fuelTypes, setFuelTypes] = useState([]);
  const [carTypes, setCarTypes] = useState([]);

  const carsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:5000/cars')
      .then((res) => {
        setCars(res.data);
        setLoading(false);

        const fuels = [...new Set(res.data.map((car) => car.fuel))];
        const types = [...new Set(res.data.map((car) => car.type))];

        setFuelTypes(fuels);
        setCarTypes(types);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (car) => {
    if (!wishlist.find((item) => item.id === car.id)) {
      setWishlist([...wishlist, car]);
    }
  };

  const removeFromWishlist = (carId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== carId);
    setWishlist(updatedWishlist);
  };

  const filteredCars = cars
    .filter((car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((car) => (selectedFuelType ? car.fuel === selectedFuelType : true))
    .filter((car) => (selectedCarType ? car.type === selectedCarType : true));

  if (sortOption === 'lowToHigh') {
    filteredCars.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'highToLow') {
    filteredCars.sort((a, b) => b.price - a.price);
  }

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowDetails = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCar(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /> Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Car Finder</h2>

      {/* Search + Filters */}
      <Form className="mb-4">
        <Row>
          <Col md={3} className="mb-2">
            <Form.Control
              type="text"
              placeholder="Search by name or brand"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
          <Col md={3} className="mb-2">
            <Form.Select
              value={selectedFuelType}
              onChange={(e) => {
                setSelectedFuelType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>{fuel}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="mb-2">
            <Form.Select
              value={selectedCarType}
              onChange={(e) => {
                setSelectedCarType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Car Types</option>
              {carTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="mb-2">
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Car Cards with Animation */}
      <Row>
        {currentCars.length > 0 ? (
          currentCars.map((car, index) => (
            <Col md={4} key={car.id} className="mb-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card>
                  <Card.Img variant="top" src={car.image} height="200" style={{ objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title>{car.name}</Card.Title>
                    <Card.Text>
                      <strong>Brand:</strong> {car.brand}<br />
                      <strong>Fuel:</strong> {car.fuel}<br />
                      <strong>Type:</strong> {car.type}<br />
                      <strong>Seats:</strong> {car.seats}<br />
                      <strong>Price:</strong> ₹{car.price.toLocaleString()}
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" onClick={() => addToWishlist(car)}>Wishlist</Button>
                      <Button variant="info" onClick={() => handleShowDetails(car)}>View Details</Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <p className="text-center">No cars found.</p>
        )}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Wishlist */}
      {wishlist.length > 0 && (
        <div className="mt-5">
          <h4>Your Wishlist</h4>
          <Row>
            {wishlist.map((car) => (
              <Col md={4} key={car.id} className="mb-3">
                <Card>
                  <Card.Img variant="top" src={car.image} height="180" style={{ objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title>{car.name}</Card.Title>
                    <Card.Text>₹{car.price.toLocaleString()}</Card.Text>
                    <Button variant="danger" onClick={() => removeFromWishlist(car.id)}>Remove</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Car Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Car Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCar && (
            <>
              <img
                src={selectedCar.image}
                alt={selectedCar.name}
                style={{ width: '100%', objectFit: 'cover', marginBottom: '1rem' }}
              />
              <p><strong>Name:</strong> {selectedCar.name}</p>
              <p><strong>Brand:</strong> {selectedCar.brand}</p>
              <p><strong>Fuel Type:</strong> {selectedCar.fuel}</p>
              <p><strong>Car Type:</strong> {selectedCar.type}</p>
              <p><strong>Seats:</strong> {selectedCar.seats}</p>
              <p><strong>Price:</strong> ₹{selectedCar.price.toLocaleString()}</p>
              <p><strong>Description:</strong> {selectedCar.description || 'No description available.'}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CarList;
