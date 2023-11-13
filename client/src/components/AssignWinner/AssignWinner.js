import React, { useState } from 'react'
import {
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalBody,
    MDBModalTitle,
    MDBIcon,
    MDBBtn,
    MDBInput,
    MDBTextArea
} from 'mdb-react-ui-kit';
import { useEth } from '../../contexts/EthContext'

const AssignWinner = ({ show, setShow, id, winner, proposal, name}) => {

    const { state: { contract, accounts } } = useEth();

    const closeAW = async () => {
        const auctionsResponse = await contract.methods.assignWinner(id).send({ from: accounts[0] });
        setShow(false) 
    
      }




    return (
        <MDBModal show={show} setShow={setShow} >
            <MDBModalDialog centered size='sm'>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle> <MDBIcon fas icon="trophy" size="lg" /><b className='ms-2'>Assign Winner</b></MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={() => { setShow(false) }}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody style={{ backgroundColor: "#E3F2FD" }}>
                        <div className="text-center">
                        <label style={{ fontWeight: "bold", color: "black" }}>Player: {name}</label>
                        
                        </div>
                        <div className="text-center">
                        <label style={{ fontWeight: "bold", color: "black" }}> Offer: {proposal}</label>
                        </div>
                        <div className="text-center">
                           <label style={{ fontWeight: "bold", color: "green" }}>Winner: </label> 
                           <label>{winner}</label>
                        </div>
                        
                        <div className="text-center">
                            <MDBBtn id="assignWinner" className='btn-dark btn-rounded mt-3 mb-3' style={{ backgroundColor: "#004AAD" }} type='button' onClick={() => closeAW()}>Assign Winner</MDBBtn>
                        </div>
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    )
}

export default AssignWinner