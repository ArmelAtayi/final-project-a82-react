import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';  

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
  
    if (!localStorage.getItem('authToken')) {
      navigate('/login');  
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove the auth token
    navigate('/login');  // Redirect to the login page
  };

  return (
    <div className="dashboard-container">
      <header>
        <nav>
          <a href="/dashboard" aria-current="page" role="link">Dashboard</a>
          <a href="/summary" role="link">Summary</a>
          <a href="/reports" role="link">Reports</a>
          <button 
            onClick={handleLogout} 
            aria-label="Logout" 
            className="logout-button"
          >
            Logout
          </button>
        </nav>
      </header>

      <main>
        <h1>UNC Charlotte: Innovation and Economic Prosperity</h1>
        <p>
          UNC Charlotte has had its "Innovation and Economic Prosperity" (IEP) designation extended by the Association of Public and Land-grant Universities (APLU). This recognition highlights the university's sustained efforts in regional economic development and community engagement. Since first receiving the IEP designation in 2017, UNC Charlotte has significantly advanced its mission to power innovation and economic growth in the region.
        </p>
        <p>
          With research expenditures increasing by 272% over the past decade, UNC Charlotte is on track to earn Carnegie R1 status by early 2025. The IEP designation, valid through 2028, allows UNC Charlotte to share best practices and apply for annual awards recognizing excellence in economic engagement, reinforcing its role as a pivotal driver of innovation and opportunity in the Charlotte region.
        </p>
        <p>
          Read the full article here: 
          <a 
            href="https://inside.charlotte.edu/2024/08/28/aplu-extends-charlottes-innovation-and-economic-prosperity-university-designation/"
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Read the full article on APLU’s site"
          >
            APLU Extends Charlotte’s IEP Designation
          </a>
        </p>
        
        <h2>Technical Aspects of This Project</h2>
        <p>
          This project uses a React-based frontend with a Node.js backend and MongoDB database. Authentication is handled via JWT, and the app is hosted using NGINX to serve the frontend on port 80 and backend on port 3000. Asynchronous HTTP calls fetch dynamic chart data, and the app follows ADA/WCAG accessibility principles for inclusivity.
        </p>

        <h2>Welcome to the Dashboard</h2>
        <p>This is where you can see the dynamic charts and reports related to UNCC’s latest news.</p>
      </main>
    </div>
  );
};

export default Dashboard;
