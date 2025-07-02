// Dashboard.jsx
import React, { useContext } from "react";
import { Container, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import Snapshot from "../components/Snapshot";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        {user ? (
          <Snapshot />
        ) : (
          <div>
            <h1>Welcome, Please login.</h1>
            <span>↗️</span>

          </div>
        )}
      </Card>
    </Container>
  );
};

export default Dashboard;
