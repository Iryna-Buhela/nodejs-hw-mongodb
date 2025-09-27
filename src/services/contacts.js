import { Contact } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = Contact.find(filter);

  const [contactsCount, contacts] = await Promise.all([
    Contact.countDocuments(contactsQuery.getFilter()),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
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
  return Contact.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
  });
}
