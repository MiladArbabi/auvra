// src/app/actions/account.js
"use server";

import { sf } from '@/lib/shopify';

const customerCreateMutation = /* GraphQL */ `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customer {
        id
        email
      }
    }
  }
`;

export async function register(email, password) {
  // We need to re-import sf here because this is a new file
  const data = await sf(customerCreateMutation, {
    input: { email, password },
  });
  return data?.customerCreate;
}