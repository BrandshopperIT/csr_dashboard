// @ts-nocheck
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import UnauthorizedComponent from '@/components/UnauthorizedComponent';
import Header from '@/components/header';
import SpinnerComponent from '@/components/SpinnerComponent';
import { useEffect, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Dock } from 'primereact/dock';
import styles from '../styles/Setting.module.css';
import user from '../../public/newuser.svg';
import Image from 'next/image';
import { NextResponse } from 'next/server';
import Accordion from 'react-bootstrap/Accordion';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { Menubar } from 'primereact/menubar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSession } from 'next-auth/react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { format } from 'path';
import { Spinner } from 'react-bootstrap';

export default function Setting() {
  const [updatedata, setupdatedata] = useState({});
  const [loggedinuser, setloggedinuser] = useState({});
  const [user, setuser] = useState({});
  const { data: session, status } = useSession();
  const [loading, setloading] = useState(true);
  const endpoint = process.env.NEXT_PUBLIC_DB_API;

  const [state, setState] = useState({
    hex: loggedinuser.dt_color,
    rgb: { a: loggedinuser.dt_opacity },
  });
  const [statefont, setStatefont] = useState({
    hex: loggedinuser.dt_font,
    rgb: { a: 100 },
  });

  async function fetchData() {
    const data = await fetch(endpoint + '/api/reps');
    const reps = await data.json();
    setreps(reps);
    setuser(session?.user);

    for (let i = 0; i < reps.length; i++) {
      console.log(session?.user);

      // console.log(user?.email);
      console.log(reps[i].email);
      console.log(session?.user?.email);

      if (reps[i].email === session?.user?.email) {
        setloggedinuser(reps[i]);
        console.log(reps[i]);
      }
    }
    console.log(loggedinuser);
    setmenubarcolor(loggedinuser.dt_color);
    console.log(menubarcolor);

    setTimeout(function () {
      setloading(false);
    }, 200);
  }

  async function handlesubmit() {
    const formdata = { ...form };
    const { recordId, ...data } = updatedata;

    const formattedData = {
      id: { id: recordId },
      data: { ...data },
    };

    await fetch(endpoint + '/api/reps', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    }).catch((error) => {
      window.alert(error);
      return;
    });

    console.log(formattedData);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  //'updateform' is triggered every time the state of a form input is changed. When this happens. it sends the value from the field and the record ID.
  // From here, we then update 'updatedata' json usestate with our record id and the addition of our new value.
  function updateForm(value: any, recordId: any) {
    return setupdatedata((prev) => {
      return { recordId, ...prev, ...value };
    });
  }

  const [form, setForm] = useState({
    rep_name: '',
    initials: '',
    active: '',
    email: '',
  });
  const [openuser, setopenuser] = useState(false);
  const [customize, setcustomize] = useState(false);

  const [position, setPosition] = useState('bottom');
  const [reps, setreps] = useState([]);
  const handleClose = () => setopenuser(false);
  const handleClosecustomize = () => setcustomize(false);
  const [menubarcolor, setmenubarcolor] = useState();

  const [positionpicker, setPositionpicker] = useState({ x: 0, y: 0 });
  const [positionpickerfont, setPositionpickerfont] = useState({ x: 0, y: 0 });

  const handleChangeComplete = (color, event) => {
    console.log(color);
    console.log(color.rgb.a);

    setState({
      hex: color.hex,
      rgb: { a: color.rgb.a },
    });
    console.log(state);
    setPositionpicker({ x: event.pageX, y: event.pageY });
  };
  const handleChangeCompletefont = (color, event) => {
    console.log(color);
    console.log(color.rgb.a);

    setStatefont({
      hex: color.hex,
      rgb: { a: color.rgb.a },
    });
    console.log(statefont);
    setPositionpickerfont({ x: event.pageX, y: event.pageY });
  };

  // const [state, setState] = useState('#ffffff');
  // const [positionpicker, setPositionpicker] = useState({ x: 0, y: 0 });
  // const handleChangeComplete = (color, event) => {
  //   console.log(color.hex);
  //   setState(color.hex);
  //   setPositionpicker({ x: event.pageX, y: event.pageY });
  // };

  const renderHeader = () => {
    return (
      <div className='flex justify-content-end'>
        <span className='p-input-icon-left'>
          <h2 className={styles.mainname}>Unresolved Open Accounts</h2>
        </span>
      </div>
    );
  };

  const items = [
    {
      label: 'Users',
      icon: () => <img alt='Users' src='user.svg' width='90%' height='90%' />,
      command: () => {
        setopenuser(true);
      },
    },
    
  ];

  const itemsMenu: MenuItem[] = [
    {
      label: 'Unresolved Open Accounts',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/unres',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/unres/archived',
        },
      ],
      className: 'text-green-500',
    },
    {
      label: 'CC Sheet',
      icon: 'pi pi-fw pi-credit-card',
      url: '/ccsheet',
    },
    {
      label: 'Refund Sheet',
      icon: 'pi pi-fw pi-dollar',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/refund',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/refund/archived',
        },
      ],
    },
    {
      label: 'Tracer Request',
      icon: 'pi pi-fw pi-map-marker',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/tracer',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/tracer/archived',
        },
      ],
    },
    {
      label: 'Replacements Sent',
      icon: 'pi pi-fw pi-truck',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/replacement',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/replacement/archived',
        },
      ],
    },
  ];

  return (
    <>
      {loading ? (
        <Spinner animation='border' className={styles.loading} role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      ) : (
        <>
          <Header />

          <div className='card dock-demo'>
            <div
              className='dock-window'
              style={{
                backgroundImage:
                  'url(https://primefaces.org/cdn/primereact/images/dock/window.jpg)',
              }}
            >
              <Modal show={openuser} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Accordion>
                    <Accordion.Item eventKey='0'>
                      <Accordion.Header>Active Users</Accordion.Header>
                      <Accordion.Body>
                        <Accordion>
                          {reps
                            .filter((rep) => rep.active === true)
                            .map((rep, index) => (
                              <Accordion.Item eventKey={index.toString()}>
                                <Accordion.Header>
                                  {rep.rep_name}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <Form>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                      defaultValue={rep.rep_name}
                                      onChange={(e) =>
                                        updateForm(
                                          { rep_name: e.target.value },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                      defaultValue={rep.email}
                                      disabled={true}
                                      onChange={(e) =>
                                        updateForm(
                                          { email: e.target.value },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Form.Label>Initials</Form.Label>
                                    <Form.Control
                                      defaultValue={rep.initials}
                                      onChange={(e) =>
                                        updateForm(
                                          { initials: e.target.value },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Form.Check
                                      type='switch'
                                      label='Active'
                                      defaultChecked={true}
                                      onChange={(e) =>
                                        updateForm(
                                          { active: e.target.checked },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Button
                                      variant='primary'
                                      onClick={handlesubmit}
                                    >
                                      Update
                                    </Button>
                                  </Form>
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                        </Accordion>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <Accordion>
                    <Accordion.Item eventKey='0'>
                      <Accordion.Header>Archived Users</Accordion.Header>
                      <Accordion.Body>
                        <Accordion>
                          {reps
                            .filter((rep) => rep.active === false)
                            .map((rep, index) => (
                              <Accordion.Item eventKey={index.toString()}>
                                <Accordion.Header>
                                  {rep.rep_name}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <Form>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                      defaultValue={rep.rep_name}
                                      onChange={(e) =>
                                        updateForm(
                                          { rep_name: e.target.value },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                      defaultValue={rep.email}
                                      disabled={true}
                                      onChange={(e) =>
                                        updateForm(
                                          { email: e.target.value },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Form.Label>Initials</Form.Label>
                                    <Form.Control
                                      defaultValue={rep.initials}
                                      onChange={(e) =>
                                        updateForm(
                                          { initials: e.target.value },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Form.Check
                                      type='switch'
                                      label='Active'
                                      defaultChecked={false}
                                      onChange={(e) =>
                                        updateForm(
                                          { resub: e.target.checked },
                                          rep.id
                                        )
                                      }
                                    />

                                    <Button
                                      variant='primary'
                                      onClick={handlesubmit}
                                    >
                                      Update
                                    </Button>
                                  </Form>
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                        </Accordion>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='secondary' onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant='primary' onClick={handleClose}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* //PLANNED TO IMPLEMENT A CUSTOM COLOR SCHEME FEATURE BUT RAN OUT OF TIME */}
              {/* <div className={styles.customModaldiv}>
                <Modal
                  show={customize}
                  className={styles.customModal}
                  onHide={handleClosecustomize}
                >
                  <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'Helvetica' }}>
                      Customize
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {' '}
                    <h2></h2>
                    <div className={styles.sketchPicker}>
                      <h6
                        style={{
                          marginTop: '-22px',
                          marginLeft: '35px',
                          fontFamily: 'Helvetica',
                          position: 'absolute',
                        }}
                      >
                        Menubar/Data Table
                      </h6>
                      <SketchPicker
                        className={styles.sketchPickermenu}
                        color={state}
                        onChangeComplete={handleChangeComplete}
                      />
                      <h6
                        style={{
                          marginTop: '-22px',
                          marginLeft: '325px',
                          fontFamily: 'Helvetica',
                          position: 'absolute',
                        }}
                      >
                        Font
                      </h6>
                      <SketchPicker
                        className={styles.sketchPickerfont}
                        color={statefont}
                        onChangeComplete={handleChangeCompletefont}
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant='primary' onClick={handleClose}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>

              <Modal
                show={customize}
                className={styles.previewModaldt}
                size='xl'
                onHide={handleClosecustomize}
              >
                <Modal.Body>
                  <Navbar
                    expand='lg'
                    style={{
                      backgroundColor: state.hex,
                      opacity: state.rgb.a,
                      marginRight: '0px',
                    }}
                  >
                    <Container>
                      <Navbar.Brand href='#home' style={{ color: 'red' }}>
                        {' '}
                      </Navbar.Brand>
                      <Navbar.Toggle aria-controls='basic-navbar-nav' />
                      <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='me-auto'>
                          <Nav.Link
                            style={{
                              color: statefont.hex,
                              opacity: statefont.rgb.a,
                            }}
                            href='#home'
                          >
                            Unresolved Open Accounts
                          </Nav.Link>
                          <Nav.Link
                            href='#link'
                            style={{
                              color: statefont.hex,
                              opacity: statefont.rgb.a,
                            }}
                          >
                            CC Sheet
                          </Nav.Link>
                          <Nav.Link
                            href='#link'
                            style={{
                              color: statefont.hex,
                              opacity: statefont.rgb.a,
                            }}
                          >
                            Refund Sheet
                          </Nav.Link>
                          <Nav.Link
                            href='#link'
                            style={{
                              color: statefont.hex,
                              opacity: statefont.rgb.a,
                            }}
                          >
                            Tracer Request
                          </Nav.Link>
                          <Nav.Link
                            href='#link'
                            style={{
                              color: statefont.hex,
                              opacity: statefont.rgb.a,
                            }}
                          >
                            Replacements Sent
                          </Nav.Link>
                        </Nav>
                      </Navbar.Collapse>
                    </Container>
                  </Navbar>
                </Modal.Body>
              </Modal> */}
              <Dock model={items} className={styles.dock} position={'left'} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
