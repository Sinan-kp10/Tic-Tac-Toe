import { useNavigate } from "react-router-dom";

function Multiplayer() {
  const navigate = useNavigate();

  return (
    <div className="menu">
      <h1>Online Multiplayer</h1>
      
      <div className="session-card" style={{ padding: "40px 30px" }}>
        <div style={{ fontSize: "50px", marginBottom: "10px" }}>🚀</div>
        <h2 style={{ 
          color: "#00e5ff", 
          textShadow: "0 0 10px rgba(0, 229, 255, 0.5)", 
          margin: "0 0 10px 0",
          fontSize: "24px",
          fontWeight: "600"
        }}>
          Coming Soon
        </h2>
        <p style={{ 
          color: "#cbd5e1", 
          fontSize: "15px", 
          lineHeight: "1.6", 
          margin: "0", 
          textAlign: "center" 
        }}>
          We are currently crafting a seamless online matchmaking and lobby system. You will soon be able to challenge your friends in real-time online battles!
        </p>
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
}

export default Multiplayer;
