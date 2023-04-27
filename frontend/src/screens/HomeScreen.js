import axios from "axios";
import { useEffect, useReducer } from "react";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Image from "react-bootstrap/Image";
import Fade from "react-reveal/Fade";
import { Link } from "react-router-dom";

// import data from "../data";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  // useReducer is an alternative to useState
  // useReducer is usually preferable to useState when you have complex state logic that involves multi sub-value
  // OR
  // when 'next state' depends on 'previous one'

  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: "",
  });

  // const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAILED", payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <Fade bottom distance="20%" duration={1500}>
      <div>
        <Helmet>
          <title>ZORO Malaysia</title>
        </Helmet>

        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <Row>
              <Col md={6} className="copy">
                <div>
                  <div className="text-hero-bold">COLLECTIONS</div>
                  <div className="text-hero-regular">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan euismod lacus, et ultrices risus sagittis ac.</div>
                  <div className="cta">
                    <Link to="/all-products" className="btn btn-primary">
                      <i class="fa-solid fa-bag-shopping icon-image"></i>
                      SHOP NOW
                    </Link>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <img src="../images/p1.jpg" alt="hero" className="hero-img" />
              </Col>
            </Row>
          </div>
        </section>
        {/* End of Hero Section */}

        {/* Testimoni Brand Setion */}
        <section class="testimoni-brand">
          <div class="container">
            <Row>
              <Col md={12} className="mt-5 text-center">
                <Image src="../images/testimonial-brand.png" alt="testimoni-brand" className="testimoni-brand" />
              </Col>
            </Row>
          </div>
        </section>
        {/* End of Testimoni Brand Section */}

        {/* Categories Section */}
        <div className="categories">
          <Row>
            <CardGroup>
              <Card border="light" className="m-1">
                <Link to="/search?category=Shirts" className="text-dark">
                  <Card.Img src="../images/shirt.jpg" alt="Card image" className="category" />
                  <Card.ImgOverlay>
                    <Card.Title>SHIRTS</Card.Title>
                  </Card.ImgOverlay>
                </Link>
              </Card>
              <Card border="light" className="m-1">
                <Link to="/search?category=Pants" className="text-dark">
                  <Card.Img src="../images/pants.jpg" alt="Card image" className="category" />
                  <Card.ImgOverlay>
                    <Card.Title>PANTS</Card.Title>
                  </Card.ImgOverlay>
                </Link>
              </Card>
            </CardGroup>
            <CardGroup>
              <Card border="light" className="m-1">
                <Link to="/search?category=Shoes" className="text-dark">
                  <Card.Img src="../images/Shoes.jpg" alt="Card image" className="category" />
                  <Card.ImgOverlay>
                    <Card.Title>SHOES</Card.Title>
                  </Card.ImgOverlay>
                </Link>
              </Card>
              <Card border="light" className="m-1">
                <Link to="/search?category=Socks" className="text-dark">
                  <Card.Img src="../images/Socks.jpg" alt="Card image" className="category" />
                  <Card.ImgOverlay>
                    <Card.Title>SOCKS</Card.Title>
                  </Card.ImgOverlay>
                </Link>
              </Card>
            </CardGroup>
          </Row>
        </div>

        {/* End of Categories Section */}
      </div>
    </Fade>
  );
}

export default HomeScreen;
