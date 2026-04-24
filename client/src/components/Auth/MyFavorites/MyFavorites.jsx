import Carousel from 'react-bootstrap/Carousel';
import CompanyCard from '../../Company/CompanyCard/CompanyCard.jsx';
import { useSavedCompanies } from '../../../hooks/useSavedCompanies.js';
import './my-favorites.css';

const MyFavorites = () => {
  const { savedCompanies } = useSavedCompanies();

  return (
    <div className="my-favorites-container">
      <Carousel
        fade
        interval={null}
        indicators={true}
        controls={savedCompanies.length > 1}
        className="favorites-carousel"
      >
        {savedCompanies.map((company) => (
          <Carousel.Item key={company._id}>
            <div className="company-card-wrapper">
              <CompanyCard company={company} />
            </div>

            <div className="carousel-caption-wrapper">
              <Carousel.Caption>
                <h3>{company.name}</h3>
                <p>
                  {company.industry} - {company.location}
                </p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default MyFavorites;
