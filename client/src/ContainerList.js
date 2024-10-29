const ContainerList = ({ containers }) => {
    return (
      <div>
        <div>
          {containers.map((container) => (
            <div key={container.container_id} style={containerStyle}>
              <h2>{container.name}</h2>
              <p><strong>Drinks:</strong> {container.number_of_drinks}</p>
              <p><strong>Entrees:</strong> {container.number_of_entrees}</p>
              <p><strong>Sides:</strong> {container.number_of_sides}</p>
              <p><strong>Appetizers:</strong> {container.number_of_appetizers}</p>
              <p><strong>Price:</strong> ${container.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Inline CSS for styling the container cards
  const containerStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
  };
  
  export default ContainerList;