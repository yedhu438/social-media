import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import './App.css';
import Auth from './Pages/auth/Auth';
import Home from './Pages/home/Home';
import Profile from './Pages/profile/Profile';
import Chat from './Pages/chat/Chat';
import PostPage from './Components/Post/PostPage';
import ProfilePage from './Components/ProfilePageLeft/ProfilePage';
import AdminDashboard from './Pages/Admin/AdminDashboard';

function App() {
  const user = useSelector((state) => state.authReducer.authData);

  return (
    <div className="App">
      {/* Navigation Buttons */}
      {user && (
        <nav>
          <Link to="/home">
            <button>Home</button>
          </Link>
          <Link to="/chat">
            <button>Go to Chat</button>
          </Link>
          
          {/* Admin Dashboard Button - Visible Only to Admins */}
          {user?.user?.isAdmin && (
            <Link to="/admin">
              <button>Admin Dashboard</button>
            </Link>
          )}
        </nav>
      )}

      {/* Routes */}
      <Routes>
        <Route path='/' element={user ? <Navigate to='/home' /> : <Navigate to='/auth' />} />
        <Route path='/home' element={user ? <Home /> : <Navigate to='/auth' />} />
        <Route path='/auth' element={user ? <Navigate to='/home' /> : <Auth />} />
        <Route path='/profile/:id' element={user ? <Profile /> : <Navigate to='/auth' />} />
        <Route path='/chat' element={user ? <Chat /> : <Navigate to='/auth' />} />
        <Route path='/post/:postId' element={<PostPage />} />
        <Route path='/profle/:userId' element={<ProfilePage />} />

        {/* Admin Route - Only Accessible by Admins */}
        <Route path='/admin' element={user?.user?.isAdmin ? <AdminDashboard /> : <Navigate to='/' />} />
      </Routes>
    </div>
  );
}

export default App;
