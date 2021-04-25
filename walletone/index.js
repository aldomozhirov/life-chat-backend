'use strict';

const fetch = require('node-fetch');
const generateId = require('../utils/generateId.util');

const getToken = () => {
  return fetch(
    `http://185.209.114.26:9001/auth/realms/plutdev/protocol/openid-connect/token`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: new URLSearchParams({
        username: 'agent1',
        password: 'agent1',
        grant_type: 'password',
        tocken_type: 'bearer',
        client_secret: 'e5d2b5c1-4211-48aa-b272-91d75f4ab0e5',
        client_id: 'agentService',
      }),
    },
  )
    .then(response => response.json())
    .then(result => result.access_token);
};

const createInvoice = async amount => {
  const token = await getToken();

  return fetch(`http://185.209.114.26:8080/invoicing/invoice/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      externalId: generateId(),
      fromPerson: {
        id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
      },
      toPerson: {
        id: '48e48db9-b40b-48ca-aeb8-687b55b22b16',
      },
      payload: {
        transferNote: {
          note: 'test',
        },
        finance: {
          userAmount: amount,
        },
        providerIn: 'TESTCARD',
        providerOut: 'TESTCARD',
      },
    }),
  })
    .then(response => response.json())
    .then(result => result.id);
};

const acceptInvoice = async invoiceId => {
  const token = await getToken();

  return fetch(
    `http://185.209.114.26:8080/invoicing/invoice/${invoiceId}/accept`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
    .then(response => response.json())
    .then(result => result.id);
};

exports.getInvoiceStatus = async invoiceId => {
  const token = await getToken();

  return fetch(`http://185.209.114.26:8080/invoicing/invoice/${invoiceId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
};

exports.generateInvoice = async amount => {
  return createInvoice(amount).then(id1 => {
    return acceptInvoice(id1).then(async id2 => {
      return this.getInvoiceStatus(id2);
    });
  });
};
