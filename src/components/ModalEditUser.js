import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { putUpdateUser } from '../servives/UserService'

const ModelEditUser = (props) => {
    const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props;

    const [name, setname] = useState("");
    const [job, setjob] = useState("");

    const handleEditUser = async () => {
        let res = await putUpdateUser(name, job)
        if (res && res.updatedAt) {
            //success
            handleEditUserFromModal({
                first_name: name,
                id: dataUserEdit.id
            })
            handleClose();
            toast.success('Update user success!')
        }
    }
    useEffect(() => {
        if (show) {
            setname(dataUserEdit.first_name)
        }
    }, [dataUserEdit])
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit a user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='body-add-new'>
                        <form>
                            <div class="mb-3">
                                <label className='form-label'>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(event) => setname(event.target.value)}
                                />
                            </div>
                            <div class="mb-3">
                                <label className='form-label'>Job</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={job}
                                    onChange={(event) => setjob(event.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEditUser()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModelEditUser;