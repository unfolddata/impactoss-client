import { reduce } from 'lodash/collection';

import { cleanupSearchTarget } from 'utils/string';
import asList from 'utils/as-list';
import isNumber from 'utils/is-number';

// check if entity has nested connection by id
export const testEntityEntityAssociation = (entity, path, associatedId) =>
  entity.get(path) && entity.get(path).includes(parseInt(associatedId, 10));

// check if entity has nested category by id
export const testEntityCategoryAssociation = (entity, categoryId) =>
  testEntityEntityAssociation(entity, 'categories', categoryId);

// check if entity has any category by taxonomy id
export const testEntityTaxonomyAssociation = (entity, categories, taxonomyId) =>
  entity
  .get('categories')
  .map((catId) => categories.size > 0 &&
    categories
    .get(catId.toString())
    .getIn(['attributes', 'taxonomy_id']))
  .includes(taxonomyId);

// check if entity has any nested connection by type
export const testEntityAssociation = (entity, associatedPath) =>
  entity.get(associatedPath) && entity.get(associatedPath).size > 0;

// prep searchtarget, incl id
export const prepareEntitySearchTarget = (entity, fields) =>
  reduce(
    fields,
    (target, field) => `${target} ${cleanupSearchTarget(entity.getIn(['attributes', field]))}`,
    entity.get('id')
  );
// comparison of attribute values, force string, check 'null' if unspecified
export const attributesEqual = (testValue, value) =>
  value.toString() === ((typeof testValue === 'undefined' || testValue === null)
    ? 'null'
    : testValue.toString());

export const getConnectedCategories = (entityConnectedIds, taxonomyCategories, path) =>
  taxonomyCategories.filter((category) =>
    entityConnectedIds.reduce((passing, connectionId) =>
      passing || testEntityEntityAssociation(category, path, connectionId)
    , false)
  );


// filter entities by absence of association either by taxonomy id or connection type
// assumes prior nesting of relationships
export const filterEntitiesWithoutAssociation = (entities, categories, query) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, pathOrTax) =>
      passing && !(isNumber(pathOrTax)
        ? testEntityTaxonomyAssociation(entity, categories, parseInt(pathOrTax, 10))
        : testEntityAssociation(entity, pathOrTax)
      )
    , true)
  );

// filter entities by association with one or more categories
// assumes prior nesting of relationships
export const filterEntitiesByCategories = (entities, query) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, categoryId) =>
      passing && testEntityCategoryAssociation(entity, parseInt(categoryId, 10))
    , true)
  );

// filter entities by association with one or more categories
// assumes prior nesting of relationships
export const filterEntitiesByConnectedCategories = (entities, connections, query) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, queryArg) => {
      const pathValue = queryArg.split(':');
      const path = pathValue[0];
      const connectionsForPath = connections.get(path);
      return connectionsForPath
        ? passing && connectionsForPath.reduce((passingConnection, connection) =>
          // test
          // if any connection is associated with entity AND if connection is associated to category
          passingConnection || (
            testEntityEntityAssociation(entity, path, connection.get('id'))
            && testEntityCategoryAssociation(connection, pathValue[1])
          )
        , false)
        : passing;
    }
    , true)
  );

// filter entities by by association with one or more entities of specific connection type
// assumes prior nesting of relationships
export const filterEntitiesByConnection = (entities, query) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, queryArg) => {
      const pathValue = queryArg.split(':');
      const path = pathValue[0];
      return entity.get(path)
        ? passing && testEntityEntityAssociation(entity, path, pathValue[1])
        : passing;
    }, true)
  );

// query is object not string!
export const filterEntitiesByAttributes = (entities, query) =>
  entities.filter((entity) =>
    reduce(query, (passing, value, attribute) =>
      // TODO if !passing return false, no point going further
      passing && ((attribute === 'id')
      ? attributesEqual(entity.get('id'), value)
      : attributesEqual(entity.getIn(['attributes', attribute]), value))
    , true)
  );

