import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import './company-card.css';

// --- Sub-component: The Modal ---
function CompanyDetailsModal({ show, onHide, company, renderStars }) {
  if (!company) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      contentClassName="jury-modal-content"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {company.name} <span className="text-success fs-5 ms-2">| Quick Verdict</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 pb-4">
        <Container fluid>
          {/* Top Section: Info & Logo */}
          <Row className="align-items-center mb-4 pb-3 border-bottom">
            <Col xs="auto">
              <div className="modal-logo-frame">
                {company.imageUrl ? (
                  <img src={company.imageUrl} alt={company.name} className="img-fluid" />
                ) : (
                  <span className="text-muted small">No Logo</span>
                )}
              </div>
            </Col>
            <Col>
              <h4 className="mb-0 fw-bold">{company.industry}</h4>
              <p className="text-muted mb-0">{company.location}</p>
            </Col>
          </Row>

          {/* Middle Section: The Evidence Box */}
          <div className="verdict-data-box p-4 rounded-4 mb-4">
            <Row className="text-center g-0">
              <Col md={6} className="border-end">
                <p className="text-uppercase small fw-bold text-muted mb-1">Jury Standing</p>
                <div className="d-flex justify-content-center mb-1">
                  {renderStars(company.averageRating)}
                </div>
                <h3 className="fw-bold mb-0 text-success">
                  {company.averageRating || '0.0'} <span className="text-muted fs-6">/ 5.0</span>
                </h3>
              </Col>
              <Col md={6}>
                <p className="text-uppercase small fw-bold text-muted mb-1">Evidence Count</p>
                <h3 className="fw-bold mb-0 text-dark">
                  {company.reviews?.length || 0}
                </h3>
                <p className="small text-muted mb-0">Total Verdicts</p>
              </Col>
            </Row>
          </div>

          {/* Bottom Section: Summary */}
          {company.description && (
            <div>
              <h6 className="fw-bold text-uppercase small text-muted mb-2">Case Summary</h6>
              <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                {company.description}
              </p>
            </div>
          )}
        </Container>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onHide} className="text-muted">
          Close Briefing
        </Button>
        <Link to={`/companies/${company._id}`} className="btn btn-emerald px-4 fw-bold">
          Read Full Evidence
        </Link>
      </Modal.Footer>
    </Modal>
  );
}

// --- Main Component ---
const CompanyCard = ({ company }) => {
  const [modalShow, setModalShow] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? 'star filled' : 'star'}>★</span>
      );
    }
    return stars;
  };

  return (
    <>
      <div className="company-card shadow-sm">
        <div className="card-image-container">
          {company.imageUrl ? (
            <img src={company.imageUrl} alt={company.name} className="company-logo" />
          ) : (
            <div className="no-image">No Logo</div>
          )}
        </div>

        <div className="card-body">
          <h3 className="company-name">{company.name}</h3>
          <p className="company-meta">
            {company.industry} <span className="separator">•</span> {company.location}
          </p>

          <div className="rating-container">
            <div className="stars-row">{renderStars(company.averageRating)}</div>
            <div className="rating-stats">
              <span className="rating-badge">{company.averageRating || '0.0'}</span>
              <span className="review-count">
                ({company.reviews?.length || 0} {company.reviews?.length === 1 ? 'Verdict' : 'Verdicts'})
              </span>
            </div>
          </div>

          <Button
            className="view-btn w-100 border-0 fw-bold"
            onClick={() => setModalShow(true)}
          >
            View Verdict
          </Button>
        </div>
      </div>

      <CompanyDetailsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        company={company}
        renderStars={renderStars}
      />
    </>
  );
};

export default CompanyCard;
