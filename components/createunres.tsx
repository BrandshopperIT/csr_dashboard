// @ts-nocheck
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
// import { Calendar } from 'primereact/calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';
import styles from './styles/Createunres.module.css';
import { format } from 'date-fns';
export default function Createunres() {
  const endpoint = process.env.NEXT_PUBLIC_DB_API;
  const [ordershow, setordershow] = useState(false);
  const orderhandleclose = () => setordershow(false);
  const [repshow, setrepshow] = useState(false);
  const rephandleclose = () => setrepshow(false);
  const [audshow, setaudshow] = useState(false);
  const audhandleclose = () => setaudshow(false);
  const [rep2show, setrep2show] = useState(false);
  const rep2handleclose = () => setrep2show(false);

  const [submitClicked, setSubmitClicked] = useState(false);

  const [reps, setrep] = useState([]);
  async function fetchdata() {
    const data = await fetch(endpoint + '/api/reps');
    const js_data = await data.json();

    setrep(js_data);
  }
  useEffect(() => {
    fetchdata();
    // const todaytwo = new Date('07/11/2023');
    // const today = new Date();
    // const formDate = formatDate(today);
    // console.log(formDate);
    // console.log(todaytwo);
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const newdate = `${month}/${day}/${year}`;
    console.log(newdate);
    return newdate;
  };

  //DATE
  const [startDate, setStartDate] = useState(new Date());
  const handleDateChange = (date) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, date: date }));
    setStartDate(date);
  };

  //DATESubmitted
  const [substartDate, setsubStartDate] = useState(new Date());
  const handleDateSubChange = (date) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, date_submitted: date }));
    setsubStartDate(date);
  };

  //DATEreviewed
  const [revstartDate, setrevStartDate] = useState(new Date());
  const handleDateRevChange = (date) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, date_reviewed: date }));
    setrevStartDate(date);
  };

  //DATElast_audit
  const [audstartDate, setaudStartDate] = useState(new Date());
  const handleDateAudChange = (date) => {
    // const formattedDate = formatDate(date);
    setform((prevForm) => ({ ...prevForm, last_audit: date }));
    setaudStartDate(date);
  };

  // const formatDate = (date) => {
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const year = date.getFullYear();
  //   return `${month}/${day}/${year}`;
  // };

  const [form, setform] = useState({
    status: 'Open',
    order: '',
    last_audit: audstartDate,
    date: startDate,
    date_submitted: substartDate,
    refund_amount: '',
    source: '',
    repId: null,
    ord_balance: '',
    denial_reason_error_issue: '',
    auditorId: null,
    date_reviewed: revstartDate,
    reptwoId: null,
    corrected: true,
    resub: false,
    correction_comments: '',
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
    const newd = formatDate(formData.date);
    const newd_r = formatDate(formData.date_reviewed);
    const newd_s = formatDate(formData.date_submitted);
    const newaud = formatDate(formData.last_audit);
    // TODO:Fixed date for unres. Fix up form verifiction and make changes to ref
    // const newd_s
    if (typeof formData.date != 'string') {
      formData.date = newd;
    }
    if (typeof formData.date_reviewed != 'string') {
      formData.date_reviewed = newd_r;
    }

    if (typeof formData.date_submitted != 'string') {
      formData.date_submitted = newd_s;
    }

    if (typeof formData.last_audit != 'string') {
      formData.last_audit = newaud;
    }

    if (formData.order === '') {
      console.log('ORDERisNONE');

      setSubmitClicked(true);
      setordershow(true);
      setTimeout(() => {
        setordershow(false);
      }, 8000);
    } else if (
      formData.auditorId === null ||
      isNaN(formData.auditorId) === true
    ) {
      console.log('audISNONE');
      setaudshow(true);
      setTimeout(() => {
        setaudshow(false);
      }, 8000);
    } else if (formData.repId === null || isNaN(formData.repId) === true) {
      console.log('repISNONE');
      setrepshow(true);
      setTimeout(() => {
        setrepshow(false);
      }, 8000);
    } else if (
      formData.reptwoId === null ||
      isNaN(formData.reptwoId) === true
    ) {
      console.log('repTwoISNONE');
      setrep2show(true);
      setTimeout(() => {
        setrep2show(false);
      }, 8000);
    } else {
      console.log(formData);
      await fetch(endpoint + '/api/unres', {
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
          // defaultValue={md.status}
          // disabled={!md.disabled}
          onChange={(e) => updateForm({ status: e.target.value })}
        >
          <option value='Open'>Open</option>
          <option value='Closed'>Closed</option>
        </Form.Control>
        <br />
        <Form.Label>Order Number</Form.Label>
        <Form.Control
          // defaultValue={md.order}
          // value={md.order}
          // disabled={!md.disabled}
          type='text'
          onChange={(e) => updateForm({ order: e.target.value })}
        />
        <br />
        <br />
        <Form.Label>Last Audit: &nbsp;</Form.Label>
        {/* <Form.Control
        // defaultValue={md.last_audit}
        // disabled={!md.disabled}
        type='text'
        onChange={(e) => updateForm({ last_audit: e.target.value })}
      /> */}
        <DatePicker
          selected={audstartDate}
          onChange={handleDateAudChange}
          dateFormat='MM/dd/yyyy'
        />
        <br />
        <br />
        <Form.Label>Date: &nbsp;</Form.Label>

        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          dateFormat='MM/dd/yyyy'
        />
        <br />
        <br />
        <Form.Label>Date Submitted: &nbsp;</Form.Label>

        <DatePicker
          selected={substartDate}
          onChange={handleDateSubChange}
          dateFormat='MM/dd/yyyy'
        />
        <br />
        <br />
        <Form.Label>Refund Amount</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ refund_amount: e.target.value })}
        />
        <Form.Label>Source</Form.Label>
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ source: e.target.value })}
        />
        <Form.Label>Rep</Form.Label>
        <Form.Control
          as='select'
          aria-label='Rep Select'
          onChange={(e) => updateForm({ repId: parseInt(e.target.value) })}
        >
          <option>Choose User</option>

          {reps.map((r) =>
            r.active ? <option value={r.id}>{r.rep_name}</option> : null
          )}
        </Form.Control>
        <br />
        <Form.Label>Order Balance</Form.Label>
        <br />
        <Form.Control
          type='text'
          onChange={(e) => updateForm({ ord_balance: e.target.value })}
        />
        <Form.Label>Denial Reason / Error Issue</Form.Label>
        <Form.Control
          as='textarea'
          rows={3}
          type='text'
          onChange={(e) =>
            updateForm({ denial_reason_error_issue: e.target.value })
          }
        />
        <br />
        <Form.Label>Auditor</Form.Label>
        <Form.Control
          as='select'
          aria-label='Auditor Select'
          onChange={(e) => updateForm({ auditorId: parseInt(e.target.value) })}
        >
          <option>Choose User</option>
          {reps.map((r) =>
            r.active ? <option value={r.id}>{r.rep_name}</option> : null
          )}
        </Form.Control>
        <br />
        <Form.Label>Date Reviewed: &nbsp;</Form.Label>

        <DatePicker
          selected={revstartDate}
          onChange={handleDateRevChange}
          dateFormat='MM/dd/yyyy'
        />
        <br />
        <Form.Label>Rep #2</Form.Label>
        <Form.Control
          as='select'
          aria-label='RepTwo Select'
          onChange={(e) => updateForm({ reptwoId: parseInt(e.target.value) })}
        >
          <option>Choose User</option>
          {reps.map((r) =>
            r.active ? <option value={r.id}>{r.rep_name}</option> : null
          )}
        </Form.Control>
        <br />
        <Form.Check
          type='switch'
          label='Corrected'
          onChange={(e) => updateForm({ corrected: e.target.checked })}
        />
        <Form.Check
          type='switch'
          label='Resub'
          onChange={(e) => updateForm({ resub: e.target.checked })}
        />
        <Form.Label>Correction Comments</Form.Label>
        <Form.Control
          as='textarea'
          rows={7}
          type='text'
          onChange={(e) => updateForm({ correction_comments: e.target.value })}
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
          'Order Number' is empty. Please enter an order number. <br />
        </Toast.Body>
      </Toast>
      <Toast
        show={repshow}
        onClose={rephandleclose}
        className={styles.repalert}
      >
        <Toast.Header>
          <strong className='me-auto'>Attention!</strong>
        </Toast.Header>
        <Toast.Body>
          'Rep' is empty. Please make a selection. <br />
        </Toast.Body>
      </Toast>
      <Toast
        show={audshow}
        onClose={audhandleclose}
        className={styles.audalert}
      >
        <Toast.Header>
          <strong className='me-auto'>Attention!</strong>
        </Toast.Header>
        <Toast.Body>
          'Auditor' is empty. Please make a selection. <br />
        </Toast.Body>
      </Toast>
      <Toast
        show={rep2show}
        onClose={rep2handleclose}
        className={styles.rep2alert}
      >
        <Toast.Header>
          <strong className='me-auto'>Attention!</strong>
        </Toast.Header>
        <Toast.Body>
          'Rep #2' is empty. Please make a selection. <br />
        </Toast.Body>
      </Toast>
    </>
  );
}
