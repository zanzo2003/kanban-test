import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IoMdArrowDropdown } from 'react-icons/io';
import { FaSortAmountDown, FaUserAlt, FaExclamationCircle, FaCircle } from 'react-icons/fa';
import './App.css'; 

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayType, setDisplayType] = useState('status');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDisplayChange = (type) => {
    setDisplayType(type);
  };


  const handleSortChange = (type) => {
    setSortBy(type);
  };

  const groupByStatus = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const status = ticket.status;
      acc[status] = acc[status] || [];
      acc[status].push(ticket);
      return acc;
    }, {});
  };


  const groupByUser = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const user = users.find(u => u.id === ticket.userId);
      const userName = user ? user.name : 'Unknown User';
      acc[userName] = acc[userName] || [];
      acc[userName].push(ticket);
      return acc;
    }, {});
  };

  const groupByPriority = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const priority = ticket.priority;
      acc[priority] = acc[priority] || [];
      acc[priority].push(ticket);
      return acc;
    }, {});
  };

  const renderTickets = () => {
    let displayedTickets = [...tickets];

    if (sortBy === 'priority') {
      displayedTickets.sort((a, b) => b.priority - a.priority);
    } else if (sortBy === 'title') {
      displayedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (displayType === 'status') {
      displayedTickets = groupByStatus(displayedTickets);
    } else if (displayType === 'user') {
      displayedTickets = groupByUser(displayedTickets);
    } else if (displayType === 'priority') {
      displayedTickets = groupByPriority(displayedTickets);
    }

    

return Object.keys(displayedTickets).map((group, index) => (
  <div key={index} className="ticket-group">
    <div className="group-header">
    <h2>{group}</h2>
    </div>
    {displayedTickets[group].map(ticket => (
      <div key={ticket.id} className="ticket-card">
        <div className="top-layer">
        <span className="id">{ticket.id}</span>
        <div className="profile-info">
          <div className="profile-pic"></div>
          <div className={`status-indicator ${ticket.status}`}></div>
        </div>
        </div>
        <div className="task-title"> 
          <span className="title">{ticket.title}</span>
        </div>
       
        <div className="alert-tag-row">
          <div className={`alert-icon ${ticket.hasAlert ? 'active' : ''}`}></div>
          <div className="tag">{ticket.tag[0]}</div>
        </div>
      </div>
    ))}
  </div>
));

  };

  return (
    <div className="Page">
      <div className="header">
      <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
      <button onClick={toggleDropdown}>
      Display <IoMdArrowDropdown />
      </button>
      {isDropdownOpen && (
        <>
          <button className="dropdown-btn" onClick={() => handleDisplayChange('status')}>
            <FaExclamationCircle /> Group by Status
          </button>
          <button className="dropdown-btn" onClick={() => handleDisplayChange('user')}>
            <FaUserAlt /> Group by User
          </button>
          <button className="dropdown-btn" onClick={() => handleDisplayChange('priority')}>
            <FaSortAmountDown /> Group by Priority
          </button>

          <button className="dropdown-btn" onClick={() => handleSortChange('priority')}>
            <FaSortAmountDown /> Sort by Priority
          </button>
          <button  className="dropdown-btn" onClick={() => handleSortChange('title')}>
            <FaSortAmountDown /> Sort by Title
          </button>
        </>
      )}
    </div>
      </div>
    <div className="kanban-board">

      <div className="controls">
        <button onClick={() => handleDisplayChange('status')}>Group by Status</button>
        <button onClick={() => handleDisplayChange('user')}>Group by User</button>
        <button onClick={() => handleDisplayChange('priority')}>Group by Priority</button>

        <button onClick={() => handleSortChange('priority')}>Sort by Priority</button>
        <button onClick={() => handleSortChange('title')}>Sort by Title</button>
      </div>
      

      <div className="ticket-container">{renderTickets()}</div>
    </div>
    </div>
  );
};

export default App;
