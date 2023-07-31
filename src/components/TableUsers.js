import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../servives/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModelEditUser from './ModalEditUser';
import _, { clone } from 'lodash';
import ModalConfirm from './ModalConfirm';
import './TableUsers.scss'
import { CSVLink, CSVDownload } from 'react-csv';
import Papa from "papaparse"
// import { eventManager, toast } from 'react-toastify/dist/core';
import { toast } from 'react-toastify';

const TableUsers = (props) => {
    const [listusers, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isShowModelAddnew, setisShowModelAddNew] = useState(false);

    const [isShowModelEditUser, setisShowModelEditUser] = useState(false);
    const [dataUserEdit, setdataUserEdit] = useState({});

    const [isShowModalDelete, setisShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState(false);

    const [sortBy, setSortBy] = useState("asc");
    const [sortField, serSortField] = useState("id");

    const [keyword, setkeyword] = useState("");

    const [dataExport, setDataExport] = useState([]);

    const handleClose = () => {
        setisShowModelAddNew(false);
        setisShowModelEditUser(false);
        setisShowModalDelete(false);
    }

    const handleUpdateTable = (user) => {
        setListUsers([user, ...listusers])
    }

    const handleEditUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listusers);
        let index = listusers.findIndex((item => item.id === user.id))
        cloneListUsers[index].first_name = user.first_name;
        setListUsers(cloneListUsers);
    }


    useEffect(() => {
        getUsers(1);
    }, [])

    const getUsers = async (page) => {
        let res = await fetchAllUser(page);
        if (res && res.data) {
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPages(res.total_pages);
        }
    }

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1);
    }

    const handleEditUser = (user) => {
        setdataUserEdit(user);
        setisShowModelEditUser(true);
    }
    const handleDeleteUser = (user) => {
        setisShowModalDelete(true);
        setDataUserDelete(user);
    }

    const handleDeleteUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listusers);
        cloneListUsers = cloneListUsers.filter(item => item.id !== user.id)
        setListUsers(cloneListUsers);
    }
    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        serSortField(sortField);
        let cloneListUsers = _.cloneDeep(listusers);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setListUsers(cloneListUsers);
    }

    const handleSearch = (event) => {
        let term = event.target.value;
        if (term) {
            let cloneListUsers = _.cloneDeep(listusers);
            cloneListUsers = cloneListUsers.filter(item => item.email.includes(term));
            setListUsers(cloneListUsers);
        } else {
            getUsers(1);
        }
    }
    const getUsersExport = (event, done) => {
        let result = [];
        if (listusers && listusers.length > 0) {
            result.push(["Id", "Email", "Firt name", "Last name"])
            listusers.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.first_name;
                arr[3] = item.last_name;
                result.push(arr);
            })
            setDataExport(result);
            done();
        }
    }

    const handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            if (file.type !== "text/csv") {
                toast.error("Only access csv files ...")
                return;
            }
            Papa.parse(file, {
                // header: true,
                complete: function (results) {
                    let rawCSV = results.data;
                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 3) {
                            if (rawCSV[0][0] !== "email"
                                || rawCSV[0][1] !== "first_name"
                                || rawCSV[0][2] !== "last_name"
                            ) {
                                toast.error("Wrong format Header CSV file!")
                            } else {
                                let result = [];
                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 3) {
                                        let obj = {};
                                        obj.email = item[0];
                                        obj.first_name = item[1];
                                        obj.last_name = item[2];
                                        result.push(obj);
                                    }
                                })
                                setListUsers(result)
                            }
                        } else {
                            toast.error("Wrong format CSV file!")
                        }
                    } else {
                        toast.error("Not found data on CSV file!")
                    }
                    console.log("Finished:", results.data);
                }
            });
        }

    }
    return (
        <>
            <div className='add-new my-3'>
                <span><b>List Users</b></span>
                <div className='group-btns'>
                    <label htmlFor="test" className='btn btn-warning'>
                        <i className="fa-solid fa-file-import"></i> Import
                    </label>
                    <input type='file' id="test" hidden
                        onChange={(event) => handleImportCSV(event)}
                    />

                    <CSVLink
                        data={dataExport}
                        filename={"users.csv"}
                        className="btn btn-primary"
                        asyncOnClick={true}
                        onClick={getUsersExport}
                    >
                        <i className="fa-solid fa-circle-down"></i> Export
                    </CSVLink>

                    <button className='btn btn-success'
                        onClick={() => setisShowModelAddNew(true)}
                    > <i className="fa-solid fa-circle-plus"></i>  Add new</button>
                </div>
            </div>
            <div className='col-4 my-3'>
                <input
                    className='form-control'
                    placeholder='Search user by email...'
                    // value={keyword}
                    onChange={(event) => handleSearch(event)}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <div className='sort-header'>
                                <span>ID</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-up"
                                        onClick={() => handleSort("asc", "id")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-down"
                                        onClick={() => handleSort("desc", "id")}
                                    ></i>
                                </span>
                            </div>

                        </th>
                        <th>Email</th>
                        <th>
                            <div className='sort-header'>
                                <span>First Name</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-up"
                                        onClick={() => handleSort("asc", "first_name")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-down"
                                        onClick={() => handleSort("desc", "first_name")}
                                    ></i>
                                </span>
                            </div>

                        </th>
                        <th>Last Name</th>
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        listusers && listusers.length > 0 &&
                        listusers.map((item, index) => {
                            return (
                                <tr key={`users-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>
                                        <button className='btn btn-warning mx-3'
                                            onClick={() => handleEditUser(item)}
                                        >Edit</button>
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => handleDeleteUser(item)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />

            <ModalAddNew
                show={isShowModelAddnew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />
            <ModelEditUser
                show={isShowModelEditUser}
                dataUserEdit={dataUserEdit}
                handleClose={handleClose}
                handleEditUserFromModal={handleEditUserFromModal}

            />
            <ModalConfirm
                show={isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteUserFromModal={handleDeleteUserFromModal}
            />
        </>
    )
}

export default TableUsers;