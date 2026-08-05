import Hero from '../components/Hero';
import TrendingCategories from '../components/TrendingCategories';
import PopularTreks from '../components/PopularTreks';
import FeaturedDestinations from '../components/FeaturedDestinations';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import CTA from '../components/CTA';
import ServicePackages from '../components/ServicePackages';

const Home = () => {
  return (
    <>
      <Hero />
      <TrendingCategories />
      <PopularTreks />
      <ServicePackages />
      <WhyChooseUs />
      <FeaturedDestinations />
      <Testimonials />
      <Gallery />
      <CTA />
    </>
  );
};

export default Home;
