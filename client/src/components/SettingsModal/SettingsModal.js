import React, { useState, useEffect } from 'react'

import { useEth } from '../../contexts/EthContext'


import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBIcon
} from 'mdb-react-ui-kit';

export default function App() {

    const [basicModal, setBasicModal] = useState(false);
    const [num_1, setNum_1] = useState(0);
    const [num_2, setNum_2] = useState(0);
    const [num_3, setNum_3] = useState(0);
    const [num_4, setNum_4] = useState(0);
    
    const toggleShow = () => setBasicModal(!basicModal);
    const { state: { contract, accounts } } = useEth();



    useEffect(() => {
        console.log('sono in useEffect')
        
            async function getRole() {
                if ( contract) {//contract è come se all'inizio non è definito
                const getAuctionsResponse = await contract.methods.getRole().call({ from: accounts[0] });
                setNum_1(Number(getAuctionsResponse[0]));
                setNum_2(Number(getAuctionsResponse[1]));
                setNum_3(Number(getAuctionsResponse[2]));
                setNum_4(Number(getAuctionsResponse[3]));
                console.log('typeof' + typeof (num_1));
                }
            }
        
        getRole();
    },[contract])//se non metto contract qua non funziona



    const handleSubmit = async () => {
        async function sendData() {
            // const num_gk = Number(num_1);
            // const num_df = Number(num_2);
            // const num_md = Number(num_3);
            // const num_st = Number(num_4);
            await contract.methods.setRoleAuction(Number(num_1), Number(num_2), Number(num_3), Number(num_4)).send({ from: accounts[0] });
        };
        await sendData();

    }

    const handleChange = (e) => {

    }

    return (
        <>
            <MDBBtn className='btn-dark btn-rounded btn-lg mt-3 d-flex align-items-center' style={{ backgroundColor: "#38B6FF" }} type='button' id="Aggiungi" onClick={toggleShow}><MDBIcon className='me-2 shadow' size="2x" fas icon="plus-circle" />SETTINGS</MDBBtn>

            <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Settings</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            
                            <div className="form-group row d-flex justify-content-center align-items-center">
                                <label htmlFor="goalkeepers" className="col-sm-4 col-form-label">Max number goalkeepers</label>
                                <div className="col-sm-2">
                                    <input type="number" value={num_1} min="1" max="3" id="goalkeepers" className="form-control" onChange={e => setNum_1(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group row d-flex justify-content-center align-items-center">
                                <label htmlFor="defenders" className="col-sm-4 col-form-label">Max number defenders</label>
                                <div className="col-sm-2">
                                    <input type="number" value={num_2} min="1" max="8" id="defenders" className="form-control" onChange={e => setNum_2(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row d-flex justify-content-center align-items-center">
                                <label htmlFor="midfielders" className="col-sm-4 col-form-label">Max number midfielders</label>
                                <div className="col-sm-2">
                                    <input type="number" value={num_3} min="1" max="8" id="midfielders" className="form-control" onChange={e => setNum_3(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row d-flex justify-content-center align-items-center">
                                <label htmlFor="strikers" className="col-sm-4 col-form-label">Max number strikers</label>
                                <div className="col-sm-2">
                                    <input type="number" value={num_4} min="1" max="6" id="strikers" className="form-control" onChange={e => setNum_4(e.target.value)} />
                                </div>
                            </div>



                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={toggleShow}>
                                Close
                            </MDBBtn>
                            {/* <MDBBtn color='secondary' onClick={() => {toggleShow; resetValueModal;}}>
                                Close
                            </MDBBtn> */}
                            <MDBBtn onClick={() => { handleSubmit() }}>Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}