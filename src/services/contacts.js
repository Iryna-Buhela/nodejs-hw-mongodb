import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = Contact.find({ userId, ...filter });

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

export async function getContactById(contactId, userId) {
  return Contact.findOne({ _id: contactId, userId });
}

export async function createContact(payload) {
  return Contact.create(payload);
}

export async function deleteContact(contactId, userId) {
  return Contact.findOneAndDelete({ _id: contactId, userId });
}

export async function updateContact(contactId, payload, userId, options = {}) {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
    ...options,
  });
}
