import React,{useState} from 'react'
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBBtn,
    MDBNavbarItem,
    MDBDropdown, 
    MDBDropdownMenu, 
    MDBDropdownToggle, 
    MDBDropdownItem,
    MDBIcon,
    MDBNavbarNav,
    MDBRow,
    MDBCol
  } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext'

import Modal from '../AddPlayerModal/AddPlayerModal';
import ModalSettings from '../SettingsModal/SettingsModal';
import ModalAuctioneer from '../SetAuctioneerModal/SetAuctioneerModal';
const NavBar = ({show,setShow}) => {
  const navigate = useNavigate();
  const { state: { owner,auctioneer } } = useEth();
  
  return (
    <>
    <Modal  show={show} setShow={setShow} /> 
      <MDBNavbar  className='shadow-5-strong'style={{ backgroundColor: '#001633' }}> 
        <MDBContainer fluid >     
            <MDBNavbarBrand className='d-flex justify-content-start align-items-center' onClick={()=>navigate('/')}>
            <img
                src='../../../logoFanta.png'
                height='70'
                alt='logo'
              />          
            </MDBNavbarBrand>
            <MDBNavbarItem className='d-flex justify-content-end'>
              {auctioneer&&<MDBBtn className='btn-dark btn-rounded btn-lg mt-3 d-flex align-items-center' style={{backgroundColor:"#38B6FF"}} type='button' id="Aggiungi" onClick={()=>{setShow(true)}}><MDBIcon className='me-2 shadow' size="2x" fas icon="plus-circle" />Add player</MDBBtn>}
              {owner&&<ModalAuctioneer/>}
              {owner&&<ModalSettings/>}
            </MDBNavbarItem>              
        </MDBContainer>
      </MDBNavbar> 
    </>
  )
}

export default NavBar