// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/Unres.module.css';
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
import { BsCircleFill } from 'react-icons/bs';
import { ImCheckboxChecked } from 'react-icons/im';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { Plus } from 'react-bootstrap-icons';
import Createunres from '@/components/createunres';
import DatePicker from 'react-datepicker';
import { useSession } from 'next-auth/react';
import Toast from 'react-bootstrap/Toast';
import { OverlayTrigger } from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';

// require('dotenv').config();

export default function Unres() {
  // const router = useRouter()
  const { data: session, status } = useSession();
  // console.log(session?.user?.email);
  const endpoint = process.env.NEXT_PUBLIC_DB_API;
  const [newitem, setnewitem] = useState(false); //create use state for modal
  const handlenewShow = () => setnewitem(true); //handler to set it to show
  const handlenewClose = () => setnewitem(false); //handler to set it to close

  async function fetchdata() {
    const data = await fetch(endpoint + '/api/unres');
    const rep_data = await fetch(endpoint + '/api/reps');
    console.log(endpoint);
    const stuff = await data.json();
    const rep_stuff = await rep_data.json();
    console.log(stuff);
    console.log(session?.user?.email);
    console.log(rep_stuff);
    setuser(session?.user);
    setTimeout(() => {
      console.log(user);
    }, 1000);

    for (let i = 0; i < rep_stuff.length; i++) {
      console.log(rep_stuff[i].email);
      console.log(session?.user);

      // console.log(user?.email);

      if (rep_stuff[i].email === session?.user?.email) {
        // console.log(rep_stuff[i].id);
        setuserid(rep_stuff[i].id);
      }
    }

    const new_stuff = stuff.map((oldstuff: any) => ({
      ...oldstuff,

      date:
        oldstuff.date === null || oldstuff.date === ''
          ? null
          : new Date(oldstuff.date),
      last_audit:
        oldstuff.last_audit === null || oldstuff.last_audit === ''
          ? null
          : new Date(oldstuff.last_audit),
      date_submitted:
        oldstuff.date_submitted === ''
          ? null
          : new Date(oldstuff.date_submitted),
      date_reviewed:
        oldstuff.date_reviewed === null || oldstuff.date_reviewed === ''
          ? null
          : new Date(oldstuff.date_reviewed),
    }));
    console.log(new_stuff);
    setunresdata(new_stuff);
    setreps(rep_stuff);
    console.log(reps);

    setTimeout(function () {
      setloading(false);
    }, 200);
  }
  //DECONSTRUCTION FARM// - useState variables and functions that control them************
  const [modaldata, setmodaldata] = useState([]);
  const [cacheModal, setcacheModal] = useState([]);
  const [show, setShow] = useState(false);
  const [cacheshow, setcacheShow] = useState(false);
  const [warningshow, setwarningshow] = useState(false);
  const [lockedshow, setlockedshow] = useState(false);
  const handlelockedshow = () => setlockedshow(true);
  const handlelockedclose = () => setlockedshow(false);
  const handlewarnshow = () => setwarningshow(true);
  const handlewarnclose = () => setwarningshow(false);

  const handleOpen = (mdId: any) => {
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handlecacheClose = () => setcacheShow(false);
  const [unresdata, setunresdata] = useState([]);
  const [reps, setreps] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [formdis, setformdis] = useState(true);
  const [loading, setloading] = useState(true);
  const [changedValues, setChangedValues] = useState([]);
  const [updatedata, setupdatedata] = useState({});
  const [user, setuser] = useState({});
  const [userid, setuserid] = useState();

  //^^^^^^DECONSTRUCTION FARM// - useState variables and functions that control them************

  //UNLOCK/LOCK FARM// - This area focuses on the functionality of locking and unlocking a record.********************************************************************
  // 'lock' displays a lock icon. It accepts the passed id from the selected record.
  //  When clicked, it calls the 'unlockcon' function where the id is passed as an argument.
  // 'unlock' does the same thing except it calls the 'lockcon' function where the id is passed an argument.
  const lock = (id: any) => {
    return <FaLock className={styles.lock} onClick={() => unlockcon(id)} />;
  };
  const unlock = (id: any) => {
    console.log(id);
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
    if (modifiedModalData) {
      localStorage.setItem(
        'selectedModalData',
        JSON.stringify(modifiedModalData)
      );
      console.log(modifiedModalData);
    } else {
      console.log('No modal data found for mdId:', id);
    }
    setTimeout(() => {
      window.location.reload();
    }, 500);

    // window.location.reload();
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
        'selectedModalData',
        JSON.stringify(modifiedModalData)
      );
      console.log(modifiedModalData);
    } else {
      console.log('No modal data found for mdId:', id);
    }
    setTimeout(() => {
      window.location.reload();
    }, 500);
    // window.location.reload();
  };

  // 'handleRecLock' accepts the state and id from either 'unlock' or 'lock'. Once that's done, we create an update json with the id and state in the format
  // that is expected from the API endpoint. Once thats done, we send it to the '/api/replsheet' api. This is what actually disables and enables the record inside the table.
  async function handleRecLock(state: boolean, id: any, userid: any) {
    const update = {
      id: { id: id },
      data: { disabled: state, disabled_by: userid },
    };
    console.log(update);
    await fetch(endpoint + '/api/unres', {
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
      await fetch(endpoint + '/api/unres', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      }).catch((error) => {
        window.alert(error);
        return;
      });
    }

    window.location.reload();
  }
  //^^HANDLESUBMISSION - This area handles the submission into the database. This is only for updating records and NOT creating new ones. **********************************

  //FORM MANIPULATION - This functionality allows our data (from the input form) to be saved, held, and altered until ready to be sent 'handleSubmit' for submission.**********
  // 'form' is a useState that sets the initial state of the form.

  const [form, setform] = useState({
    status: '',
    order: '',
    last_audit: '',
    date: '',
    date_submitted: '',
    refund_amount: '',
    source: '',
    repId: '',
    ord_balance: '',
    denial_reason_error_issue: '',
    auditorId: '',
    date_reviewed: '',
    reptwoId: '',
    corrected: true,
    resub: false,
    correction_comments: '',
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
    order: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  //USEFFECT**********************************************************************************************************************************************************
  //when page is loaded, the 'fetchdata' function is ran. We then grab the 'selectedModalDataref' from localStorage. If it exists, we take the information, modify it to point to
  // change it's disabled state and place the whole thing into a useState array called 'setcacheModal'. If the 'selectedModalDataref' is NOT NULL, we setcacheShow useState to true. This is the state controller for the cache modal/form located at the bottom of the page.
  useEffect(() => {
    fetchdata();
    if (modaldata.length > 0) {
      const disabled = modaldata[0].disabled;
      setformdis(!disabled);
    }
    console.log(form);
    const storedModalData = localStorage.getItem('selectedModalData');
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
      localStorage.removeItem('selectedModalData');
    }

    console.log(userid);
  }, [user, userid]);
  // const lockingRep = reps.find((rep) => rep.id === md.disabled_by);
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
            placeholder='Order Number Search'
          />
          <h2 className={styles.unresname}>Unresolved Open Accounts</h2>
        </span>
      </div>
    );
  };

  //Renders green/red indicator for status
  const getStatus = (unresdata: any) => {
    switch (unresdata.status) {
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
  //Renders unchecked/checked box for 'Corrected'
  const getCorrected = (unresdata: any) => {
    switch (unresdata.corrected) {
      case false:
        return <ImCheckboxUnchecked />;

      case true:
        return <ImCheckboxChecked />;

      default:
        return null;
    }
  };
  //Body function for refundamount. See columns below for function call
  const refundamountbody = (unresdata: any) => {
    if (unresdata.refund_amount === '' || unresdata.refund_amount === null) {
      return '';
    } else {
      return '$' + unresdata.refund_amount;
    }
  };
  //Body function for orderbalance. See columns below for function call

  const orderbalancebody = (unresdata: any) => {
    if (unresdata.ord_balance === '' || unresdata.ord_balance === null) {
      return '';
    } else {
      return '$' + unresdata.ord_balance;
    }
  };

  //Body function for resub check box. See columns below for function call
  const getResub = (useresdata: any) => {
    switch (useresdata.resub) {
      case true:
        return <ImCheckboxChecked />;
      case false:
        return <ImCheckboxUnchecked />;
      default:
        return null;
    }
  };

  //'rowselected' is used for modal generation. Once a record is clicked, it takes the data, and places it into modaldata useState array.
  const rowselected = (e: DataTableSelectEvent) => {
    // setShow(true);

    let data = {
      id: e.data.id,
      status: e.data.status,
      order: e.data.order,
      last_audit: e.data.last_audit,
      date: e.data.date,
      date_submitted: e.data.date_submitted,
      refund_amount: e.data.refund_amount,
      source: e.data.source,
      repId: e.data.rep.rep_name,
      ord_balance: e.data.ord_balance,
      denial_reason_error_issue: e.data.denial_reason_error_issue,
      auditorId: e.data.auditor.rep_name,
      date_reviewed: e.data.date_reviewed,
      reptwoId: e.data.reptwo.rep_name,
      corrected: e.data.corrected,
      resub: e.data.resub,
      correction_comments: e.data.correction_comments,
      disabled: e.data.disabled,
      disabled_by: e.data.disabled_by,
      rep: e.data.rep.id,
      aud: e.data.auditor.id,
      reptwo: e.data.reptwo.id,
    };

    setmodaldata([data]);
    // if (data.disabled_by === null || data.disabled_by === userid) {
    //   handleOpen(e.data.id);
    // }
    handleOpen(e.data.id);
  };
  //DATEControllers******************************************************************************
  //'formatDate' takes the date and converts it to a string.
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  //DATE - this sets a start date and sets the selected date.
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date: any, id: any) => {
    const formattedDate = formatDate(date);
    // setupdatedata((prevForm) => ({ ...prevForm, date: formattedDate }));
    updateForm({ date: formattedDate }, id);
    setStartDate(date);
    setSelectedDate(date);
  };

  //DATESubmitted - this sets a start submitted date and sets the selected submitted date.
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

  //DATElast_audit
  // const [audstartDate, setaudStartDate] = useState(new Date());
  const [audstartDate, setaudStartDate] = useState(new Date());
  const [selectedaudDate, setSelectedaudDate] = useState(null);
  const handleDateAudChange = (date: any, id: any) => {
    //TODO:WORK ON THIS. TRY TO GET DATE TO INITIALLY SHOW ORIGINAL DATE AND HAVE THE ABILITY TO CHANGE WHEN GETTING A NEW DATE
    const formattedDate = formatDate(date);
    // setupdatedata((prevForm) => ({
    //   id: { id: id },
    //   ...prevForm,
    //   last_audit: formattedDate,
    // }));
    updateForm({ last_audit: formattedDate }, id);
    setaudStartDate(date);
    setSelectedaudDate(date);
  };

  //formatcolDate formates a date that is passed to it.
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
  //these date body templates are body functions for the date columns below. This encourages the application to correctly sort the dates.
  const dateBodyTemplate = (unresdata: any) => {
    return formatcolDate(unresdata.date);
  };
  const datesubBodyTemplate = (unresdata: any) => {
    return formatcolDate(unresdata.date_submitted);
  };
  const lastaudBodyTemplate = (unresdata: any) => {
    return formatcolDate(unresdata.last_audit);
  };
  const daterevBodyTemplate = (unresdata: any) => {
    return formatcolDate(unresdata.date_reviewed);
  };

  //^^^^^^^^DATEControllers******************************************************************************
  const renderTooltip = (props: any) => (
    <Tooltip id='button-tooltip' {...props}>
      Simple tooltip
    </Tooltip>
  );

  return (
    <>
      {loading ? (
        <Spinner animation='border' className={styles.loading} role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      ) : (
        <>
          {/* Navigation Bar */}
          <Header />
          {/* DataTable */}
          <DataTable
            value={unresdata}
            paginator
            rows={5}
            header={renderHeader()}
            filters={filters}
            selectionMode='single'
            onRowSelect={rowselected}
            globalFilterFields={['order']}
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
              field='order'
              header='Order'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='last_audit'
              header='Last Audit'
              body={lastaudBodyTemplate}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='date'
              header='Date'
              body={dateBodyTemplate}
              sortable
              // sortFunction={customDateSort}
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='date_submitted'
              header='Date Submitted'
              body={datesubBodyTemplate}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='refund_amount'
              header='Refund Amount'
              body={refundamountbody}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='source'
              header='Source'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='repId'
              header='Rep'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='ord_balance'
              header='Order Balance'
              sortable
              body={orderbalancebody}
              style={{ width: '25%' }}
            ></Column>

            <Column
              field='auditorId'
              header='Auditor'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='date_reviewed'
              header='Date Reviewed'
              body={daterevBodyTemplate}
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='reptwoId'
              header='Rep #2'
              sortable
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='corrected'
              header='Corrected'
              sortable
              body={getCorrected}
              style={{ width: '25%' }}
            ></Column>
            <Column
              field='resub'
              header='Resub'
              sortable
              body={getResub}
              style={{ width: '25%' }}
            ></Column>
          </DataTable>
          <Button className={styles.addbutton} onClick={handlenewShow}>
            <Plus size={54} style={{ marginLeft: -2 }} />
          </Button>
        </>
      )}
      <Modal show={newitem} onHide={handlenewClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Createunres />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handlenewClose}>
            Close
          </Button>
          {/* // TODO: Do the form for created products. May need to create a seperate
          variant of 'updateForm' for this. Once done, move on to other pages! */}
        </Modal.Footer>
      </Modal>

      {modaldata.map((md) => (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{md.order}</Modal.Title>

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
                defaultValue={md.order}
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
              <Form.Label>Last Audit: &nbsp;</Form.Label>
              {md.last_audit === '' || md.last_audit === null ? (
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
                  onChange={(date) => handleDateAudChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker
                  selected={selectedaudDate || new Date(md.last_audit)}
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
                  onChange={(date) => handleDateAudChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}
              <br />
              <br />
              <Form.Label>Date: &nbsp;</Form.Label>
              {md.date === '' || md.date === null ? (
                <DatePicker
                  selected={selectedDate}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleDateChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker
                  selected={selectedDate || new Date(md.date)}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleDateChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}
              <br />
              <br />
              <Form.Label>Date Submitted: &nbsp;</Form.Label>
              {md.date_submitted === '' || md.date_submitted === null ? (
                <DatePicker
                  selected={selectedsubDate}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleDateSubChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker
                  selected={selectedsubDate || new Date(md.date_submitted)}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleDateSubChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}
              <br />
              <br />
              <Form.Label>Refund Amount</Form.Label>
              <Form.Control
                defaultValue={md.refund_amount}
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
                  updateForm({ refund_amount: e.target.value }, md.id)
                }
              />
              <br />
              <Form.Label>Source</Form.Label>
              <Form.Control
                defaultValue={md.source}
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
                onChange={(e) => updateForm({ source: e.target.value }, md.id)}
              />
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
                defaultValue={md.rep}
                onChange={(e) =>
                  updateForm({ repId: parseInt(e.target.value) }, md.id)
                }
              >
                {reps.map((r) => (
                  <option value={r.id}>{r.rep_name}</option>
                ))}
              </Form.Control>
              <br />
              <Form.Label>Order Balance</Form.Label>
              <Form.Control
                defaultValue={md.ord_balance}
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
                  updateForm({ ord_balance: e.target.value }, md.id)
                }
              />
              <br />
              <Form.Label>Denial Reason / Error Issue</Form.Label>
              <Form.Control
                defaultValue={md.denial_reason_error_issue}
                disabled={
                  (md.disabled_by === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id === md.disabled_by) ||
                  (md.disabled === true &&
                    reps.find((rep) => rep.email === session?.user?.email)
                      ?.id !== md.disabled_by) ||
                  md.disabled_by === null
                }
                as='textarea'
                rows={3}
                type='text'
                onChange={(e) =>
                  updateForm(
                    { denial_reason_error_issue: e.target.value },
                    md.id
                  )
                }
              />
              <br />
              <Form.Label>Auditor</Form.Label>
              <Form.Control
                as='select'
                aria-label='Auditor Select'
                defaultValue={md.aud}
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
                  updateForm({ auditorId: parseInt(e.target.value) }, md.id)
                }
              >
                {reps.map((r) => (
                  <option value={r.id}>{r.rep_name}</option>
                ))}
              </Form.Control>
              <br />
              <Form.Label>Date Reviewed: &nbsp;</Form.Label>
              {md.date_reviewed === '' || md.date_reviewed === null ? (
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
                  onChange={(date) => handleDateRevChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              ) : (
                <DatePicker
                  selected={selectedrevDate || new Date(md.date_reviewed)}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  onChange={(date) => handleDateRevChange(date, md.id)}
                  dateFormat='MM/dd/yyyy'
                />
              )}
              <br />
              <Form.Label>Rep #2</Form.Label>
              <Form.Control
                as='select'
                aria-label='RepTwo Select'
                defaultValue={md.reptwo}
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
                  updateForm({ reptwoId: parseInt(e.target.value) }, md.id)
                }
              >
                {reps.map((r) => (
                  <option value={r.id} key={r.id}>
                    {r.rep_name}
                  </option>
                ))}
              </Form.Control>
              <br />
              <Form.Check
                type='switch'
                label='Corrected'
                defaultChecked={md.corrected}
                onChange={(e) => updateForm({ corrected: e.target.checked })}
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
              <Form.Check
                type='switch'
                label='Resub'
                defaultChecked={md.resub}
                onChange={(e) => updateForm({ resub: e.target.checked })}
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
              <Form.Label>Correction Comments</Form.Label>
              <Form.Control
                defaultValue={md.correction_comments}
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
                  updateForm({ correction_comments: e.target.value }, md.id)
                }
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
              <Modal.Title>{md.order}</Modal.Title>

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
                  defaultValue={md.order}
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
                <Form.Label>Last Audit: &nbsp;</Form.Label>
                {md.last_audit === '' || md.last_audit === null ? (
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
                    onChange={(date) => handleDateAudChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                ) : (
                  <DatePicker
                    selected={selectedaudDate || new Date(md.last_audit)}
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
                    onChange={(date) => handleDateAudChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                )}
                <br />
                <br />
                <Form.Label>Date: &nbsp;</Form.Label>
                {md.date === '' || md.date === null ? (
                  <DatePicker
                    selected={selectedDate}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleDateChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                ) : (
                  <DatePicker
                    selected={selectedDate || new Date(md.date)}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleDateChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                )}
                <br />
                <br />
                <Form.Label>Date Submitted: &nbsp;</Form.Label>
                {md.date_submitted === '' || md.date_submitted === null ? (
                  <DatePicker
                    selected={selectedsubDate}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleDateSubChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                ) : (
                  <DatePicker
                    selected={selectedsubDate || new Date(md.date_submitted)}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleDateSubChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                )}
                <br />
                <br />
                <Form.Label>Refund Amount</Form.Label>
                <Form.Control
                  defaultValue={md.refund_amount}
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
                    updateForm({ refund_amount: e.target.value }, md.id)
                  }
                />
                <br />
                <Form.Label>Source</Form.Label>
                <Form.Control
                  defaultValue={md.source}
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
                    updateForm({ source: e.target.value }, md.id)
                  }
                />
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
                  defaultValue={md.rep}
                  onChange={(e) =>
                    updateForm({ repId: parseInt(e.target.value) }, md.id)
                  }
                >
                  {reps.map((r) => (
                    <option value={r.id}>{r.rep_name}</option>
                  ))}
                </Form.Control>
                <br />
                <Form.Label>Order Balance</Form.Label>
                <Form.Control
                  defaultValue={md.ord_balance}
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
                    updateForm({ ord_balance: e.target.value }, md.id)
                  }
                />
                <br />
                <Form.Label>Denial Reason / Error Issue</Form.Label>
                <Form.Control
                  defaultValue={md.denial_reason_error_issue}
                  disabled={
                    (md.disabled_by === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id === md.disabled_by) ||
                    (md.disabled === true &&
                      reps.find((rep) => rep.email === session?.user?.email)
                        ?.id !== md.disabled_by) ||
                    md.disabled_by === null
                  }
                  as='textarea'
                  rows={3}
                  type='text'
                  onChange={(e) =>
                    updateForm(
                      { denial_reason_error_issue: e.target.value },
                      md.id
                    )
                  }
                />
                <br />
                <Form.Label>Auditor</Form.Label>
                <Form.Control
                  as='select'
                  aria-label='Auditor Select'
                  defaultValue={md.aud}
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
                    updateForm({ auditorId: parseInt(e.target.value) }, md.id)
                  }
                >
                  {reps.map((r) => (
                    <option value={r.id}>{r.rep_name}</option>
                  ))}
                </Form.Control>
                <br />
                <Form.Label>Date Reviewed: &nbsp;</Form.Label>
                {md.date_reviewed === '' || md.date_reviewed === null ? (
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
                    onChange={(date) => handleDateRevChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                ) : (
                  <DatePicker
                    selected={selectedrevDate || new Date(md.date_reviewed)}
                    disabled={
                      (md.disabled_by === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id === md.disabled_by) ||
                      (md.disabled === true &&
                        reps.find((rep) => rep.email === session?.user?.email)
                          ?.id !== md.disabled_by) ||
                      md.disabled_by === null
                    }
                    onChange={(date) => handleDateRevChange(date, md.id)}
                    dateFormat='MM/dd/yyyy'
                  />
                )}
                <br />
                <Form.Label>Rep #2</Form.Label>
                <Form.Control
                  as='select'
                  aria-label='RepTwo Select'
                  defaultValue={md.reptwo}
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
                    updateForm({ reptwoId: parseInt(e.target.value) }, md.id)
                  }
                >
                  {reps.map((r) => (
                    <option value={r.id} key={r.id}>
                      {r.rep_name}
                    </option>
                  ))}
                </Form.Control>
                <br />
                <Form.Check
                  type='switch'
                  label='Corrected'
                  defaultChecked={md.corrected}
                  onChange={(e) => updateForm({ corrected: e.target.checked })}
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
                <Form.Check
                  type='switch'
                  label='Resub'
                  defaultChecked={md.resub}
                  onChange={(e) => updateForm({ resub: e.target.checked })}
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
                <Form.Label>Correction Comments</Form.Label>
                <Form.Control
                  defaultValue={md.correction_comments}
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
                    updateForm({ correction_comments: e.target.value }, md.id)
                  }
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

              <Toast
                show={lockedshow}
                onClose={handlelockedclose}
                className={styles.alert}
              >
                <Toast.Header>
                  <strong className='me-auto'>Bootstrap</strong>
                  <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
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
