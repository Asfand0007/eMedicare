import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  test('renders navbar with logo', () => {
    renderNavbar();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  test('shows login button when user is not authenticated', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  test('shows logout button when user is authenticated', () => {
    // Mock localStorage to simulate authenticated user
    const mockUser = { role: 'doctor', name: 'Dr. Smith' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    renderNavbar();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    
    // Cleanup
    localStorage.removeItem('user');
  });

  test('handles logout correctly', () => {
    // Mock localStorage to simulate authenticated user
    const mockUser = { role: 'doctor', name: 'Dr. Smith' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    renderNavbar();
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    // After logout, login button should be visible
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    
    // Cleanup
    localStorage.removeItem('user');
  });
}); 