import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    // first, it'll go to signin screen to check the user authentication
    // if user is authenticated, it'll redirect user to shipping screen to enter shipping details
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div className="py-5">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="mb-3">Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup className="mb-3">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col xs={12} md={4} lg={4} className="text-start">
                      <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail me-3"></img>
                      {"  "}
                      <Link to={`/product/${item.slug}`} className="text-decoration-none text-body">
                        {item.name}
                      </Link>
                    </Col>
                    <Col xs={5} md={4} lg={3} className="my-3">
                      <Button variant="light" onClick={() => updateCartHandler(item, item.quantity - 1)} disabled={item.quantity === 1}>
                        <i className="fas fa-minus-circle"></i>
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button variant="light" onClick={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === item.countInStock}>
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col xs={4} md={2} lg={3}>
                      RM{item.price}
                    </Col>
                    <Col xs={3} md={2} lg={2}>
                      <Button variant="light" onClick={() => removeItemHandler(item)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}
                    {"  "}
                    items) : <br /> RM
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button type="button" variant="primary" onClick={checkoutHandler} disabled={cartItems.length === 0}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
