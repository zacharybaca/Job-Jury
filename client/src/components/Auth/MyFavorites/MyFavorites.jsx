import Carousel from 'react-bootstrap/Carousel';
import { useSavedCompanies } from '../../../hooks/useSavedCompanies.js';
import './my-favorites.css';

const MyFavorites = () => {
    const { savedCompanies } = useSavedCompanies();

    return (
        <div className="my-favorites-container">
            <Carousel>
                {savedCompanies.map((company) => (
                    <Carousel.Item key={company._id} interval={1000}>
                        <ExampleCarouselImage text={company.name} />
                        <Carousel.Caption>
                            <h3>{company.name}</h3>
                            <p>{company.industry} - {company.location}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}

            </Carousel>
        </div>
    );
}

export default MyFavorites;
