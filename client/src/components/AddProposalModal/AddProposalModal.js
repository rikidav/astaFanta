import React,{useState} from 'react'
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

const AddProposalModal = ({show,setShow,modalData,check}) => {
    const[proposal,setProposal]=useState("")
    const[error,setError]=useState(false)
    const { state: { contract, accounts } } = useEth();


    const handleChange=(e)=>{
        const {name,value}=e.target;
        setProposal(value)
    }

    const handleSubmit=async()=>{
        if(proposal>modalData.winOffer){
            setError(false);
            //setProposal(""); //prima stava qua non dovrebbe essere minore?
            console.log('proposal: ', proposal)
            const verifica =await contract.methods.checkLimitPlayer(modalData.id).call({ from: accounts[0] });
            //console.log('checkLimitPlayer: ' + verifica)
            if(verifica){
                await contract.methods._newProposal(proposal,modalData.id).send({ from: accounts[0] });
            setProposal(""); 
            setShow(false);
            } else {
                setShow(false);
            }
            
        }else{
            setError(true);
        }
    }

  return (
    <MDBModal show={show} setShow={setShow} >
        <MDBModalDialog  centered size='sm'>
            <MDBModalContent>
            <MDBModalHeader>
                <MDBModalTitle> <MDBIcon fas icon="info-circle" size="lg" /><b className='ms-2'>Add a new proposal</b></MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={()=>{setShow(false)}}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody style={{backgroundColor:"#E3F2FD"}}>
            <div className='container-fluid bd-example-row'>
                
                <div className='row mt-3 d-flex justify-content-center text-center'>
                    <div className='col-md-8'>
                        <label className='mt-2 mb-2 fs-4'><b>Winning proposal: {modalData&&modalData.winOffer}</b></label>
                        <MDBInput onChange={handleChange} name="proposta" style={{backgroundColor:"#FFFFFF"}} label='Proposta' id='1' type='text' value={proposal}  />
                        {error&&<label className='mt-2 text-danger'>The proposal is lower than the winning one.</label>}
                        {!check && <label className='mt-2 text-danger'>Player limit exceeded</label>}
                    </div>
                    <div >
                        <MDBBtn disabled={!check} id="sendDataBtnE"className='btn-dark btn-rounded mt-3 mb-3'  style={{backgroundColor:"#004AAD"}} type='button' onClick={handleSubmit}>Invia proposta</MDBBtn>
                    </div>
                </div>
            </div>
            </MDBModalBody>
            </MDBModalContent>
        </MDBModalDialog>
    </MDBModal>
  )
}

export default AddProposalModal