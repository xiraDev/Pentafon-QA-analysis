const { Op } = require("sequelize");
// helpers
const { zoneByRegion } = require("./check-time-zone");

const Operator = {
  ">=": Op.gte,
  "===": Op.eq,
  "<=": Op.lte,
  ">": Op.gt,
  "<": Op.lt,
  "!=": Op.ne,
  "in": Op.in,
  "notIn": Op.notIn,
  "like": Op.like,
  "notLike": Op.notLike,
  "regexp": Op.regexp,
  "notRegexp": Op.notRegexp,
  "between": Op.between,
  "notBetween": Op.notBetween,
};

// ----------------------------------------------------------------------

/**
 * The function builds a where clause object based on a set of filters and their conditions.
 * @param filters - an array of objects containing filter conditions and rules to be applied to a
 * database query. Each object in the array has the following properties: { filter, condition, rule }
 * @returns The function `buildWhereClauses` returns an object representing the where clause to be used
 * in a Sequelize query, based on the filters passed as an argument. The object contains key-value
 * pairs where the key is the filter name and the value is an object with a Sequelize operator and the
 * corresponding rule value.
 */
const buildWhereClauses = ({
  filters = [],
  isForCustomers = true,
  dateRange,
  isFromCA = false,
  uuidFields = [], // Pass an array of UUID field names
}) => {
  let whereClause = {};

  for (const param of filters) {
    if (param.condition.includes("-"))
      param.condition = param.condition.split("-")[0];

    if (param.filter === "region") {
      param.filter = "state";
      param.rule = (zoneByRegion[param.rule] || zoneByRegion.default)();
    }

    // Check dynamically if the field is a UUID field
    const isUUIDField = uuidFields.includes(param.filter);
    let operator = Operator[param.condition] || Op.eq; // Default to Op.eq

    // Ensure UUID fields always use Op.eq
    if (isUUIDField) {
      operator = Op.eq;
    }

    // Build condition
    let conditionValue =
      operator === Op.like || operator === Op.notLike
        ? `%${param.rule}%`
        : param.rule;

        if (param.filter in whereClause) {
          whereClause[param.filter] = {
            [Op.or]: [
              whereClause[param.filter],
              { [operator]: conditionValue },
            ],
          };
        } else {
          whereClause[param.filter] = { [operator]: conditionValue };
        }
  }

  if (dateRange?.from && dateRange?.to) {
    const { from, to } = dateRange;
    whereClause.createdAt = whereClause.createdAt
      ? { [Op.or]: [whereClause.createdAt, { [Op.between]: [from, to] }] }
      : { [Op.between]: [from, to] };
  }

  if (isForCustomers)
    whereClause["isInDebt"] = isFromCA ? { [Op.eq]: true } : true;
  
  return whereClause;
};

module.exports = {
  buildWhereClauses,
};
