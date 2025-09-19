import { Contact } from '../models/contact.js';

export async function getAllContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findById(contactId);
}

export async function createContact(payload) {
  return Contact.create(payload);
}

export async function deleteContact(contactId) {
  return Contact.findOneAndDelete({ _id: contactId });
}

export async function updateContact(contactId, payload) {
  const result = await Contact.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  if (!result || !result.value) return null;

  return {
    value: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
}
