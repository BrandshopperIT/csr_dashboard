// @ts-nocheck
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Toast from 'react-bootstrap/Toast';
import styles from './styles/Createccsheet.module.css';

export default function Createccsheet() {
  const endpoint = process.env.NEXT_PUBLIC_DB_API;
  const [ordershow, setordershow] = useState(false);
  const orderhandleclose = () => setordershow(false);
  const [reps, setrep] = useState([]);
  const [reqshow, setreqshow] = useState(false);
  const reqhandleclose = () => setreqshow(false);
  const [refshow, setrefshow] = useState(false);
  const refhandleclose = () => setrefshow(false);

  async function fetchdata() {
    const data = await fetch(endpoint + '/api/reps');
    const js_data = await data.json();
    setrep(js_data);
  }

  useEffect(() => {
    fetchdata();
  }, []);

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const newdate = `${month}/${day}/${year}`;
    console.log(newdate);
    return newdate;
  };

  //DATEdatereq
  const [reqstartDate, setreqStartDate] = useState(new Date());
  // const [selectedreqDate, setSelectedreqDate] = useState(null);
  const handleDateReqChange = (date: any) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, reqdate: date }));
    setreqStartDate(date);
    // setSelectedreqDate(date);
  };

  //DATEexpiration
  const [expirationstartDate, setexpirationStartDate] = useState(new Date());
  // const [selectedrefDate, setSelectedrefDate] = useState(null);
  const handleDateExpirationChange = (date: any) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, expiration: date }));
    setexpirationStartDate(date);
  };
  //DATEauthstart
  const [authstartDate, setauthStartDate] = useState(new Date());
  // const [selectedrefDate, setSelectedrefDate] = useState(null);
  const handleDateAuthChange = (date: any) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, authdate: date }));
    setauthStartDate(date);
  };

  const [form, setform] = useState({
    status: 'New',
    reqdate: reqstartDate,
    ordernumber: '',
    amountdue: '',
    channel: '',
    requestedbyId: null,
    cardholdername: '',
    cardnum: '',
    expiration: expirationstartDate,
    cvc: '',
    authdate: authstartDate,
    processedbyid: null,
    notes: '',
    disabled: false,
  });

  function updateForm(value: any) {
    return setform((prev) => {
      return { ...prev, ...value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = { ...form };
    const newrd = formatDate(formData.reqdate);
    const newd_auth = formatDate(formData.authdate);
    const newd_exp = formatDate(formData.expiration);

    // TODO:Fixed date for unres. Fix up form verifiction and make changes to ref
    // const newd_s
    if (typeof formData.reqdate != 'string') {
      formData.reqdate = newrd;
    }
    if (typeof formData.authdate != 'string') {
      formData.authdate = newd_auth;
    }
    if (typeof formData.expiration != 'string') {
      formData.expiration = newd_exp;
    }

    if (formData.ordernumber === '') {
      console.log('ORDERisNONE');
      setordershow(true);
      setTimeout(() => {
        setordershow(false);
      }, 8000);
    } else if (
      formData.requestedbyId === null ||
      isNaN(formData.requestedbyId) === true
    ) {
      console.log('reqISNONE');
      setreqshow(true);
      setTimeout(() => {
        setreqshow(false);
      }, 8000);
    } else if (
      formData.processedbyid === null ||
      isNaN(formData.processedbyid) === true
    ) {
      console.log('processedISNONE');
      setrefshow(true);
      setTimeout(() => {
        setrefshow(false);
      }, 8000);
    } else {
      console.log(formData);
      await fetch(endpoint + '/api/ccsheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).catch((error) => {
        window.alert(error);
        return;
      });
      window.location.reload();
    }
  }

  return (
    <>
      <Form>
        <Form.Label>Status</Form.Label>
        <Form.Control
          as='select'
          aria-label='Status'
          onChange={(e) => updateForm({ status: e.target.value })}
        >
          <option value='Open' key='Open'>
            Open
          </option>
          <option value='Pending' key='Pending'>
            Pending
          </option>
          <option value='Closed' key='Closed'>
            Closed
          </option>
        </Form.Control>
        <br />
        <Form.Label>Requested Date: &nbsp;</Form.Label>
        <DatePicker
          selected={reqstartDate}
          onChange={handleDateReqChange}
          dateFormat='MM/dd/yyyy'
        />

        <br />
        <br />

        <Form.Label>Order Number</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ ordernumber: e.target.value })}
        />
        <br />
        <br />

        <Form.Label>Amount Due</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ amountdue: e.target.value })}
        />
        <br />
        <Form.Label>Channel</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ channel: e.target.value })}
        />
        <br />

        <Form.Label>Requested By</Form.Label>

        <Form.Control
          as='select'
          aria-label='Rep Select'
          onChange={(e) =>
            updateForm({ requestedbyId: parseInt(e.target.value) })
          }
        >
          <option>Choose User</option>

          {reps.map((r) =>
            r.active ? <option value={r.id}>{r.rep_name}</option> : null
          )}
        </Form.Control>
        <br />
        <br />
        <Form.Label>Cardholder Name</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ cardholdername: e.target.value })}
        />
        <br />

        <Form.Label>Card Number</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ cardnum: e.target.value })}
        />
        <br />

        <br />
        <Form.Label>Expiration Date: &nbsp;</Form.Label>
        <DatePicker
          selected={expirationstartDate}
          onChange={handleDateExpirationChange}
          dateFormat='MM/dd/yyyy'
        />

        <br />
        <br />
        <br />
        <Form.Label>CVC</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ cvc: e.target.value })}
        />
        <br />

        <Form.Label>Authentication Date: &nbsp;</Form.Label>
        <DatePicker
          selected={authstartDate}
          onChange={handleDateAuthChange}
          dateFormat='MM/dd/yyyy'
        />

        <br />
        <br />

        <Form.Label>Processed By</Form.Label>
        <Form.Control
          as='select'
          aria-label='Rep Select'
          onChange={(e) =>
            updateForm({ processedbyid: parseInt(e.target.value) })
          }
        >
          <option>Choose User</option>
          {reps.map((r) =>
            r.active ? <option value={r.id}>{r.rep_name}</option> : null
          )}
        </Form.Control>
        <br />

        <Form.Label>Notes</Form.Label>
        <Form.Control
          as='textarea'
          rows={7}
          type='text'
          onChange={(e) => updateForm({ notes: e.target.value })}
        />
        <Button variant='primary' onClick={handleSubmit}>
          Submit
        </Button>
      </Form>

      <Toast
        show={ordershow}
        onClose={orderhandleclose}
        className={styles.orderalert}
      >
        <Toast.Header>
          <strong className='me-auto'>Attention!</strong>
        </Toast.Header>
        <Toast.Body>
          'Order Number' is empty. Please enter an order number.
        </Toast.Body>
      </Toast>
      <Toast
        show={reqshow}
        onClose={reqhandleclose}
        className={styles.reqalert}
      >
        <Toast.Header>
          <strong className='me-auto'>Attention!</strong>
        </Toast.Header>
        <Toast.Body>
          'Requested By' is empty. Please make a selection.
        </Toast.Body>
      </Toast>
      <Toast
        show={refshow}
        onClose={refhandleclose}
        className={styles.refalert}
      >
        <Toast.Header>
          <strong className='me-auto'>Attention!</strong>
        </Toast.Header>
        <Toast.Body>
          'Refunded by' is empty. Please make a selection.
        </Toast.Body>
      </Toast>
    </>
  );
}
