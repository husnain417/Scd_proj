import React from 'react';
import './stats.css'; // Ensure you have a CSS file for styling the stats component

const Stats = ({ item }) => {
  return (
    <div className="stats-container">
      {item.map((stat, index) => (
        <div key={index} className="stat-card">
          <h4>{stat.text}</h4>
          <p>{stat.balance}</p>
          <img src={stat.icon} alt={`${stat.text} icon`} className="stat-icon" />
        </div>
      ))}
    </div>
  );
};

export default Stats;
