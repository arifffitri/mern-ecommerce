import Spinner from "react-bootstrap/Spinner";

export default function LoadingBox() {
  return (
    <Spinner animation="border" role="status">
      {/* if loading spinner not show up, will execute below */}
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
