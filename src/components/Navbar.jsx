import { FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();
    const token =localStorage.getItem('token');
    const handleLogout = () => {
      localStorage.clear();
      navigate('/');
    };

    return (
        <div className="navbar">
            <Link to="/" className="logo">
                LOGO
            </Link>
            
            {token ? (
                <button className="logout" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" />
                    Logout
                </button>
            ) : (
                <Link to="/signup" className="signup"> 
                    <FaSignOutAlt className="icon" />
                    Signup
                </Link>
            )}
        </div>
    );
};


export default Navbar