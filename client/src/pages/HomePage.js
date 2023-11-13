import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import Modal from '../components/AddProposalModal/AddProposalModal';
import ModalAW from '../components/AssignWinner/AssignWinner';
import { useEth } from '../contexts/EthContext'
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer, MDBRow, MDBBtn, MDBIcon, MDBCol } from 'mdb-react-ui-kit';


const HomePage = () => {
  const { state: { contract, accounts, owner, auctioneer } } = useEth();
  const [modalData, setModalData] = useState(null); 
  const [modalDataCheck, setModalDataCheck] = useState(false);
  
  const [auctions, setAuctions] = useState([]);
  const [show, setShow] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [aggiorna, setAggiorna] = useState(true);

  const [showAW, setShowAW] = useState(false);
  const [IdAW, setIdAW] = useState(null); 
  const [winnerAW, setWinnerAW] = useState(null); 
  const [proposalAW, setProposalAW] = useState(null);
  const [nameAW, setNameAW]= useState(null);


  useEffect(() => {
    async function getData() {
      if (contract) {
        const auctionsResponse = await contract.methods.getAuctions().call({ from: accounts[0] });
        let data = [];
        let idCount = 0;

        for (const auction of auctionsResponse) {
          const tempAuction = JSON.parse(auction.URI);
          tempAuction.status = auction.status;
          tempAuction.winOffer = auction.winOffer;
          tempAuction.winner = auction.winner;
          tempAuction.id = idCount
          tempAuction.position = auction.position;
          data.push(tempAuction);
          idCount++;
        }
        setAuctions(data);
      }
    }
    getData();
  }, [contract, show, showProposal, aggiorna, showAW])

  const showModal = async(data) => {
    setModalData(data);
    
    
    const verifica =await contract.methods.checkLimitPlayer(data.id).call({ from: accounts[0] });
    console.log('check limit player:' + verifica);
    setModalDataCheck(verifica);
    setShowProposal(true)

  }

  const close = async (id) => {
    const auctionsResponse = await contract.methods.assignWinner(id).send({ from: accounts[0] });
    setAggiorna(!aggiorna)

  }

  const showModalAW = (id,winner,proposal,name) => {
    setIdAW(id)
    setWinnerAW(winner)
    setProposalAW(proposal)
    setNameAW(name)
    setShowAW(true)
  }

  return (

    <MDBContainer fluid>
      <Modal show={showProposal} setShow={setShowProposal} modalData={modalData} check={modalDataCheck}/>
      <ModalAW show={showAW} setShow={setShowAW} id={IdAW} winner={winnerAW} proposal={proposalAW} name={nameAW}/>
      <NavBar show={show} setShow={setShow} />
      <MDBRow className='d-flex justify-content-center mt-5'>
        <MDBCol className="mt-5" size="9">
          <MDBTable striped hover borderColor="primary">
            <MDBTableHead style={{ backgroundColor: '#38B6FF' }}>
              <tr className="text-uppercase fs-5 fw-bold font-monospace">
                <th scope='col'>Player</th>
                <th scope='col'>Team</th>
                <th scope='col'>Number</th>
                <th scope='col'>Position</th>
                <th scope='col'>Status</th>
                <th className='text-center' scope='col'>Offer</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody >
              {auctions.length === 0 &&
                <tr >
                  <td colSpan={6} className='text-center'>Nessun giocatore da mostrare...</td>
                </tr>
              }
              {auctions &&
                auctions.map((object) => {
                  let state = false;
                  if (object.status === '1') {
                    state = true
                  } else { state = false }
                  return (
                    <tr style={{ backgroundColor: object.winner==accounts[0] ? '#90ee90' : '#ffffff' }}>
                      <th scope='row' style={{ fontSize: '15px' }}>{object.name}</th>
                      <td style={{ fontSize: '15px' }}>{object.team}</td>
                      <td style={{ fontSize: '15px' }}>{object.number}</td>
                      <td style={{ fontSize: '15px' }}>{(() => {
                        const positionMapping = {
                          '0': 'goalkeeper',
                          '1': 'defender',
                          '2': 'midfielder',
                          '3': 'striker'
                        };
                        const position = positionMapping[object.position];
                        console.log('Position: ' + position);
                        return position;
                      })()}</td>
                      <td style={{ fontSize: '15px' }}>{object.status === "1" && "Open"}{object.status === "0" && "Close"}</td>
                      <td className=' text-center'>
                      <label className="mr-5" style={{ marginRight: '10px', fontSize: '1.5em' }}>{object.winOffer}</label>
                        {auctioneer && <MDBBtn disabled={!state || object.winOffer==0 } id="closeBtn" floating style={{ backgroundColor: '#004AAD' }} onClick={() => {showModalAW(object.id,object.winner,object.winOffer,object.name)}}>
                          <MDBIcon fas icon="trophy" size="lg" />
                        </MDBBtn>}
                        
                        {!auctioneer && !owner && <MDBBtn disabled={!state} id="SearchBtn" floating style={{ backgroundColor: '#004AAD' }} onClick={() => { showModal(object) }}>
                          <MDBIcon fas icon="plus" size="2x" />
                        </MDBBtn>}

                      </td>
                    </tr>
                  )
                })
              }
            </MDBTableBody>
          </MDBTable>

        </MDBCol>
      </MDBRow>


    </MDBContainer>



  )
}

export default HomePage