// @ts-nocheck
import { Spinner } from 'react-bootstrap';

export default function SpinnerComponent() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    </>
  );
}
