// @ts-nocheck
'use client';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import { MDBDataTable } from 'mdbreact';
import styles from 'app/styles/Replacement.module.css';
import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import Modal from 'react-bootstrap/Modal';
// import { Button as BootButton } from 'react-bootstrap/Button';
import { Button } from 'primereact/button';
import Form from 'react-bootstrap/Form';
import { FaLock } from 'react-icons/fa';
import { FaLockOpen } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import { useSession } from 'next-auth/react';

import Header from '@/components/header';
import { LuSquareDot } from 'react-icons/lu';
import { BsCircleFill } from 'react-icons/bs';
import { TbRectangleFilled } from 'react-icons/tb';
import { ImCheckboxChecked } from 'react-icons/im';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { Plus } from 'react-bootstrap-icons';
import Router from 'next/router';
import Createreplacement from '@/components/createreplacement';
import Createunres from '@/components/createunres';
import DatePicker from 'react-datepicker';
import Toast from 'react-bootstrap/Toast';

export default function Replacement() {
  const endpoint = process.env.NEXT_PUBLIC_DB_API;
  const { data: session, status } = useSession();

  const [newitem, setnewitem] = useState(false); //create use state for modal
  const handlenewShow = () => setnewitem(true); //handler to set it to show
  const handlenewClose = () => setnewitem(false); //handler to set it to close
  async function fetchdata() {
    const data = await fetch(endpoint + '/api/replsheet/archived');
    const rep_data = await fetch(endpoint + '/api/reps');
    const stuff = await data.json();
    const rep_stuff = await rep_data.json();
    console.log(stuff);
    console.log(rep_stuff);
    const new_stuff = stuff.map((oldstuff: any) => ({
      ...oldstuff,

      reqdate: oldstuff.reqdate === null || oldstuff.reqdate === '' ? null : new Date(oldstuff.reqdate),
    }));

    setreplacedata(new_stuff);
    setreps(rep_stuff);
    setTimeout(function () {
      setloading(false);
    }, 200);
  }
  //DECONSTRUCTION FARM// - useState variables and functions that control them
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
  const [replacedata, setreplacedata] = useState([]);
  const [reps, setreps] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [formdis, setformdis] = useState(true);
  const [loading, setloading] = useState(true);
  const [changedValues, setChangedValues] = useState([]);
  const [updatedata, setupdatedata] = useState({});
  const [user, setuser] = useState({});
  const [userid, setuserid] = useState();

  //UNLOCK/LOCK FARM// - This area focuses on the functionality of locking and unlocking a record.********************************************************************

  // 'lock' displays a lock icon. It accepts the passed id from the selected record.
  //  When clicked, it calls the 'unlockcon' function where the id is passed as an argument.
  // 'unlock' does the same thing except it calls the 'lockcon' function where the id is passed an argument.
  const lock = (id: any) => {
    return <FaLock className={styles.lock} onClick={() => unlockcon(id)} />;
  };
  const unlock = (id: any) => {
    return <FaLockOpen className={styles.unlock} onClick={() => lockcon(id)} />;
  };

  // 'unlockcon' accepts the id from the 'lock' function and passes that and a 'false' state to the 'handleRecLock' function.
  // After that's done, we then go into modeldata array and find the id that match the passed id. We then save that information into local storage.
  // When the page is loaded, it checks to see if this localstorage is set. If it is, it displays a modal with all of it's information set.
  // After this is set, we remove it from local storage.
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

  // 'lockcon' accepts the id from the 'lock' function and passes that and a 'true' state to the 'handleRecLock' function.
  // After that's done, we then go into modeldata array and find the id that match the passed id. We then save that information into local storage.
  // When the page is loaded, it checks to see if this localstorage is set. If it is, it displays a modal with all of it's information set.
  // After this is set, we remove it from local storage.
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
    console.log(modifiedModalData);
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

  // 'handleRecLock' accepts the state and id from either 'unlock' or 'lock'. Once that's done, we create an update json with the id and state in the format
  // that is expected from the API endpoint. Once thats done, we send it to the '/api/replsheet' api. This is what actually disables and enables the record inside the table.
  async function handleRecLock(state: boolean, id: any, userid: any) {
    const update = {
      id: { id: id },
      data: { disabled: state, disabled_by: userid },
    };
    console.log(update);
    await fetch(endpoint + '/api/replsheet', {
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
  //^^UNLOCK/LOCK FARM// - This area focuses on the functionality of locking and unlocking a record.********************************************************************

  //HANDLESUBMISSION - This area handles the submission into the database. This is only for updating records and NOT creating new ones. **********************************
  // 'handleSubmit' takes the data from updatedata useState json (see the 'FORM MANIPULATION' section to understand how this works), checks if there's any changes (if there isn't, we throw in error), and then proceeds to send the formattedData to the /api/replsheet endpoint.
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
      await fetch(endpoint + '/api/replsheet', {
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
  //^^HANDLESUBMISSION - This area handles the submission into the database. This is only for updating records and NOT creating new ones. **********************************

  //FORM MANIPULATION - This functionality allows our data (from the input form) to be saved, held, and altered until ready to be sent 'handleSubmit' for submission.**********
  // 'form' is a useState that sets the initial state of the form.
  const [form, setform] = useState({
    status: 'Open',
    reqdate: '',
    ordernumber: '',
    requestedbyId: '',
    refund: '',
    replacememt: '',
    trackinginfo: '',
    trackingstatus: '',
    refundedbyId: '',
    notes: '',
    disabled: false,
  });
  //'updateform' is triggered every time the state of a form input is changed. When this happens. it sends the value from the field and the record ID.
  // From here, we then update 'updatedata' json usestate with our record id and the addition of our new value.
  function updateForm(value: any, recordId: any) {
    return setupdatedata((prev) => {
      return { recordId, ...prev, ...value };
    });
  }
  //^^FORM MANIPULATION - This functionality allows our data (from the input form) to be saved, held, and altered until ready to be sent 'handleSubmit' for submission.**********

  //'filters' is a useState json that contains all of our columns that we want to search on as keys. The value is a nested json. The inner functionality was not built
  //by me. For more information, see PrimeReact documentation.
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    ordernumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  //USEFFECT**********************************************************************************************************************************************************
  //when page is loaded, the 'fetchdata' function is ran. We then grab the 'selectedModalDataref' from localStorage. If it exists, we take the information, modify it to point to
  // change it's disabled state and place the whole thing into a useState array called 'setcacheModal'. If the 'selectedModalDataref' is NOT NULL, we setcacheShow useState to true. This is the state controller for the cache modal/form located at the bottom of the page.
  useEffect(() => {
    fetchdata();

    //MAYNOTBENEEDED
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
  //^^USEFFECT**********************************************************************************************************************************************************

  //GlobalFilterSetter
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
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
  const datereqBodyTemplate = (replacedata: any) => {
    return formatcolDate(replacedata.reqdate);
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
          <h2 className={styles.replacementname}>Replacements Sent</h2>
        </span>
      </div>
    );
  };

  //TABLE INDICATORS -- in this section, we set a visual representation of a fields state using icons.************************************
  //'getStatus' displays a filled circle. Based on the given status, if it's 'Open', it's a green dot. If it's 'Closed', 'its a red dot.
  const getStatus = (replacedata: any) => {
    switch (replacedata.status) {
      case 'Open':
        return <BsCircleFill className={styles.greendot} />;

      case 'Closed':
        return <BsCircleFill className={styles.reddot} />;
      case 'Pending':
        return <BsCircleFill className={styles.bluedot} />;

      default:
        return null;
    }
  };

  //Renders record state
  const getrecordstate = (replacedata: any) => {
    switch (replacedata.disabled) {
      case false:
        return <FaLock />;

      case true:
        return <FaLockOpen />;

      default:
        return null;
    }
  };

  //Renders unchecked/checked box for 'Corrected'
  const getRefund = (replacedata: any) => {
    switch (replacedata.refund) {
      case false:
        return <ImCheckboxUnchecked />;

      case true:
        return <ImCheckboxChecked />;

      default:
        return null;
    }
  };

  //Renders unchecked/checked box for 'Resub'
  const getReplacement = (replacedata: any) => {
    switch (replacedata.replacement) {
      case true:
        return <ImCheckboxChecked />;
      case false:
        return <ImCheckboxUnchecked />;
      default:
        return null;
    }
  };
  //^^TABLE INDICATORS -- in this section, we set a visual representation of a fields state using icons.************************************

  //Row selection. See PrimeReact doc.
  const rowselected = (e: DataTableSelectEvent) => {
    // setShow(true);

    let data = {
      id: e.data.id,
      status: e.data.status,
      reqdate: e.data.reqdate,
      ordernumber: e.data.ordernumber,
      replacement: e.data.replacement,
      refund: e.data.refund,
      requestedby: e.data.requestedby.rep_name,
      date_refund: e.data.date_refund,
      amount_refund: e.data.amount_refund,
      refundedbyId: e.data.refundedbyId,
      notes: e.data.notes,
      trackingstatus: e.data.trackingstatus,
      trackinginfo: e.data.trackinginfo,
      disabled: e.data.disabled,
      disabled_by: e.data.disabled_by,
      requestedbyid: e.data.requestedby.id,
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

  // //DATE
  // const [startDate, setStartDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(null);
  // const handleDateChange = (date, id) => {
  //   const formattedDate = formatDate(date);
  //   // setupdatedata((prevForm) => ({ ...prevForm, date: formattedDate }));
  //   updateForm({ date: formattedDate }, id);
  //   setStartDate(date);
  //   setSelectedDate(date);
  // };

  // //DATESubmitted
  // const [substartDate, setsubStartDate] = useState(new Date());
  // const [selectedsubDate, setSelectedsubDate] = useState(null);
  // const handleDateSubChange = (date, id) => {
  //   const formattedDate = formatDate(date);
  //   // setform((prevForm) => ({ ...prevForm, date_submitted: formattedDate }));
  //   updateForm({ last_audit: formattedDate }, id);
  //   setsubStartDate(date);
  //   setSelectedsubDate(date);
  // };

  // //DATEreviewed
  // const [revstartDate, setrevStartDate] = useState(new Date());
  // const [selectedrevDate, setSelectedrevDate] = useState(null);
  // const handleDateRevChange = (date, id) => {
  //   const formattedDate = formatDate(date);
  //   // setform((prevForm) => ({ ...prevForm, date_reviewed: formattedDate }));
  //   updateForm({ date_reviewed: formattedDate }, id);
  //   setrevStartDate(date);
  //   setSelectedrevDate(date);
  // };

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

  // //DATErefundedby
  // const [refstartDate, setrefStartDate] = useState(new Date());
  // const [selectedrefDate, setSelectedrefDate] = useState(null);
  // const handleDateRefChange = (date, id) => {
  //   //TODO:WORK ON THIS. TRY TO GET DATE TO INITIALLY SHOW ORIGINAL DATE AND HAVE THE ABILITY TO CHANGE WHEN GETTING A NEW DATE
  //   const formattedDate = formatDate(date);
  //   // setupdatedata((prevForm) => ({
  //   //   id: { id: id },
  //   //   ...prevForm,
  //   //   last_audit: formattedDate,
  //   // }));
  //   updateForm({ date_refund: formattedDate }, id);
  //   setrefStartDate(date);
  //   setSelectedrefDate(date);
  // };

  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************
  // *********************************************************************************************************************************************************

  // **********************************************FRONT END***************************************************************************************************l

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
            value={replacedata}
            paginator
            rows={5}
            header={renderHeader()}
            filters={filters}
            selectionMode='single'
            onRowSelect={rowselected}
            //TODO:STOPPED HERE BEFORE LUNCH. FIX THE FILTER SEARCHER TO REFLECT REFUND
            globalFilterFields={['ordernumber']}
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
              field='ordernumber'
              header='Order Number'
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
              field='replacement'
              header='Replacement'
              sortable
              body={getReplacement}
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='refund'
              header='Refund'
              sortable
              body={getRefund}
              style={{ width: '25%' }}
            ></Column>

            <Column
              field='requestedby.rep_name'
              header='Requested By'
              sortable
              style={{ width: '25%' }}
            ></Column>
          </DataTable>
        </>
      )}
      <Modal show={newitem} onHide={handlenewClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {/* <Createreplacement /> */}
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
              <Form.Check
                type='switch'
                label='Replacement'
                defaultChecked={md.replacement}
                onChange={(e) =>
                  updateForm({ replacement: e.target.checked }, md.id)
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
              <Form.Check
                type='switch'
                label='Refund'
                defaultChecked={md.refund}
                onChange={(e) =>
                  updateForm({ refund: e.target.checked }, md.id)
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
              <Form.Label>Tracking Info</Form.Label>
              <Form.Control
                defaultValue={md.trackinginfo}
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
                  updateForm({ trackinginfo: e.target.value }, md.id)
                }
              />
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

              {/* <Form.Label>Refund Amount</Form.Label>
              <Form.Control
                defaultValue={md.refund_amount}
                disabled={!md.disabled}
                type='text'
                onChange={(e) =>
                  updateForm({ refund_amount: e.target.value }, md.id)
                }
              />
              <br />
              <Form.Label>Source</Form.Label>
              <Form.Control
                defaultValue={md.source}
                disabled={!md.disabled}
                type='text'
                onChange={(e) => updateForm({ source: e.target.value }, md.id)}
              />
              <br /> */}

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
                defaultValue={md.requestedbyname}
                onChange={(e) =>
                  updateForm({ requestedbyId: parseInt(e.target.value) }, md.id)
                }
              >
                {reps.map((r) => (
                  <option value={r.id}>{r.rep_name}</option>
                ))}
              </Form.Control>
              <br />
              <Form.Label>Tracking Status</Form.Label>
              <Form.Control
                defaultValue={md.trackingstatus}
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
                  updateForm({ trackingstatus: e.target.value }, md.id)
                }
              />
              <br />
              {/* <Form.Label>Date Refunded: &nbsp;</Form.Label>
              {md.date_refund === '' || md.date_refund === null ? (
                <DatePicker
                  disabled={!md.disabled}
                  onChange={(date) => handleDateRefChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker //TODO: FIXTHISWHENBACKFROMLUNCH
                  selected={selectedrefDate || new Date(md.date_refund)}
                  // selected={new Date(md.last_audit)}
                  disabled={!md.disabled}
                  onChange={(date) => handleDateRefChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}
              <br />

              <Form.Label>Amount Refund</Form.Label>
              <Form.Control
                defaultValue={md.refund_amount}
                disabled={!md.disabled}
                type='text'
                onChange={(e) =>
                  updateForm({ refund_amount: e.target.value }, md.id)
                }
              />
              <br />

              <Form.Label>Refunded By</Form.Label>
              <Form.Control
                as='select'
                aria-label='Auditor Select'
                defaultValue={md.refundedbyId}
                disabled={!md.disabled}
                onChange={(e) =>
                  updateForm({ refundedbyId: parseInt(e.target.value) }, md.id)
                }
              >
                {reps.map((r) => (
                  <option value={r.id}>{r.rep_name}</option>
                ))}
              </Form.Control>
              <br />

              <br /> */}

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
        cacheModal.map((md) => (
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
                <Form.Check
                  type='switch'
                  label='Replacement'
                  defaultChecked={md.replacement}
                  onChange={(e) =>
                    updateForm({ replacement: e.target.checked }, md.id)
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
                <Form.Check
                  type='switch'
                  label='Refund'
                  defaultChecked={md.refund}
                  onChange={(e) =>
                    updateForm({ refund: e.target.checked }, md.id)
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
                <Form.Label>Tracking Info</Form.Label>
                <Form.Control
                  defaultValue={md.trackinginfo}
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
                    updateForm({ trackinginfo: e.target.value }, md.id)
                  }
                />
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
                  defaultValue={md.requestedbyname}
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
                <Form.Label>Tracking Status</Form.Label>
                <Form.Control
                  defaultValue={md.trackingstatus}
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
                    updateForm({ trackingstatus: e.target.value }, md.id)
                  }
                />
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
