import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getError } from "../utils";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return { ...state, loadingDeliver: false, successDeliver: false };

    default:
      return state;
  }
}

export default function OrderScreen() {
  //  define params to get id from URL params
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(`/api/orders/${order._id}/pay`, details, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate("/login");
    }
    if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          header: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "MYR",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay, successDeliver]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Container className="orderscreen-container">
      <div>
        <Helmet>
          <title>Order {orderId}</title>
        </Helmet>
        <h1 className="mb-3 text-bold">Order {orderId}</h1>

        {/* SHIPPING INFORMATION CONTAINER */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="text-bold pt-3 px-2">Shipping Information</Card.Title>
            <Card.Text>
              <Row className="align-items-center py-3 px-2">
                <Col className="text-bold">Name:</Col>
                <Col md={10}>{order.shippingAddress.fullName}</Col>
              </Row>
              <Row className="align-items-center py-3 px-2">
                <Col className="text-bold">Address:</Col>
                <Col md={10}>
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </Col>
              </Row>
            </Card.Text>
            {order.isPaid ? <MessageBox variant="success">Paid at {order.paidAt.substring(0, 10)}</MessageBox> : <MessageBox variant="danger">Not Paid</MessageBox>}
            {order.isDelivered ? <MessageBox variant="success">Delivered at {order.deliveredAt.substring(0, 10)}</MessageBox> : <MessageBox variant="danger">Not Delivered</MessageBox>}
          </Card.Body>
        </Card>
        {/* END OF SHIPPING INFORMATION CONTAINER */}

        {/* ITEMS INFORMATION & ORDER DETAILS */}
        <Card className="mb-3">
          <Card.Body>
            <Card.Title className="text-bold pt-3 px-2">Items</Card.Title>
            <ListGroup variant="flush">
              {order.orderItems.map((item) => (
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
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup variant="flush" className="text-end">
              <ListGroup.Item>
                <Row>
                  <Col>Merchandise Subtotal</Col>
                  <Col> RM{order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Fee</Col>
                  <Col>RM{order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>RM{order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Order Total</Col>
                  <Col className="text-bold h4">RM{order.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Payment Method</Col>
                  <Col>{order.paymentMethod}</Col>
                </Row>
              </ListGroup.Item>
              {/* when 'Order is Paid', PayPal button will disappear */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
                      <PayPalButtons className="text-center" createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                    </div>
                  )}
                  {loadingPay && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  <div className="d-grid">
                    <Button type="button" onClick={deliverOrderHandler}>
                      Deliver Order
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
        {/* END OF ITEMS INFORMATION & ORDER DETAILS */}
      </div>
    </Container>
  );
}
