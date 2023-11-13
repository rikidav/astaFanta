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
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';

export default function App() {

    const [basicModal, setBasicModal] = useState(false);
    const[aggiorna,setAggiorna]=useState(true);
    const [auctionerAddress, setAuctionerAddress] = useState('')

    const toggleShow = () => { setBasicModal(!basicModal); setAuctionerAddress('') }
    const { state: { contract, accounts, AUCTIONER_ROLE } } = useEth();
    const [arrayAudictioneers, setArrayAudictioneers] = useState([]);//array che contiene gli auctioneers


    useEffect(() => {


        async function getAuctioner() {
            if (contract) {
                try {
                    const numAuctioneer = await contract.methods.getRoleMemberCount(AUCTIONER_ROLE).call({ from: accounts[0] });
                    setArrayAudictioneers([]);
                    for (let index = 0; index < Number(numAuctioneer); index++) { 
                        const addressAuctioner = await contract.methods.getRoleMember(AUCTIONER_ROLE, index).call({ from: accounts[0] });
                        console.log(addressAuctioner);
                        setArrayAudictioneers(prevArray => [...prevArray, addressAuctioner]);//modo comune per aggiornare dinamicamente un array in React
                    }

                } catch (error) {
                    console.error("Errore: " + error.message);
                }

            } else {
                console.log("contract non è definitio");
            }

        }

        getAuctioner();


    }, [aggiorna]) 



    const handleSubmit = async () => {
        async function sendData() {
            if (contract) {//contract è come se all'inizio non è definito
                try {
                    console.log('auctionerAddress' + auctionerAddress);
                    await contract.methods.grantRole(AUCTIONER_ROLE, auctionerAddress).send({ from: accounts[0] });
                    console.log('auctioner::' + await contract.methods.isAuctioneer(auctionerAddress).call({ from: accounts[0] }));
                    setAuctionerAddress('');
                    setAggiorna(!aggiorna)
                } catch (error) {
                    // Gestisci gli errori qui, ad esempio mostrando un messaggio di errore all'utente o registrando l'errore.
                    console.error("Si è verificato un errore:", error);
                }



            }


        };
        await sendData();

    }

    const removeAuctioner=async(address)=>{
        try{
            const numAuctioneer = await contract.methods.revokeRole(AUCTIONER_ROLE,address).send({ from: accounts[0] });
            setAggiorna(!aggiorna)
        }catch(error){
            console.error(error)
        }

    }

    return (
        <>
            <MDBBtn className='btn-dark btn-rounded btn-lg mt-3 d-flex align-items-center' style={{ backgroundColor: "#38B6FF" }} type='button' id="Aggiungi" onClick={toggleShow}><MDBIcon className='me-2 shadow' size="2x" fas icon="plus-circle" />ADD AUCTIONEER</MDBBtn>

            <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle >AUCTIONEERS</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            {/* <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="form-group" style={{ textAlign: 'center' }}>
                                    <label htmlFor="myInput" style={{ fontWeight: 'bold' }}>
                                        auctioneer
                                    </label>
                                    <input
                                        type="text"
                                        id="myInput"
                                        value={auctionerAddress}
                                        onChange={(e) => setAuctionerAddress(e.target.value)}
                                        style={{ padding: '5px', border: '1px solid #ccc', marginLeft: '10px' }}
                                    />

                                </div>
                                {arrayAudictioneers.map((str, index) => (
                                    <div className="form-group" style={{ textAlign: 'center' }} key={index}>
                                        <label htmlFor="myInput" style={{ fontWeight: 'bold' }} >{str}</label>
                                    </div>
                                ))}
                            </div> */}
                            <label className='text-start mb-2' style={{color:"green","font-size":"100%"}}><b>Add auctioner</b></label>
                            <MDBRow className='mb-4'>
                                <MDBCol size="9">
                                    <MDBInput  label='Auctioner address' id="inputAuctioner" type='text' value={auctionerAddress} onChange={(e) => setAuctionerAddress(e.target.value)} />
                                </MDBCol>
                                <MDBCol size="3">
                                    <MDBBtn className='mx-2' tag='a' color='success' floating onClick={() => { handleSubmit() }}>
                                    <MDBIcon  fas icon='plus' size='2x'/>
                                    </MDBBtn>
                                </MDBCol>
                            </MDBRow>
                            <label className='text-start mb-2' style={{"font-size":"100%"}}><b>Auctioners: </b></label>
                            {arrayAudictioneers&&
                            arrayAudictioneers.map((element)=>{
                                return(
                                <MDBRow className='mt-2'>
                                    <MDBCol size="1" className=' d-flex align-items-center text-end'>
                                        <MDBIcon fas icon="gavel" />
                                    </MDBCol>
                                    <MDBCol className=' d-flex align-items-center' size="8">
                                        {element}   
                                    </MDBCol>
                                    <MDBCol size="2">
                                        <MDBBtn className='mx-2' tag='a' color='danger' floating onClick={()=>{removeAuctioner(element)}}>
                                            <MDBIcon fas icon="minus" size='2x' />
                                        </MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                                )
                            })
                            }

                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}