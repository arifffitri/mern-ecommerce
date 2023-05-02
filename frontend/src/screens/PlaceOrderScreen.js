import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.1234 => 123.12
  cart.itemsPrice = round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <Container className="orderscreen-container">
        <div className="py-5">
          <h1 className="mb-3 text-bold">Preview Order</h1>
          <Row>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title className="text-bold pt-3 px-2">Shipping Information</Card.Title>
                <Card.Text>
                  <Row className="align-items-center py-3 px-2">
                    <Col className="text-bold">Name:</Col>
                    <Col md={10}>
                      {cart.shippingAddress.fullName} <br />
                    </Col>
                  </Row>
                  <Row className="align-items-center py-3 px-2">
                    <Col className="text-bold">Address:</Col>
                    <Col md={10}>
                      {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                    </Col>
                  </Row>
                  <Row className="align-items-center pt-3 px-2">
                    <Link to="/shipping">Edit</Link>
                  </Row>
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title className="text-bold pt-3 px-2">Items</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Link to={`/product/${item.slug}`} className="text-decoration-none text-body">
                        <Row className="align-items-center py-3 px-2">
                          <Col xs={6} md={4} lg={2} className="text-start">
                            <img src={item.image} alt={item.name} className="img-fluid rounded"></img>
                          </Col>
                          <Col xs={6} md={4} lg={8}>
                            <Row>{item.name}</Row>
                            <Row>x{item.quantity}</Row>
                          </Col>
                          <Col className="text-end" xs={12} md={4} lg={2}>
                            RM{item.price.toFixed(2)}
                          </Col>
                        </Row>
                        <Row className="align-items-center pt-3 px-2">
                          <Link to="/shipping">Edit</Link>
                        </Row>
                      </Link>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title className="text-bold pt-3 px-2">Order Summary</Card.Title>
                <ListGroup variant="flush" className="text-end">
                  <ListGroup.Item>
                    <Row>
                      <Col>Merchandise Subtotal</Col>
                      <Col>RM{cart.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping Fee</Col>
                      <Col>RM{cart.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>RM{cart.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Order Total</Col>
                      <Col className="text-bold h4">RM{cart.totalPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Payment Method</Col>
                      <Col>{cart.paymentMethod}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button type="button" onClick={placeOrderHandler} disabled={cart.cartItems.length === 0}>
                        Place Order
                      </Button>
                    </div>
                    {loading && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Row>
        </div>
      </Container>
    </div>
  );
}
