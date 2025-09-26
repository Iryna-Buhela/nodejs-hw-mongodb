export function parseFilterParams(query) {
  const { type, isFavourite } = query;

  const filter = {};

  const allTypes = ['work', 'home', 'personal'];
  if (allTypes.includes(type)) {
    filter.contactType = type;
  }

  if (isFavourite === 'true' || isFavourite === 'false') {
    filter.isFavourite = isFavourite === 'true';
  }

  return filter;
}
