function Error({message}) {
  if(!message){
    return null
  }
  return (
    <div style={{
      zIndex: 1000,
			position: 'fixed',
			backgroundColor: 'red',
			top: '10px',
			right: '20px',
			padding: '10px',
			borderRadius: '10px',
    }}>
      {message}
    </div>
  );
}

export default Error;