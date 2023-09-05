// @ts-nocheck
'use client';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Dock } from 'primereact/dock';
import styles from './styles/DashboardMenuCards.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

export default function DashboardMenuCards() {
  const imgPath = 'images/dock';
  const imgErrorPath =
    'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png';

  const items = [
    {
      label: 'Groups',
      icon: () => (
        <img
          alt='Finder'
          src='/groups.svg'
          onError={(e) => (e.target.src = imgErrorPath)}
          width='100%'
        />
      ),
    },
    {
      label: 'Finder',
      icon: () => (
        <img
          alt='Finder'
          src='/creditcard.svg'
          onError={(e) => (e.target.src = imgErrorPath)}
          width='100%'
        />
      ),
    },
    {
      label: 'App Store',
      icon: () => (
        <img
          alt='App Store'
          src='/dollar.svg'
          onError={(e) => (e.target.src = imgErrorPath)}
          width='50%'
        />
      ),
    },
    {
      label: 'Photos',
      icon: () => (
        <img
          alt='Photos'
          src='/tracer.svg'
          onError={(e) => (e.target.src = imgErrorPath)}
          width='50%'
        />
      ),
    },
    {
      label: 'Trash',
      icon: () => (
        <img
          alt='trash'
          src='/truck.svg'
          onError={(e) => (e.target.src = imgErrorPath)}
          width='100%'
        />
      ),
    },
  ];


  const cardcss = () => {}
  const [showtracer,setshowtracer] = useState(false)
  const tracershowon = () => setshowtracer(true)
  const tracershowoff = () => setshowtracer(false)

  return (
    <>
      {/* Button Menu Container */}
      <Container
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '160px'
        }}
      >
        <Row>
          
          <Col >
          <a style={{color:'white'}} href='/unres'>
            <Card style={{ width: '14rem' }}  className={styles.thecards}>
              <Card.Img style={{width: '100%' } } src='/groups.svg'></Card.Img>
              <Card.Body>
                <Card.Title>Unresolved Open Accounts</Card.Title>
              
               
              </Card.Body>
            </Card>
            </a>
          </Col>
          
          <Col>
          <a style={{color:'white'}} href='/ccsheet'>
            <Card style={{ width: '14rem' }} className={styles.thecards}>
            <Card.Img src='/creditcard.svg'></Card.Img>
              <Card.Body>
                <Card.Title>CC Sheet</Card.Title>
               
              </Card.Body>
            </Card>
            </a>
          </Col>
          <Col>
          <a style={{color:'white'}} href='/refund'>
            <Card style={{ width: '14rem' }} className={styles.thecards}>
            <Card.Img src='/money.svg'></Card.Img>

              <Card.Body>
                <Card.Title>Refund Sheet</Card.Title>
              
              </Card.Body>
            </Card>
            </a>
          </Col>
          <Col>
          <a style={{color:'white'}} href='tracer'>
            <Card style={{ width: '14rem' }} className={styles.thecards}>
            <Card.Img src='/tracer.svg'></Card.Img>

              <Card.Body>
                <Card.Title >Tracer Request</Card.Title>
               
              </Card.Body>
            </Card>
            </a>
          </Col>
          <Col>
          <a style={{color:'white'}} href='/replacement'>
            <Card style={{ width: '14rem' }} className={styles.thecards}>
            <Card.Img src='/truck.svg'></Card.Img>

              <Card.Body>
                <Card.Title>Replacements Sent</Card.Title>
             
              </Card.Body>
            </Card>
            </a>
          </Col>
        </Row>
      </Container>
    </>
  );
}
