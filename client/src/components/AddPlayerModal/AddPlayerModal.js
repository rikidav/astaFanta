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
    MDBTextArea,
    MDBRadio, MDBBtnGroup, MDBRow
} from 'mdb-react-ui-kit';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useEth } from '../../contexts/EthContext'


const AddPlayerModal = ({ show, setShow }) => {
    const [player, setPlayer] = useState({ "name": "", "team": "", "number": "", "position": "" })
    const [error, setError] = useState(false);
    const { state: { contract, accounts } } = useEth();
    const [posPlayer, setPosPlayer] = useState(0)


    const handleSubmit = () => {
        async function sendData() {
            console.log(JSON.stringify(player));
            await contract.methods.openNewAuction(JSON.stringify(player), posPlayer).send({ from: accounts[0] });//deve essere aggiunto il ruolo
            setPlayer({ "name": "", "team": "", "number": "", "position": "" })
        }
        if ((player["name"].length > 0) && (Number(player["number"]) > 0)) {
            sendData();
            setError(false);
        } else {
            setError(true)
        }
    }

    const [value, setValue] = React.useState('female');

    const handleChange2 = (event) => {
        const { name, value } = event.target;
        setPosPlayer(value);
        
        setPlayer({ ...player, [name]: value })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlayer({ ...player, [name]: value })
    }

    const changeColor = () => {
        document.querySelector('input[name="PlayerSelector"]:checked').btnColor = "#ffffff";
    }
    return (
        <MDBModal show={show} setShow={setShow} >
            <MDBModalDialog centered size='md'>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle> <MDBIcon fas icon="plus" size="lg" /><b className='ms-2'>Add a new player</b></MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={() => { setShow(false) }}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody style={{ backgroundColor: "#E3F2FD" }}>
                        <div className='container-fluid bd-example-row'>
                            
                            <div className='row mt-3 d-flex justify-content-center text-center'>
                            <label className='mt-2 mb-2 fs-4 text-center'><b>Enter the player's data</b></label>
                                <div className='col-md-10'>
                                    <MDBInput name="name" style={{ backgroundColor: "#FFFFFF" }} label='Name' id='1' type='text' value={player.name} onChange={handleChange} />
                                    <MDBInput name="team" className="mt-3" style={{ backgroundColor: "#FFFFFF" }} label='Team' id='2' type='text' value={player.team} onChange={handleChange} />
                                    <MDBInput name="number" className="mt-3" style={{ backgroundColor: "#FFFFFF" }} label='Number' id='3' type='text' value={player.number} onChange={handleChange} />
                                    {/* <MDBRow className='text-start'>

                                        <label className='mt-2'>Position:</label>
                                    </MDBRow>
                                    <MDBBtnGroup className='mt-2'>
                                        <MDBRadio className='castom-radio' defaultChecked btn btnColor='secondary' id='btn-radio0' name="PlayerSelector" wrapperTag='span' label='goalkeepers' value={0} />
                                        <MDBRadio className='castom-radio' btn btnColor='secondary' id='btn-radio1' name="PlayerSelector" wrapperTag='span' label='defenders' value={1} />
                                        <MDBRadio className='castom-radio' btn btnColor='secondary' id='btn-radio2' name="PlayerSelector" wrapperTag='span' label='midfielders' value={2} />
                                        <MDBRadio className='castom-radio' btn btnColor='secondary' id='btn-radio3' name="PlayerSelector" wrapperTag='span' label='strikers' value={3} />

                                    </MDBBtnGroup> */}
                                    <FormControl>
                                        {/* <FormLabel id="demo-controlled-radio-buttons-group">Position</FormLabel> */}
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={posPlayer}
                                            onChange={handleChange2}
                                        >
                                            <FormControlLabel name="position" value={0} control={<Radio />} label="Goalkeepers" />
                                            <FormControlLabel name="position" value={1} control={<Radio />} label="Defenders" />
                                            <FormControlLabel name="position" value={2} control={<Radio />} label="Midfielders" />
                                            <FormControlLabel name="position" value={3} control={<Radio />} label="Strikers" />
                                        </RadioGroup>
                                    </FormControl>
                                    {error && <label className='mt-2 text-danger'>Errore nei dati</label>}
                                </div>
                                <div >
                                    <MDBBtn id="sendDataBtnE" className='btn-dark btn-rounded mt-3 mb-3' style={{ backgroundColor: "#004AAD" }} type='button' onClick={() => { handleSubmit() }}>Add Player</MDBBtn>
                                </div>
                            </div>
                        </div>
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    )
}

export default AddPlayerModal
