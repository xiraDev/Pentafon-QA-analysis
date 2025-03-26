const Promise = require("bluebird");
// repositories
const {
  sendgridEmailByScheduledAction,
} = require("../repositories/email.repository");
const {
  Create: AttemptCreate,
  FetchByCustomer: AttemptFetchByCustomer,
} = require("../repositories/sql/attempt.repository");
const {
  Create: HLogCreate,
} = require("../repositories/email-history-logs.repository");
const { FetchAllWithDebt, FetchAllWithDebtV2 } = require("../repositories/customer.repository");
const { update: CAUpdate } = require("../repositories/sql/contact-actions.repository");
// helpers
const { isEmpty, buildWhereClauses } = require("../helpers");
// dictionaries
const {
  ACTIONS_CHANNEL,
  ATTEMPT_STATUS,
  CONTACT_ACTION_STATUS,
} = require("../dictionary/sender-service.dictionary");
const { HLOG_TAG } = require("../dictionary/tag-history-log.dictionary");
const contactActionService = require('../repositories/sql/contact-actions.repository');

// ----------------------------------------------------------------------

const SENDGRID_CUSTOMER_GROUP = parseInt(process.env.SENDGRID_CUSTOMER_GROUP);

const SENDGRID_WAIT_TIME = parseInt(process.env.SENDGRID_WAIT_TIME);

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// ----------------------------------------------------------------------

const sendSendgridEmails = async (
  newContactAction,
  attemptFilters,
  customerFilters,
  pulse
) => {
  console.log("Preparing email delivery service");
  console.log("Scheduled contact action:", newContactAction.id);

  const message = newContactAction.message;

  const findCA = await contactActionService.findBasic(newContactAction.id);

  let successfulEmailCount = findCA.contactedCustomers ?? 0;
  let caCancelled = false;

  const attemptsWhere = buildWhereClauses({
    filters: attemptFilters,
    isForCustomers: false,
  });
  const customersWhere = buildWhereClauses({
    filters: customerFilters,
    isForCustomers: false,
  });

  const customers = await FetchAllWithDebtV2({
    offset: findCA.contactedCustomers ?? 0,
    limit: 100000,
    attemptsWhere,
    customersWhere,
  });

  await CAUpdate(
    {
      customersToContact: customers.count,
    },
    newContactAction.id
  );

  customers.rows.forEach((element) => {
    return console.log("customer: ", element.id);
  });

  for (let i = 0; i < customers.rows.length; i += SENDGRID_CUSTOMER_GROUP) {
    const { isCancelled } = await checkJob(pulse, newContactAction.id);

    if (isCancelled) {
      caCancelled = true;
      break;
    }

    const customerGroup = customers.rows.slice(i, i + SENDGRID_CUSTOMER_GROUP);
    const start = i + 1;
    const end = Math.min(i + SENDGRID_CUSTOMER_GROUP, customers.rows.length);
    console.log(
      `Email for the customer group: ${start} - ${end} of ${customers.rows.length} | CA: ${newContactAction.id}`
    );

    successfulEmailCount += await makeEmails(
      customerGroup,
      newContactAction,
      message
    );

    await CAUpdate(
      {
        contactedCustomers: successfulEmailCount,
      },
      newContactAction.id
    );
    if (i + SENDGRID_CUSTOMER_GROUP < customers.rows.length) {
      // Waiting time between customer groups
      console.log(`Waiting for ${SENDGRID_WAIT_TIME} seconds...`);
      await delay(SENDGRID_WAIT_TIME * 1000); // Wait for the specified time in milliseconds
    }
  }

  await setCAStatusResult(newContactAction.id, caCancelled);
  console.log(
    `Total number of customers contacted: ${successfulEmailCount} - CA: ${newContactAction.id}`
  );
};

