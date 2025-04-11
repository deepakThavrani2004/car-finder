import { useParams } from 'react-router-dom';

function CarDetails() {
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <h2>🚘 Car Details Page</h2>
      <p>Showing details for car ID: {id}</p>
    </div>
  );
}

export default CarDetails;
