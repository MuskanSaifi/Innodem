
const Footer = () => {
  return (
<footer className="bg-dark text-light pt-5 pb-4">
  <div className="container text-center text-md-start">
    <div className="row">
      {/* Logo & About */}
      <div className="col-md-4 col-lg-3 mx-auto">
        <h5 className="text-uppercase fw-bold">Your Logo</h5>
        <p className="small">
          We provide high-quality services and innovative solutions to help you grow your business.
        </p>
      </div>
      {/* Quick Links */}
      <div className="col-md-2 col-lg-2 mx-auto">
        <h5 className="text-uppercase fw-bold">Quick Links</h5>
        <ul className="list-unstyled">
          <li><a href="#" className="text-light text-decoration-none">Home</a></li>
          <li><a href="#" className="text-light text-decoration-none">About Us</a></li>
          <li><a href="#" className="text-light text-decoration-none">Services</a></li>
          <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
        </ul>
      </div>
      {/* Contact Info */}
      <div className="col-md-4 col-lg-3 mx-auto">
        <h5 className="text-uppercase fw-bold">Contact</h5>
        <p className="small"><i className="fas fa-map-marker-alt me-2" /> 123 Street, City, Country</p>
        <p className="small"><i className="fas fa-envelope me-2" /> info@example.com</p>
        <p className="small"><i className="fas fa-phone me-2" /> +123 456 7890</p>
      </div>
      {/* Social Media */}
      <div className="col-md-3 col-lg-3 mx-auto text-center text-md-start">
        <h5 className="text-uppercase fw-bold">Follow Us</h5>
        <a href="#" className="btn btn-outline-light btn-sm me-2"><i className="fab fa-facebook-f" /></a>
        <a href="#" className="btn btn-outline-light btn-sm me-2"><i className="fab fa-twitter" /></a>
        <a href="#" className="btn btn-outline-light btn-sm me-2"><i className="fab fa-instagram" /></a>
        <a href="#" className="btn btn-outline-light btn-sm"><i className="fab fa-linkedin-in" /></a>
      </div>
    </div>
    {/* Copyright */}
    <div className="text-center pt-3 border-top mt-4">
      <p className="small m-0">© 2024 Your Company. All Rights Reserved.</p>
    </div>
  </div>
</footer>
);
};

export default Footer;
