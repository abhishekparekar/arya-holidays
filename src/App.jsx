import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import ScrollProgress from './components/ScrollProgress';
import Home from './pages/Home';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import CategoryDetail from './pages/CategoryDetail';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import GalleryPage from './pages/GalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import Services from './pages/Services';
import AdminLayout from './pages/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTrips from './pages/admin/Trips';
import AdminBookings from './pages/admin/Bookings';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminCategories from './pages/admin/Categories';
import AdminGallery from './pages/admin/Gallery';
import AdminContactInfo from './pages/admin/ContactInfo';
import AdminTravelServices from './pages/admin/TravelServices';
import AdminQueries from './pages/admin/Queries';

function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="trips" element={<Trips />} />
          <Route path="trip/:id" element={<TripDetail />} />
          <Route path="category/:id" element={<CategoryDetail />} />
          <Route path="booking/:tripId" element={<Booking />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="contact" element={<AdminContactInfo />} />
          <Route path="travel-services" element={<AdminTravelServices />} />
          <Route path="queries" element={<AdminQueries />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