const getEntitySortValueMapper = (entity, sortBy) => {
  switch (sortBy) {
    case 'id':
      // ID field needs to be treated as an int when sorting
      return entity.get(sortBy);
    default:
      return entity.getIn(['attributes', sortBy]);
  }
};
const getEntitySortComparator = (valueA, valueB, sortOrder, type) => {
  // check equality
  if (valueA === valueB) {
    return 0;
  }
  let result;
  if (type === 'date') {
    result = new Date(valueA) < new Date(valueB) ? -1 : 1;
  } else {
    const floatA = parseFloat(valueA);
    const floatB = parseFloat(valueB);
    const aStartsWithNumber = !isNaN(floatA);
    const bStartsWithNumber = !isNaN(floatB);
    if (aStartsWithNumber && !bStartsWithNumber) {
      result = -1;
    } else if (!aStartsWithNumber && bStartsWithNumber) {
      result = 1;
    } else if (aStartsWithNumber && bStartsWithNumber) {
      const aIsNumber = aStartsWithNumber && isFinite(valueA);
      const bIsNumber = aStartsWithNumber && isFinite(valueA);
      if (aIsNumber && !bIsNumber) {
        result = -1;
      } else if (!aIsNumber && bIsNumber) {
        result = 1;
      } else if (aIsNumber && bIsNumber) {
        // both numbers
        result = floatA < floatB ? -1 : 1;
      } else if (floatA !== floatB) {
        // both starting with number but are not numbers entirely
        // compare numbers first then remaining strings if numbers equal
        result = floatA < floatB ? -1 : 1;
      } else {
        result = getEntitySortComparator(
          valueA.slice(floatA.toString().length - (valueA.slice(0, 1) === '.' ? 1 : 0)),
          valueB.slice(floatB.toString().length - (valueB.slice(0, 1) === '.' ? 1 : 0)),
          'asc'
        );
      }
    } else {
      // neither starting with number
      result = valueA < valueB ? -1 : 1;
    }
  }
  return sortOrder === 'desc' ? result * -1 : result;
};
export const sortEntities = (entities, sortOrder, sortBy, type) =>
  entities
    .sortBy(
      (entity) => getEntitySortValueMapper(entity, sortBy || 'id'),
      (a, b) => getEntitySortComparator(a, b, sortOrder || 'asc', type)
    ).toList();

export const entitiesSetAssociated = (entities, entityKey, associations, associationKey, associationId) =>
  entities && entities.map((entity) =>
    entity.set('associated',
      associations.find((association) =>
        attributesEqual(association.getIn(['attributes', entityKey]), entity.get('id'))
        && attributesEqual(association.getIn(['attributes', associationKey]), associationId)
      )
    )
  );

export const entitySetUser = (entity, users) =>
  entity && entity.set('user',
    users.find((user) => attributesEqual(entity.getIn(['attributes', 'last_modified_user_id']), user.get('id')))
  );

export const prepareTaxonomiesAssociated = (taxonomies, categories, associations, tagsKey, entityKey, entityId) =>
  taxonomies && taxonomies
  .filter((tax) => tax.getIn(['attributes', tagsKey]))
  .map((tax) => tax.set('categories', entitiesSetAssociated(
    categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))),
    'category_id',
    associations,
    entityKey,
    entityId
  )));

export const prepareTaxonomies = (taxonomies, categories, tagsKey) =>
  taxonomies && taxonomies
  .filter((tax) => tax.getIn(['attributes', tagsKey]))
  .map((tax) => tax.set('categories',
    categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id')))
  ));

export const prepareCategory = (category, users, taxonomies) =>
  category && entitySetUser(
    category.set('taxonomy', taxonomies.find((tax) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), tax.get('id')))),
    users
  );

export const usersSetRoles = (users, userRoles, roleId) =>
  users && users
  .filter((user) => {
    const roles = userRoles.filter((association) =>
      attributesEqual(association.getIn(['attributes', 'role_id']), roleId)
      && attributesEqual(association.getIn(['attributes', 'user_id']), user.get('id'))
    );
    return roles && roles.size > 0;
  });
