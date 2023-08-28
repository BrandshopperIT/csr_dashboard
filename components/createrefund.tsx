// @ts-nocheck
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
// import { Calendar } from 'primereact/calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';
import styles from './styles/Createrefund.module.css';

export default function Createrefund() {
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

  const formatDate = (date) => {
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
  const handleDateReqChange = (date) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, reqdate: date }));
    setreqStartDate(date);
    // setSelectedreqDate(date);
  };

  //DATErefundedby
  const [refstartDate, setrefStartDate] = useState(new Date());
  // const [selectedrefDate, setSelectedrefDate] = useState(null);
  const handleDateRefChange = (date) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, date_refund: date }));
    setrefStartDate(date);
  };

  const [form, setform] = useState({
    status: 'Open',
    reqdate: reqstartDate,
    ordernumber: '',
    refund_amount: '',
    source: '',
    requestedbyId: null,
    date_refund: refstartDate,
    amount_refund: '',
    refundedbyId: null,
    notes: '',
    disabled: false,
  });

  const ordernameerr = () => {
    return (
      <Alert key='warning' variant='warning'>
        This is a warning alert—check it out!
      </Alert>
    );
  };

  function updateForm(value: any) {
    return setform((prev) => {
      return { ...prev, ...value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = { ...form };
    const newrd = formatDate(formData.reqdate);
    const newd_r = formatDate(formData.date_refund);

    // TODO:Fixed date for unres. Fix up form verifiction and make changes to ref
    // const newd_s
    if (typeof formData.reqdate != 'string') {
      formData.reqdate = newrd;
    }
    if (typeof formData.date_refund != 'string') {
      formData.date_refund = newd_r;
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
      formData.refundedbyId === null ||
      isNaN(formData.refundedbyId) === true
    ) {
      console.log('refISNONE');
      setrefshow(true);
      setTimeout(() => {
        setrefshow(false);
      }, 8000);
    } else {
      console.log(formData);
      await fetch(endpoint + '/api/refund', {
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
          <option value='Closed' key='Closed'>
            Closed
          </option>
        </Form.Control>
        <br />

        <Form.Label>Order Number</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ ordernumber: e.target.value })}
        />
        <br />

        <br />
        <br />
        <Form.Label>Requested Date: &nbsp;</Form.Label>
        <DatePicker
          selected={reqstartDate}
          onChange={handleDateReqChange}
          dateFormat='MM/dd/yyyy'
        />

        <br />
        <br />

        <br />
        <br />

        <Form.Label>Refund Amount</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ refund_amount: e.target.value })}
        />
        <br />
        <Form.Label>Source</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ source: e.target.value })}
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
        <Form.Label>Date Refunded: &nbsp;</Form.Label>
        <DatePicker //TODO: FIXTHISWHENBACKFROMLUNCH
          selected={refstartDate}
          onChange={handleDateRefChange}
          dateFormat='MM/dd/yyyy'
        />
        <br />

        <Form.Label>Amount Refund</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ refund_amount: e.target.value })}
        />
        <br />

        <Form.Label>Refunded By</Form.Label>
        <Form.Control
          as='select'
          aria-label='Auditor Select'
          onChange={(e) =>
            updateForm({ refundedbyId: parseInt(e.target.value) })
          }
        >
          <option>Choose User</option>
          {reps.map((r) =>
            r.active ? <option value={r.id}>{r.rep_name}</option> : null
          )}
        </Form.Control>
        <br />

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
