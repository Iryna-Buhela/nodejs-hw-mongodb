import { Contact } from '../models/contact.js';
/**/ import { contactSchema } from '../models/contact.js';

export async function getAllContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findById(contactId);
}

export async function createContact(payload) {
  /**/ const contact = await contactSchema.create(payload);
  return contact;
}

export async function deleteContact(contactId) {
  const contact = await contactSchema.findOneAndDelete({
    _id: contactId,
  });

  return contact;
}

export async function updateContact(contactId, payload, options = {}) {
  const rawResult = await contactSchema.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}
