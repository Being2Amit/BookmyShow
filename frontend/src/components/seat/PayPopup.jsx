import React from "react";
import { Modal, Button } from "react-bootstrap";

const PayPopup = ({ showModal, handleClose, handleProcess }) => {
  const handleAccept = () => {handleProcess(); handleClose();}; // Trigger handleProcess when Accept is clicked then Close the modal
  return (
    <Modal className="m-5"  show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title className="w-100 text-center">Terms & Conditions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <ol style={{ padding: "15px", listStyleType: "decimal", fontSize:'15px' }}>
          <li>Entry is allowed only for valid ticket holders.</li>
          <li>Ticket is compulsory for children 3 years & above.</li>
          <li>Outside food and beverages are not allowed inside the premises.</li>
          <li>Any person found under the influence of alcohol or drugs will be asked to leave the premises without a refund.</li>
          <li>Rights of admission reserved by the cinema management.</li>
          <li>Decisions taken by the cinema management are final and abiding.</li>
          <li>Ticket prices and schedules are subject to change without prior notice.</li>
        </ol>
      </Modal.Body>
        <div className="d-flex flex-row justify-content-center gap-x-3 mb-3">
        <Button variant="white" className="btn-outline-danger w-100 mx-3"
          style={{ transition: "none", backgroundColor: "white", borderColor: "#dc3545", color: '#dc3545'}} onClick={handleClose}>Cancel
        </Button>
        <Button variant="danger" className="w-100 mx-3" onClick={handleAccept}>Accept</Button>
        </div>
    </Modal>
  );
};

export default PayPopup;
