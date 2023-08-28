// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/CCsheet.module.css';
import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'primereact/button';
import Form from 'react-bootstrap/Form';
import { FaLock } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

import { FaLockOpen } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import Header from '@/components/header';
import { BsCircleFill } from 'react-icons/bs';
import { Plus } from 'react-bootstrap-icons';
import Createccsheet from '@/components/createccsheet';
import DatePicker from 'react-datepicker';
import Toast from 'react-bootstrap/Toast';

export default function CCsheet() {
  const endpoint = process.env.NEXT_PUBLIC_DB_API;
  const { data: session, status } = useSession();

  // const router = useRouter()
  const [newitem, setnewitem] = useState(false); //create use state for modal
  const handlenewShow = () => setnewitem(true); //handler to set it to show
  const handlenewClose = () => setnewitem(false); //handler to set it to close
  async function fetchdata() {
    const data = await fetch(endpoint + '/api/ccsheet');
    const rep_data = await fetch(endpoint + '/api/reps');

    const stuff = await data.json();
    const rep_stuff = await rep_data.json();

    console.log(stuff);
    console.log(rep_stuff);
    const new_stuff = stuff.map((oldstuff: any) => ({
      ...oldstuff,

      reqdate: oldstuff.reqdate === null ? null : new Date(oldstuff.reqdate),
      expiration:
        oldstuff.expiration === null ? null : new Date(oldstuff.expiration),
    }));
    console.log(new_stuff);
    setccdata(new_stuff);
    setreps(rep_stuff);

    setTimeout(function () {
      setloading(false);
    }, 200);
  }
  const [modaldata, setmodaldata] = useState([]);
  const [cacheModal, setcacheModal] = useState([]);
  const [show, setShow] = useState(false);
  const [cacheshow, setcacheShow] = useState(false);
  const [warningshow, setwarningshow] = useState(false);
  const handlewarnshow = () => setwarningshow(true);
  const handlewarnclose = () => setwarningshow(false);

  const handleOpen = (mdId: any) => {
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handlecacheClose = () => setcacheShow(false);
  const [ccdata, setccdata] = useState([]);
  const [reps, setreps] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [formdis, setformdis] = useState(true);
  const [loading, setloading] = useState(true);
  const [changedValues, setChangedValues] = useState([]);
  const [updatedata, setupdatedata] = useState({});

  const [user, setuser] = useState({});
  const [userid, setuserid] = useState();

  // const dateTemplate = (rowData,field) => {
  //   return rowData[field.field].toLocaleDateString(navigator.language, {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //   });
  // };

  const unlockcon = (id: any) => {
    console.log('its been unlocked');
    const state = false;
    const therepid = null;
    handleRecLock(state, id, therepid);
    const selectedModalData = modaldata.find((md:any) => md.id === id);
    const modifiedModalData = {
      ...selectedModalData,
      // disabled: !parsedModalData.disabled,
      disabled_by: null,
      disabled: false,
    };
    if (modifiedModalData) {
      localStorage.setItem(
        'selectedModalDataref',
        JSON.stringify(modifiedModalData)
      );
      console.log(modifiedModalData);
    } else {
      console.log('No modal data found for mdId:', id);
    }

    window.location.reload();
  };

  const lockcon = (id: any) => {
    console.log('its been locked');
    const state = true;
    console.log(user);
    const matchingRep = reps.find((rep) => rep.email === session?.user?.email);
    const therepid = matchingRep.id;
    handleRecLock(state, id, therepid);

    const selectedModalData = modaldata.find((md:any) => md.id === id);
    const modifiedModalData = {
      ...selectedModalData,
      // disabled: !parsedModalData.disabled,
      disabled_by: therepid,
    };
    if (modifiedModalData) {
      localStorage.setItem(
        'selectedModalDataref',
        JSON.stringify(modifiedModalData)
      );
      console.log(modifiedModalData);
    } else {
      console.log('No modal data found for mdId:', id);
    }
    window.location.reload();
  };

  const lock = (id: any) => {
    return <FaLock className={styles.lock} onClick={() => unlockcon(id)} />;
  };
  const unlock = (id: any) => {
    console.log(id);
    return <FaLockOpen className={styles.unlock} onClick={() => lockcon(id)} />;
  };
  async function handleSubmit(e: any) {
    e.preventDefault();
    const formData = { ...form };

    const { recordId, ...data } = updatedata;
    const formattedData = {
      id: { id: recordId },
      data: { ...data, disabled: false, disabled_by: null },
    };
    console.log(formattedData);

    if (
      Object.keys(formattedData.data).length === 2 &&
      Object.keys(formattedData.data)[0] === 'disabled'
    ) {
      console.log('NO ENTRY');
      setwarningshow(true);
    }
    // if (formattedData.data.status === 'Closed') {
    //   console.log('DELETE TEST');
    // }
    else {
      if (formattedData.data.status === 'Closed') {
        await fetch(endpoint + '/api/ccsheet', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        }).catch((error) => {
          window.alert(error);
          return;
        });
        window.location.reload();
      } else {
        await fetch(endpoint + '/api/ccsheet', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        }).catch((error) => {
          window.alert(error);
          return;
        });
        window.location.reload();
      }
    }
  }
  async function handleRecLock(state: boolean, id: any, userid: any) {
    const update = {
      id: { id: id },
      data: { disabled: state, disabled_by: userid },
    };
    console.log(update);
    await fetch(endpoint + '/api/ccsheet', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    }).catch((error) => {
      window.alert(error);
      return;
      // console.log(state);
    });
  }
  const [form, setform] = useState({
    status: '',
    reqdate: '',
    ordernumber: '',
    amountdue: '',
    channel: '',
    requestedbyId: '',
    cardholdername: '',
    cardnum: '',
    expiration: '',
    cvc: '',
    authdate: '',
    processedbyid: '',
    notes: '',
  });

  function updateForm(value: any, recordId: any) {
    return setupdatedata((prev) => {
      return { recordId, ...prev, ...value };
    });
  }

  //Filters for each column.
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ordernumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    amountdue: { value: null, matchMode: FilterMatchMode.CONTAINS },
    channel: { value: null, matchMode: FilterMatchMode.CONTAINS },
    requestedbyId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cardholdername: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cardnum: { value: null, matchMode: FilterMatchMode.CONTAINS },
    expiration: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cvc: { value: null, matchMode: FilterMatchMode.CONTAINS },
    authdate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    processedbyid: { value: null, matchMode: FilterMatchMode.CONTAINS },
    notes: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // useEffect(() => {
  //   fetchdata();
  //   if (modaldata.length > 0) {
  //     const disabled = modaldata[0].disabled;
  //     setformdis(!disabled);
  //   }
  //   console.log(form);
  // }, []);

  // Open the modal if there is stored modal data

  useEffect(() => {
    fetchdata();
    if (modaldata.length > 0) {
      const disabled = modaldata[0].disabled;
      setformdis(!disabled);
    }
    console.log(form);
    const storedModalData = localStorage.getItem('selectedModalDataref');
    console.log(storedModalData);

    if (storedModalData) {
      const parsedModalData = JSON.parse(storedModalData);
      const modifiedModalData = {
        ...parsedModalData,
        disabled: !parsedModalData.disabled,
      };
      setcacheModal([modifiedModalData]);

      if (storedModalData != null) {
        setcacheShow(true);
      }
      localStorage.removeItem('selectedModalDataref');
    }
  }, []);

  const rows = ccdata.map((refund) => {
    return {
      reqdate: refund.status,
      ordernumber: refund.ordernumber,
      refund_amount: refund.refund_amount,
      source: refund.source,
      requestedbyId: refund.requestedbyId,
      date_refunded: refund.date_refunded,
      amount_refunded: refund.amount_refunded,
      refundedamount: refund.refundedamount,
      refundedbyId: refund.refundedbyId,
      notes: refund.notes,
    };
  });
  const formatcolDate = (value) => {
    if (value === null) {
      return '';
    } else {
      const new_date = value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return new_date;
    }
  };

  const datereqBodyTemplate = (ccdata: any) => {
    return formatcolDate(ccdata.reqdate);
  };
  const datexpBodyTemplate = (ccdata: any) => {
    return formatcolDate(ccdata.expiration);
  };

  //GlobalFilterSetter
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  //Render Header
  const renderHeader = () => {
    return (
      <div className='flex justify-content-end'>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder='Keyword Search'
          />
        </span>
      </div>
    );
  };

  //Renders green/red indicator for status
  const getStatus = (ccdata: any) => {
    switch (ccdata.status) {
      case 'New':
        return <BsCircleFill className={styles.greendot} />;

      case 'Pending':
        return <BsCircleFill className={styles.reddot} />;

      case 'Closed':
        return <BsCircleFill className={styles.reddot} />;

      default:
        return null;
    }
  };
  //Renders record state
  const getrecordstate = (unresdata: any) => {
    switch (unresdata.disabled) {
      case false:
        return <FaLock />;

      case true:
        return <FaLockOpen />;

      default:
        return null;
    }
  };
  // //Renders unchecked/checked box for 'Corrected'

  //Row selection. See PrimeReact doc.
  const rowselected = (e: DataTableSelectEvent) => {
    // setShow(true);

    let data = {
      id: e.data.id,
      status: e.data.status,
      reqdate: e.data.reqdate,
      ordernumber: e.data.ordernumber,
      amountdue: e.data.amountdue,
      channel: e.data.channel,
      requestedbyId: e.data.requestedbyId,
      cardholdername: e.data.cardholdername,
      cardnum: e.data.cardnum,
      expiration: e.data.expiration,
      cvc: e.data.cvc,
      authdate: e.data.authdate,
      processedbyid: e.data.processedbyid,
      notes: e.data.notes,
      reqId: e.data.reqId,
      procId: e.data.procId,
      disabled: e.data.disabled,
      disabled_by: e.data.disabled_by,
    };

    setmodaldata([data]);

    handleOpen(e.data.id);
  };

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  //DATEdatereq
  const [reqstartDate, setreqStartDate] = useState(new Date());
  const [selectedreqDate, setSelectedreqDate] = useState(null);
  const handleDateReqChange = (date: any, id: any) => {
    //TODO:WORK ON THIS. TRY TO GET DATE TO INITIALLY SHOW ORIGINAL DATE AND HAVE THE ABILITY TO CHANGE WHEN GETTING A NEW DATE
    const formattedDate = formatDate(date);
    // setupdatedata((prevForm) => ({
    //   id: { id: id },
    //   ...prevForm,
    //   last_audit: formattedDate,
    // }));
    updateForm({ reqdate: formattedDate }, id);
    setreqStartDate(date);
    setSelectedreqDate(date);
  };

  //DATEexpiration
  const [expirationDate, setexpirationDate] = useState(new Date());
  const [selectedexpirationDate, setSelectedexpirationDate] = useState(null);
  const handleexpirationDateChange = (date: any, id: any) => {
    const formattedDate = formatDate(date);
    // setform((prevForm) => ({ ...prevForm, date_submitted: formattedDate }));
    updateForm({ expiration: formattedDate }, id);
    setexpirationDate(date);
    setSelectedexpirationDate(date);
  };
  //DATEauth
  const [authDate, setauthDate] = useState(new Date());
  const [selectedauthDate, setSelectedauthDate] = useState(null);
  const handleauthDateChange = (date: any, id: any) => {
    const formattedDate = formatDate(date);
    // setform((prevForm) => ({ ...prevForm, date_submitted: formattedDate }));
    updateForm({ expiration: formattedDate }, id);
    setauthDate(date);
    setSelectedauthDate(date);
    // setexpirationDate(date);
  };

  return (
    <>
      {loading ? (
        <Spinner animation='border' className={styles.loading} role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      ) : (
        <>
          <Header />
          <DataTable
            value={ccdata}
            paginator
            rows={5}
            header={renderHeader()}
            filters={filters}
            selectionMode='single'
            onRowSelect={rowselected}
            //TODO:STOPPED HERE BEFORE LUNCH. FIX THE FILTER SEARCHER TO REFLECT REFUND
            globalFilterFields={[
              'status',
              'ordernumber',
              'amountdue',
              'channel',
              'requestedbyId',
              'cardholdername',
            ]}
            filterDisplay='menu'
            className={styles.dtable}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column
              field='disabled'
              header='Record State'
              body={getrecordstate}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='status'
              header='Status'
              body={getStatus}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='reqdate'
              header='Request Date'
              sortable
              body={datereqBodyTemplate}
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='ordernumber'
              header='Order Number'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='amountdue'
              header='Amount Due'
              // body={dateTemplate}
              sortable
              // sortFunction={formcolDate}
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='channel'
              header='Channel'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='reqId'
              header='Requested By'
              sortable
              style={{ width: '25%' }}
            ></Column>

            <Column
              field='cardholdername'
              header='Cardholder Name'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='cardnum'
              header='Card Number'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='expiration'
              header='Expiration'
              sortable
              body={datexpBodyTemplate}
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='cvc'
              header='cvc'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='authdate'
              header='Authentication Date'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='procId'
              header='Processed By'
              sortable
              style={{ width: '25%' }}
            ></Column>
          </DataTable>
          <Button className={styles.addbutton} onClick={handlenewShow}>
            <Plus size={54} style={{ marginLeft: -2 }} />
          </Button>
        </>
      )}
      <Modal show={newitem} onHide={handlenewClose}>
        <Modal.Header closeButton> </Modal.Header>
        
        <Modal.Body>
          <Createccsheet />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handlenewClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {modaldata.map((md:any) => (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{md.ordernumber}</Modal.Title>

            {/* <h2>{reps.find((rep) => rep.id === md.disabled_by).name}</h2> */}

            {md.disabled === true &&
            reps.find((rep) => rep.email === session?.user?.email)?.id ===
              md.disabled_by
              ? lock(md.id)
              : md.disabled === true &&
                reps.find((rep) => rep.email === session?.user?.email)?.id !==
                  md.disabled_by
              ? ''
              : unlock(md.id)}
          </Modal.Header>
          {md.disabled_by !== null &&
            reps.find((rep) => rep.email === session?.user?.email)?.id !==
              md.disabled_by && (
              <div className={styles.locked}>
                This record is locked by{' '}
                {reps.find((rep) => rep.id === md.disabled_by).rep_name}
              </div>
            )}
          {md.disabled_by !== null &&
            reps.find((rep) => rep.email === session?.user?.email)?.id ===
              md.disabled_by && (
              <div className={styles.lockedbyyou}>
                You have unlocked this record
              </div>
            )}
          <Modal.Body>
            <Form>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as='select'
                aria-label='Status'
                defaultValue={md.status}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                onChange={(e) => updateForm({ status: e.target.value }, md.id)}
              >
                <option value='New' key='New'>
                  New
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
              {md.reqdate === '' || md.reqdate === null ? (
                <DatePicker
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleDateReqChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker
                  selected={selectedreqDate || new Date(md.reqdate)}
                  // selected={new Date(md.last_audit)}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleDateReqChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}

              <br />
              <br />

              <Form.Label>Order Number</Form.Label>
              <Form.Control
                defaultValue={md.ordernumber}
                // value={md.order}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                type='text'
                onChange={(e) =>
                  updateForm({ ordernumber: e.target.value }, md.id)
                }
              />
              <br />
              <br />

              <Form.Label>Amount Due</Form.Label>
              <Form.Control
                defaultValue={md.amountdue}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                type='text'
                onChange={(e) =>
                  updateForm({ amountdue: e.target.value }, md.id)
                }
              />
              <br />
              <Form.Label>Channel</Form.Label>
              <Form.Control
                defaultValue={md.channel}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                type='text'
                onChange={(e) => updateForm({ channel: e.target.value }, md.id)}
              />
              <br />

              <Form.Label>Requested By</Form.Label>

              <Form.Control
                as='select'
                aria-label='Rep Select'
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                defaultValue={md.requestedbyId}
                onChange={(e) =>
                  updateForm({ requestedbyId: parseInt(e.target.value) }, md.id)
                }
              >
                {reps.map((r) => (
                  <option value={r.id}>{r.rep_name}</option>
                ))}
              </Form.Control>
              <br />
              <br />
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                defaultValue={md.cardholdername}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                type='text'
                onChange={(e) =>
                  updateForm({ cardholdername: e.target.value }, md.id)
                }
              />
              <br />

              <Form.Label>Card Number</Form.Label>
              <Form.Control
                defaultValue={md.cardnum}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                type='text'
                onChange={(e) => updateForm({ cardnum: e.target.value }, md.id)}
              />
              <br />

              <br />
              <Form.Label>Expiration Date: &nbsp;</Form.Label>
              {md.expiration === '' || md.expiration === null ? (
                <DatePicker
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleexpirationDateChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker
                  selected={selectedexpirationDate || new Date(md.expiration)}
                  // selected={new Date(md.last_audit)}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleexpirationDateChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}

              <br />
              <br />
              <Form.Label>CVC</Form.Label>
              <Form.Control
                defaultValue={md.cvc}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                type='text'
                onChange={(e) => updateForm({ cvc: e.target.value }, md.id)}
              />
              <br />
              <Form.Label>Authentication Date: &nbsp;</Form.Label>
              {md.authdate === '' || md.authdate === null ? (
                <DatePicker
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleauthDateChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker
                  selected={selectedauthDate || new Date(md.authdate)}
                  // selected={new Date(md.last_audit)}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleauthDateChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}

              <br />
              <br />

              <Form.Label>Processed By</Form.Label>
              <Form.Control
                as='select'
                aria-label='Rep Select'
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                defaultValue={md.processedbyid}
                onChange={(e) =>
                  updateForm({ processedbyid: parseInt(e.target.value) }, md.id)
                }
              >
                {reps.map((r) => (
                  <option value={r.id} selected={r.id === md.processedbyid}>
                    {r.rep_name}
                  </option>
                ))}
              </Form.Control>
              <br />

              <Form.Label>Notes</Form.Label>
              <Form.Control
                defaultValue={md.notes}
                as='textarea'
                rows={7}
                type='text'
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                onChange={(e) => updateForm({ notes: e.target.value }, md.id)}
              />
            </Form>
            <Toast
              show={warningshow}
              onClose={handlewarnclose}
              className={styles.alert}
            >
              <Toast.Header>
                <strong className='me-auto'>Attention!</strong>
              </Toast.Header>
              <Toast.Body>
                You did not modify this record. Please modify before submission.
              </Toast.Body>
            </Toast>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            {md.disabled === true &&
            reps.find((rep) => rep.email === session?.user?.email)?.id ===
              md.disabled_by ? (
              <Button variant='primary' onClick={handleSubmit}>
                Save Changes
              </Button>
            ) : (
              ''
            )}
          </Modal.Footer>
        </Modal>
      ))}

      {cacheModal != null &&
        cacheModal.map((md:any) => (
          <Modal show={cacheshow} onHide={handlecacheClose}>
            <Modal.Header closeButton>
              <Modal.Title>{md.ordernumber}</Modal.Title>

              {/* <h2>{reps.find((rep) => rep.id === md.disabled_by).name}</h2> */}

              {md.disabled === true &&
              reps.find((rep) => rep.email === session?.user?.email)?.id ===
                md.disabled_by
                ? lock(md.id)
                : md.disabled === true &&
                  reps.find((rep) => rep.email === session?.user?.email)?.id !==
                    md.disabled_by
                ? ''
                : unlock(md.id)}
            </Modal.Header>
            {md.disabled_by === null && ''}
            {md.disabled_by !== null &&
              reps.find((rep) => rep.email === session?.user?.email)?.id ===
                md.disabled_by && (
                <div className={styles.lockedbyyou}>
                  You have unlocked this record
                </div>
              )}
            <Modal.Body>
              <Form>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as='select'
                  aria-label='Status'
                  defaultValue={md.status}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(e) =>
                    updateForm({ status: e.target.value }, md.id)
                  }
                >
                  <option value='New' key='New'>
                    New
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
                {md.reqdate === '' || md.reqdate === null ? (
                  <DatePicker
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleDateReqChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                ) : (
                  <DatePicker
                    selected={selectedreqDate || new Date(md.reqdate)}
                    // selected={new Date(md.last_audit)}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleDateReqChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                )}

                <br />
                <br />

                <Form.Label>Order Number</Form.Label>
                <Form.Control
                  defaultValue={md.ordernumber}
                  // value={md.order}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  type='text'
                  onChange={(e) =>
                    updateForm({ ordernumber: e.target.value }, md.id)
                  }
                />
                <br />
                <br />

                <Form.Label>Amount Due</Form.Label>
                <Form.Control
                  defaultValue={md.amountdue}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  type='text'
                  onChange={(e) =>
                    updateForm({ amountdue: e.target.value }, md.id)
                  }
                />
                <br />
                <Form.Label>Channel</Form.Label>
                <Form.Control
                  defaultValue={md.channel}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  type='text'
                  onChange={(e) =>
                    updateForm({ channel: e.target.value }, md.id)
                  }
                />
                <br />

                <Form.Label>Requested By</Form.Label>

                <Form.Control
                  as='select'
                  aria-label='Rep Select'
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  defaultValue={md.requestedbyId}
                  onChange={(e) =>
                    updateForm(
                      { requestedbyId: parseInt(e.target.value) },
                      md.id
                    )
                  }
                >
                  {reps.map((r) => (
                    <option value={r.id}>{r.rep_name}</option>
                  ))}
                </Form.Control>
                <br />
                <br />
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  defaultValue={md.cardholdername}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  type='text'
                  onChange={(e) =>
                    updateForm({ cardholdername: e.target.value }, md.id)
                  }
                />
                <br />

                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  defaultValue={md.cardnum}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  type='text'
                  onChange={(e) =>
                    updateForm({ cardnum: e.target.value }, md.id)
                  }
                />
                <br />

                <br />
                <Form.Label>Expiration Date: &nbsp;</Form.Label>
                {md.expiration === '' || md.expiration === null ? (
                  <DatePicker
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleexpirationDateChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                ) : (
                  <DatePicker
                    selected={selectedexpirationDate || new Date(md.expiration)}
                    // selected={new Date(md.last_audit)}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleexpirationDateChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                )}

                <br />
                <br />
                <Form.Label>CVC</Form.Label>
                <Form.Control
                  defaultValue={md.cvc}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  type='text'
                  onChange={(e) => updateForm({ cvc: e.target.value }, md.id)}
                />
                <br />
                <Form.Label>Authentication Date: &nbsp;</Form.Label>
                {md.authdate === '' || md.authdate === null ? (
                  <DatePicker
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleauthDateChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                ) : (
                  <DatePicker
                    selected={selectedauthDate || new Date(md.authdate)}
                    // selected={new Date(md.last_audit)}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleauthDateChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                )}

                <br />
                <br />

                <Form.Label>Processed By</Form.Label>
                <Form.Control
                  as='select'
                  aria-label='Rep Select'
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  defaultValue={md.processedbyid}
                  onChange={(e) =>
                    updateForm(
                      { processedbyid: parseInt(e.target.value) },
                      md.id
                    )
                  }
                >
                  {reps.map((r) => (
                    <option value={r.id} selected={r.id === md.processedbyid}>
                      {r.rep_name}
                    </option>
                  ))}
                </Form.Control>
                <br />

                <Form.Label>Notes</Form.Label>
                <Form.Control
                  defaultValue={md.notes}
                  as='textarea'
                  rows={7}
                  type='text'
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(e) => updateForm({ notes: e.target.value }, md.id)}
                />
              </Form>
              <Toast
                show={warningshow}
                onClose={handlewarnclose}
                className={styles.alert}
              >
                <Toast.Header>
                  <strong className='me-auto'>Attention!</strong>
                </Toast.Header>
                <Toast.Body>
                  You did not modify this record. Please modify before
                  submission.
                </Toast.Body>
              </Toast>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>
                Close
              </Button>
              {md.disabled === true &&
              reps.find((rep) => rep.email === session?.user?.email)?.id ===
                md.disabled_by ? (
                <Button variant='primary' onClick={handleSubmit}>
                  Save Changes
                </Button>
              ) : (
                ''
              )}
            </Modal.Footer>
          </Modal>
        ))}
    </>
  );
}
