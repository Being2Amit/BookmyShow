function Modal({ show, onConfirm, onClose }) {
  if (!show) return null;
  return (
    <div className="modal mt-5 fade show" tabIndex="-1" aria-hidden="true" style={{ display: 'block' }}>
      <div className="modal-dialog modal-sm modal-md modal-lg modal-dialog-centered" style={{maxWidth:'290px'}}>
        <div className="modal-content">
          <div className="modal-header d-flex align-items-center">
            <h5 className="modal-title">Confirm Cancel</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">Are you sure you want to cancel?</div>
          <div className="modal-footer d-flex justify-content-center align-items-center gap-3">
            <button type="button" className="btn btn-danger" onClick={onConfirm}>Yes</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;