async function makeEmails(customerGroup, newContactAction, message) {
  const personalizations = customerGroup
    .filter((_customer) => _customer.email !== "0")
    .map((_customer) => ({
      to: _customer.email,
      substitutions: {
        name: _customer.name,
        customerId: _customer.customerId,
        customerNumber: _customer.customerNumber,
        accountNumber: _customer.accountNumber,
        message,
        emailHeader: process.env.EMAIL_HEADER,
        emailFooter: process.env.EMAIL_FOOTER,
        title: "Cobranza",
      },
    }));

  console.log({ personalizations });

  const file = isEmpty(newContactAction.emailTemplateId)
    ? undefined
    : newContactAction.emailTemplateId;

  const emailSent = await sendgridEmailByScheduledAction({
    emailFile: file,
    personalizations,
  });

  let successfulSentCount = 0;

  if (
    emailSent.response?.body?.errors &&
    emailSent.response?.body?.errors.length > 0
  ) {
    await new Promise.map(customerGroup, async (item) => {
      const attempts = await AttemptFetchByCustomer(item.id);

      const newAttempt = await AttemptCreate({
        attemptNo: attempts + 1,
        actionChannel: ACTIONS_CHANNEL.EMAIL,
        message,
        actionStatus: ATTEMPT_STATUS.NO_SUCCESS_EMAIL,
        customerId: item.id,
        contactActionId: newContactAction.id,
      });

      await HLogCreate({
        request: personalizations,
        statusCode: emailSent.code,
        response: emailSent.response,
        url: HLOG_TAG.SENDGRID_SERVICE,
        attemptId: newAttempt.id,
      });
    })
      .then(function () {
        console.log("Attempts have been created");
      })
      .catch(function (error) {
        console.error("error", error);
      });
  } else {
    await new Promise.map(customerGroup, async (item) => {
      if (!isEmpty(item.email) && item.email && item.email !== "0") {
        successfulSentCount++;

        const attempts = await AttemptFetchByCustomer(item.id);

        const newAttempt = await AttemptCreate({
          attemptNo: attempts + 1,
          actionChannel: ACTIONS_CHANNEL.EMAIL,
          message,
          actionStatus: ATTEMPT_STATUS.PENDING,
          sgMessageId: emailSent?.headers["x-message-id"],
          customerId: item.id,
          contactActionId: newContactAction.id,
        });

        await HLogCreate({
          request: personalizations,
          statusCode: emailSent.statusCode,
          response: emailSent,
          url: HLOG_TAG.SENDGRID_SERVICE,
          attemptId: newAttempt.id,
        });
      } else {
        const attempts = await AttemptFetchByCustomer(item.id);

        const newAttempt = await AttemptCreate({
          attemptNo: attempts + 1,
          actionChannel: ACTIONS_CHANNEL.EMAIL,
          message,
          actionStatus: ATTEMPT_STATUS.NO_SUCCESS_EMAIL,
          customerId: item.id,
          contactActionId: newContactAction.id,
        });

        await HLogCreate({
          request: personalizations,
          statusCode: 400,
          response: {
            errors: [
              {
                message:
                  "Email missing: The personalizations field is required and must have at least one personalization.",
                field: "personalizations",
              },
            ],
          },
          url: HLOG_TAG.SENDGRID_SERVICE,
          attemptId: newAttempt.id,
        });
      }
    })
      .then(function () {
        console.log("Attempts have been created");
      })
      .catch(function (error) {
        console.error("error", error);
      });
  }

  return successfulSentCount;
}

// ----------------------------------------------------------------------

const setCAStatusResult = async (id, isCancelled) => {
  if (isCancelled) {
    return;
  }

  await CAUpdate(
    {
      status: CONTACT_ACTION_STATUS.FINALIZED,
    },
    id
  );
};

const checkJob = async (pulse, contactActionId) => {
  let isCancelled = false;
  let isDisabled = false;
  let job = [];

  job = await pulse.jobs({
    "data.contactAction.id": contactActionId,
  });

  isDisabled = job[0]?.attrs?.disabled ?? false;

  while (isDisabled) {
    console.log(
      "Contact action job paused. Waiting to resume:",
      contactActionId
    );

    await delay(20 * 1000);

    job = await pulse.jobs({
      "data.contactAction.id": contactActionId,
    });

    isDisabled = job[0]?.attrs?.disabled ?? false;

    if (!isDisabled) {
      if (isEmpty(job)) {
        console.log("Contact action job cancelled:", contactActionId);
        isCancelled = true;
      } else {
        await CAUpdate(
          {
            status: CONTACT_ACTION_STATUS.IN_PROGRESS,
          },
          contactActionId
        );
      }
    }
  }

  if (isEmpty(job)) {
    console.log("Contact action job cancelled:", contactActionId);
    isCancelled = true;
  }

  return { isCancelled, job };
};

module.exports = {
  sendSendgridEmails,
};
