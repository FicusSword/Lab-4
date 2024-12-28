import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export function Assisten() {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    setShowModal(true); 
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Введите ваши данные</h2>
      <form>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Номер телефона:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Введите номер телефона"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Электронная почта:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите электронную почту"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>
        <button type="button" onClick={handleSubmit} style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Отправить
        </button>
      </form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Данные отправлены</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ваши данные были успешно отправлены. Ожидайте звонок от нашего менеджера.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" href="/Home">
            Return to Home page
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
