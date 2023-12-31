// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import styles from 'app/styles/Tracer.module.css';
import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import Modal from 'react-bootstrap/Modal';
// import { Button as BootButton } from 'react-bootstrap/Button';
import { Button } from 'primereact/button';
import Form from 'react-bootstrap/Form';
import { FaLock } from 'react-icons/fa';
import { FaLockOpen } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import Header from '@/components/header';

import { useSession } from 'next-auth/react';
import { BsCircleFill } from 'react-icons/bs';
import { ImCheckboxChecked } from 'react-icons/im';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { Plus } from 'react-bootstrap-icons';
import Createtracer from '@/components/createtracer';
import DatePicker from 'react-datepicker';
import Toast from 'react-bootstrap/Toast';

export default function Tracer() {
  // const router = useRouter()
  const { data: session, status } = useSession();

  const endpoint = process.env.NEXT_PUBLIC_DB_API;
  const [newitem, setnewitem] = useState(false); //create use state for modal
  const handlenewShow = () => setnewitem(true); //handler to set it to show
  const handlenewClose = () => setnewitem(false); //handler to set it to close
  async function fetchdata() {
    const data = await fetch(endpoint + '/api/tracer');
    const rep_data = await fetch(endpoint + '/api/reps');

    const stuff = await data.json();
    const rep_stuff = await rep_data.json();

    console.log(stuff);
    console.log(rep_stuff);
    const new_stuff = stuff.map((oldstuff: any) => ({
      ...oldstuff,

      reqdate: oldstuff.reqdate === null || oldstuff.reqdate === '' ? null : new Date(oldstuff.reqdate),
    }));

    settracerdata(new_stuff);
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
  const [tracerdata, settracerdata] = useState([]);
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
    const selectedModalData = modaldata.find((md) => md.id === id);
    const modifiedModalData = {
      ...selectedModalData,
      // disabled: !parsedModalData.disabled,
      disabled_by: null,
      disabled: false,
    };
    // if (modifiedModalData) {
    //   localStorage.setItem(
    //     'selectedModalDataref',
    //     JSON.stringify(modifiedModalData)
    //   );
    //   console.log(modifiedModalData);
    // } else {
    //   console.log('No modal data found for mdId:', id);
    // }

    window.location.reload();
  };

  const lockcon = (id: any) => {
    console.log('its been locked');
    const state = true;
    console.log(user);
    const matchingRep = reps.find((rep) => rep.email === session?.user?.email);
    const therepid = matchingRep.id;
    handleRecLock(state, id, therepid);

    const selectedModalData = modaldata.find((md) => md.id === id);
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
    } else {
      await fetch(endpoint + '/api/tracer/archived', {
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
  async function handleRecLock(state: boolean, id: any, userid: any) {
    const update = {
      id: { id: id },
      data: { disabled: state, disabled_by: userid },
    };
    console.log(update);
    await fetch(endpoint + '/api/tracer', {
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
    ordernum: '',
    therepId: '',
    comments: '',
    odooresolved: false,
    replacerefundok: '',
    comments2: '',
    claimsubmitted: '',
    submitId: '',
    notes: '',
    disabled: false,
  });

  function updateForm(value: any, recordId: any) {
    return setupdatedata((prev) => {
      return { recordId, ...prev, ...value };
    });
  }

  //Filters for each column.
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ordernum: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  const getResolved = (tracerdata: any) => {
    switch (tracerdata.odooresolved) {
      case false:
        return <ImCheckboxUnchecked />;

      case true:
        return <ImCheckboxChecked />;

      default:
        return null;
    }
  };

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

  const rows = tracerdata.map((refund) => {
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
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder='Order Number Search'
          />
        </span>
      </div>
    );
  };
  const formatcolDate = (value: any) => {
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
  const datereqBodyTemplate = (tracerdata: any) => {
    return formatcolDate(tracerdata.reqdate);
  };

  //Renders green/red indicator for status
  const getStatus = (tracerdata: any) => {
    switch (tracerdata.status) {
      case 'Open':
        return <BsCircleFill className={styles.greendot} />;

      case 'Closed':
        return <BsCircleFill className={styles.reddot} />;

      default:
        return null;
    }
  };

  //Row selection. See PrimeReact doc.
  const rowselected = (e: DataTableSelectEvent) => {
    // setShow(true);

    let data = {
      id: e.data.id,
      status: e.data.status,
      reqdate: e.data.reqdate,
      ordernum: e.data.ordernum,
      therepId: e.data.therepId,
      comments: e.data.comments,
      odooresolved: e.data.odooresolved,
      replacerefundok: e.data.replacerefundok,
      comments2: e.data.comments2,
      claimsubmitted: e.data.claimsubmitted,
      submitId: e.data.submitId,
      notes: e.data.notes,
      disabled: e.data.disabled,
      disabled_by: e.data.disabled_by,
      repname: e.data.repId,
      reqName: e.data.reqId,
    };

    setmodaldata([data]);
    // if (data.disabled_by === null || data.disabled_by === userid) {
    //   handleOpen(e.data.id);
    // }
    handleOpen(e.data.id);
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
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  //DATE
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date: any, id: any) => {
    const formattedDate = formatDate(date);
    // setupdatedata((prevForm) => ({ ...prevForm, date: formattedDate }));
    updateForm({ date: formattedDate }, id);
    setStartDate(date);
    setSelectedDate(date);
  };

  //DATESubmitted
  const [substartDate, setsubStartDate] = useState(new Date());
  const [selectedsubDate, setSelectedsubDate] = useState(null);
  const handleDateSubChange = (date: any, id: any) => {
    const formattedDate = formatDate(date);
    // setform((prevForm) => ({ ...prevForm, date_submitted: formattedDate }));
    updateForm({ last_audit: formattedDate }, id);
    setsubStartDate(date);
    setSelectedsubDate(date);
  };

  //DATEreviewed
  const [revstartDate, setrevStartDate] = useState(new Date());
  const [selectedrevDate, setSelectedrevDate] = useState(null);
  const handleDateRevChange = (date: any, id: any) => {
    const formattedDate = formatDate(date);
    // setform((prevForm) => ({ ...prevForm, date_reviewed: formattedDate }));
    updateForm({ date_reviewed: formattedDate }, id);
    setrevStartDate(date);
    setSelectedrevDate(date);
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

  //DATErefundedby
  const [refstartDate, setrefStartDate] = useState(new Date());
  const [selectedrefDate, setSelectedrefDate] = useState(null);
  const handleDateRefChange = (date: any, id: any) => {
    //TODO:WORK ON THIS. TRY TO GET DATE TO INITIALLY SHOW ORIGINAL DATE AND HAVE THE ABILITY TO CHANGE WHEN GETTING A NEW DATE
    const formattedDate = formatDate(date);
    // setupdatedata((prevForm) => ({
    //   id: { id: id },
    //   ...prevForm,
    //   last_audit: formattedDate,
    // }));
    updateForm({ date_refund: formattedDate }, id);
    setrefStartDate(date);
    setSelectedrefDate(date);
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
            value={tracerdata}
            paginator
            rows={5}
            header={renderHeader()}
            filters={filters}
            selectionMode='single'
            onRowSelect={rowselected}
            globalFilterFields={['ordernum']}
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
              headerStyle={{ backgroundColor: '#CFE9FF' }}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='reqdate'
              header='Request Date'
              headerStyle={{ backgroundColor: '#CFE9FF' }}
              sortable
              body={datereqBodyTemplate}
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='ordernum'
              header='Order Number'
              headerStyle={{ backgroundColor: '#CFE9FF' }}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='therep.rep_name'
              header='Rep'
              // body={dateTemplate}
              headerStyle={{ backgroundColor: '#CFE9FF' }}
              sortable
              // sortFunction={formcolDate}
              style={{ width: '25%' }}
            ></Column>
            {/* <Column
              field='comments'
              header='Comments'
              headerStyle={{ backgroundColor: '#CFE9FF' }}
              sortable
              style={{ width: '25%' }}
            ></Column> */}
            <Column
              field='odooresolved'
              header='Odoo Resolved'
              body={getResolved}
              headerStyle={{ backgroundColor: '#CFE9FF' }}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='replacerefundok'
              header='Replace Refund Can Be Done'
              headerStyle={{ backgroundColor: '#FFC4C2' }}
              sortable
              style={{ width: '25%' }}
            ></Column>
            {/* <Column
              field='comments2'
              header='Comments'
              headerStyle={{ backgroundColor: '#FFC4C2' }}
              sortable
              style={{ width: '25%' }}
            ></Column> */}
            <Column
              field='claimsubmitted'
              header='Claims Submitted'
              headerStyle={{ backgroundColor: '#FFC4C2' }}
              sortable
              style={{ width: '25%' }}
            ></Column>

            <Column
              field='submit.rep_name'
              header='Submitted By'
              headerStyle={{ backgroundColor: '#FFC4C2' }}
              sortable
              style={{ width: '25%' }}
            ></Column>
            {/* <Column
              field='notes'
              header='Notes'
              headerStyle={{ backgroundColor: '#FFC4C2' }}
              sortable
              style={{ width: '25%' }}
            ></Column> */}
          </DataTable>
          <Button className={styles.addbutton} onClick={handlenewShow}>
            <Plus size={54} style={{ marginLeft: -2 }} />
          </Button>
        </>
      )}
      <Modal show={newitem} onHide={handlenewClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Createtracer />
          {/* <Createunres /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handlenewClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {modaldata.map((md) => (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{md.ordernum}</Modal.Title>

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
              <div className={styles.bluesection}>
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
                  defaultValue={md.ordernum}
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
                  onChange={(e) => updateForm({ order: e.target.value }, md.id)}
                />
                <br />

                <br />
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

                <br />
                <br />

                <Form.Label>Rep</Form.Label>

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
                  defaultValue={md.therepId}
                  onChange={(e) =>
                    updateForm({ therepId: parseInt(e.target.value) }, md.id)
                  }
                >
                  {reps.map((r) => (
                    <option value={r.id}>{r.rep_name}</option>
                  ))}
                </Form.Control>
                <br />
                <Form.Label>Comments</Form.Label>
                <Form.Control
                  defaultValue={md.comments}
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
                  onChange={(e) =>
                    updateForm({ comments: e.target.value }, md.id)
                  }
                />

                <br />
                <Form.Check
                  type='switch'
                  label='Odoo Resolved'
                  defaultChecked={md.odooresolved}
                  onChange={(e) =>
                    updateForm({ odooresolved: e.target.checked })
                  }
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                />
                <br />
              </div>
              <br />
              <div className={styles.redsection}>
                <Form.Label>Replace Refund Can Be Done</Form.Label>

                <Form.Control
                  as='select'
                  aria-label='Replace Refund Can Be Done'
                  defaultValue={md.replacerefundok}
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
                    updateForm({ replacerefundok: e.target.value }, md.id)
                  }
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
                  defaultValue={md.comments2}
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
                  onChange={(e) =>
                    updateForm({ comments2: e.target.value }, md.id)
                  }
                />
                <br />
                <Form.Label>Claims Submitted</Form.Label>

                <Form.Control
                  as='select'
                  aria-label='Claims Submitted'
                  defaultValue={md.claimsubmitted}
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
                    updateForm({ claimsubmitted: e.target.value }, md.id)
                  }
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
                  defaultValue={md.submitId}
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
                    updateForm({ submitId: parseInt(e.target.value) }, md.id)
                  }
                >
                  {reps.map((r) => (
                    <option value={r.id}>{r.rep_name}</option>
                  ))}
                </Form.Control>
                <br />

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
              </div>
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
        cacheModal.map((md) => (
          <Modal show={cacheshow} onHide={handlecacheClose}>
            <Modal.Header closeButton>
              <Modal.Title>{md.ordernum}</Modal.Title>

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
                <div className={styles.bluesection}>
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
                    defaultValue={md.ordernum}
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
                      updateForm({ order: e.target.value }, md.id)
                    }
                  />
                  <br />

                  <br />
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

                  <br />
                  <br />

                  <Form.Label>Rep</Form.Label>

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
                    defaultValue={md.therepId}
                    onChange={(e) =>
                      updateForm({ therepId: parseInt(e.target.value) }, md.id)
                    }
                  >
                    {reps.map((r) => (
                      <option value={r.id}>{r.rep_name}</option>
                    ))}
                  </Form.Control>
                  <br />
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    defaultValue={md.comments}
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
                    onChange={(e) =>
                      updateForm({ comments: e.target.value }, md.id)
                    }
                  />

                  <br />
                  <Form.Check
                    type='switch'
                    label='Odoo Resolved'
                    defaultChecked={md.odooresolved}
                    onChange={(e) =>
                      updateForm({ odooresolved: e.target.checked })
                    }
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                  />
                  <br />
                </div>
                <br />
                <div className={styles.redsection}>
                  <Form.Label>Replace Refund Can Be Done</Form.Label>

                  <Form.Control
                    as='select'
                    aria-label='Replace Refund Can Be Done'
                    defaultValue={md.replacerefundok}
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
                      updateForm({ replacerefundok: e.target.value }, md.id)
                    }
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
                    defaultValue={md.comments2}
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
                    onChange={(e) =>
                      updateForm({ comments2: e.target.value }, md.id)
                    }
                  />
                  <br />
                  <Form.Label>Claims Submitted</Form.Label>

                  <Form.Control
                    as='select'
                    aria-label='Claims Submitted'
                    defaultValue={md.claimsubmitted}
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
                      updateForm({ claimsubmitted: e.target.value }, md.id)
                    }
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
                    defaultValue={md.submitId}
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
                      updateForm({ submitId: parseInt(e.target.value) }, md.id)
                    }
                  >
                    {reps.map((r) => (
                      <option value={r.id}>{r.rep_name}</option>
                    ))}
                  </Form.Control>
                  <br />

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
                    onChange={(e) =>
                      updateForm({ notes: e.target.value }, md.id)
                    }
                  />
                </div>
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
