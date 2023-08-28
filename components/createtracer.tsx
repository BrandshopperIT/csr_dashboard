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

export default function Createtracer() {
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

  const [form, setform] = useState({
    status: 'Open',
    reqdate: reqstartDate,
    ordernum: '',
    therepId: null,
    comments: '',
    odooresolved: false,
    replacerefundok: '',
    comments2: '',
    claimsubmitted: '',
    submitId: null,
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

    // TODO:Fixed date for unres. Fix up form verifiction and make changes to ref
    // const newd_s
    if (typeof formData.reqdate != 'string') {
      formData.reqdate = newrd;
    }

    if (formData.ordernum === '') {
      console.log('ORDERisNONE');
      setordershow(true);
      setTimeout(() => {
        setordershow(false);
      }, 8000);
    } else if (
      formData.therepId === null ||
      isNaN(formData.therepId) === true
    ) {
      console.log('reqISNONE');
      setreqshow(true);
      setTimeout(() => {
        setreqshow(false);
      }, 8000);
    } else if (
      formData.submitId === null ||
      isNaN(formData.submitId) === true
    ) {
      console.log('refISNONE');
      setrefshow(true);
      setTimeout(() => {
        setrefshow(false);
      }, 8000);
    } else {
      console.log(formData);
      await fetch(endpoint + '/api/tracer', {
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
        <div className={styles.bluesection}>
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
            onChange={(e) => updateForm({ ordernum: e.target.value })}
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

          <Form.Label>Rep</Form.Label>

          <Form.Control
            as='select'
            aria-label='Rep Select'
            onChange={(e) => updateForm({ therepId: parseInt(e.target.value) })}
          >
            <option>Choose User</option>
            {reps.map((r) => (
              <option value={r.id}>{r.rep_name}</option>
            ))}
          </Form.Control>
          <br />
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as='textarea'
            rows={7}
            type='text'
            onChange={(e) => updateForm({ comments: e.target.value })}
          />

          <br />
          <Form.Check
            type='switch'
            label='Odoo Resolved'
            onChange={(e) => updateForm({ odooresolved: e.target.checked })}
          />
          <br />
        </div>
        <br />
        <div className={styles.redsection}>
          <Form.Label>Replace Refund Can Be Done</Form.Label>

          <Form.Control
            as='select'
            aria-label='Replace Refund Can Be Done'
            onChange={(e) => updateForm({ replacerefundok: e.target.value })}
          >
            <option value='NO' key='NO'>
              NO
            </option>
            <option value='YES' key='YES'>
              YES
            </option>
            <option value='SEE NOTE' key='SEE NOTE'>
              SEE NOTE
            </option>
          </Form.Control>
          <br />
          <Form.Label>Comments2</Form.Label>
          <Form.Control
            as='textarea'
            rows={7}
            type='text'
            onChange={(e) => updateForm({ comments2: e.target.value })}
          />
          <br />
          <Form.Label>Claims Submitted</Form.Label>

          <Form.Control
            as='select'
            aria-label='Claims Submitted'
            onChange={(e) => updateForm({ claimsubmitted: e.target.value })}
          >
            <option value='NO' key='NO'>
              NO
            </option>
            <option value='YES' key='YES'>
              YES
            </option>
            <option value='TO DO' key='TO DO'>
              SEE NOTE
            </option>
            <option disabled value='' key=''></option>
          </Form.Control>

          <br />

          <Form.Label>Submitted By</Form.Label>
          <Form.Control
            as='select'
            aria-label='Auditor Select'
            onChange={(e) => updateForm({ submitId: parseInt(e.target.value) })}
          >
            <option value={null}>Choose User</option>
            {reps.map((r) => (
              <option value={r.id}>{r.rep_name}</option>
            ))}
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
        </div>
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
          'Submitted by' is empty. Please make a selection.
        </Toast.Body>
      </Toast>
    </>
  );
}
