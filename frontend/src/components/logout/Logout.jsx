import { Modal, Button } from 'react-bootstrap';

function LogoutModal({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to log out?</Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="danger" onClick={onHide}>
          No
        </Button>
        <Button variant="success" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutModal;
