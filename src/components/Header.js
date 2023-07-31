import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoApp from '../assets/images/logo192.png';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { Toast } from 'bootstrap';
import { toast } from 'react-toastify';


const Header = (props) => {

    const location = useLocation();

    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem("token");
        navigate("/");
        // toast.success("Logout success!")
    }
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        src={logoApp}
                        width={'30px'}
                        height={'30px'}
                        className='d-inline-block align-top'
                        alt='React Bootstrap logo'
                    />
                    <span>Demo App</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" >
                        <NavLink to="/" className="nav-link">Home </NavLink>
                        <NavLink to="/users" className='nav-link'>Manage Users </NavLink>
                    </Nav>

                    <Nav>
                        <NavDropdown title="Setting" >
                            <NavLink to="/login" className="dropdown-item">Login </NavLink>
                            <NavDropdown.Item className='dropdown-item' onClick={() => handleLogOut()}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;