// ts-nocheck
'use client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

export default function UnauthorizedComponent() {
  return (
    <>
      <Container className='d-flex vh-100'>
        {/* Header */}
        <Row className='m-auto align-self-center'>
          <Col>
            <h1>Access Denied</h1>
            <p>
              Please ensure you have the required roles granted to your
              Brandshopper SSO account.
            </p>
          </Col>
        </Row>

        {/* Cards/buttons */}
        <Row className='m-auto align-self-center'>
          <Col>
            <Card
              style={{
                width: '18rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Card.Body>
                <Card.Title>Return Home</Card.Title>
                <Card.Text>Return back to the main home page.</Card.Text>
                <Button variant='primary' href='/'>
                  Home
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col className='m-auto align-self-center'>
            <Card
              style={{
                width: '18rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Card.Body>
                <Card.Title>Login</Card.Title>
                <Card.Text>Login with your Brandshopper SSO account.</Card.Text>
                <Button variant='primary' href='/api/auth/signin'>
                  Login
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
