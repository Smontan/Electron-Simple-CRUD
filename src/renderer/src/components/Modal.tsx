import { ReactNode } from 'react'

interface ModalProps {
  modalTitle: string
  id: string
  children: ReactNode
}

const Modal = ({ id, modalTitle, children }: ModalProps) => {
  return (
    <>
      
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={id}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modalTitleId"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitleId">
                {modalTitle}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {children}
          </div>
        </div>
      </div>
      
    </>
  )
}
export default Modal
