import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/adminHome.css';

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 

  const fetchUsers = async (query = '') => {
    try {
      const response = await axios.get(`https://bank-info-backend.vercel.app/api/allusers?search=${query}`, { withCredentials: true });
      setUsers(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      fetchUsers(searchQuery);
    }, 1600);

    return () => clearTimeout(delayDebounceFn); 
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Account Numbers</th>
              <th>IFSC CODE</th>
              <th>ACCOUNT HOLDER NAME</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.banks.map((i) => (
                  <h1 key={i.accountNumber}>{i.accountNumber}</h1>
                ))}</td>
                <td>{user.banks.map((i) => (
                  <h1 key={i.ifscCode}>{i.ifscCode}</h1>
                ))}</td>
                <td>{user.banks.map((i) => (
                  <h1 key={i.branchName}>{i.accountHolderName}</h1>
                ))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;
