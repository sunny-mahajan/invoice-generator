const Loader = ({ height, width }) => {
    return (
      <>
        <style>
          {`
            .loader {
              border: 4px solid #252945;
              border-radius: 50%;
              border-top: 4px solid white;
              width: ${width || 26}px;
              height: ${height || 26}px;
              animation: spin 1s linear infinite;
            }
  
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div className="loader"></div>
      </>
    );
  };
  
  export default Loader;
  